import { Position } from "geojson";
import { isEqual } from "lodash";
import { normalize } from "station-normalize";
import { score } from "../../score";
import { scoreCoordinateLocation } from "../../transform/coordinateLocation";
import { LocationV4, Location, Claims } from "../../types/location";
import { ClaimObject, CodeIssuer, Property } from "../../types/wikidata";
import { logger } from "../../utils/logger";
import { matchIds } from "../match";
import { propertyMatch } from "../match/property";

const isLocation = (
  entities: (Location | LocationV4)[]
): entities is Location[] => {
  return (entities?.[0] as Location).type === "Feature";
};
const isMultiPoint = (
  position: Position[] | Position
): position is Position[] => {
  return Array.isArray(position[0]);
};

const isNotLocation = (
  entities: (Location | LocationV4)[]
): entities is LocationV4[] => {
  return !isLocation(entities);
};

const containsPoint = (coordinate: Position, multiPoint: Position[]) => {
  return multiPoint.some((p) => isEqual(coordinate, p));
};

const mergeProperty = async (properties: ClaimObject<any>[]) => {
  const result: ClaimObject<any> = { info: { pregrouped: [], reliability: 0 } };
  // properties.forEach((prop) => {
  for await (const prop of properties) {
    if (!result.value) result.value = prop.value;
    else if (result.value.toLowerCase() !== prop?.value.toLowerCase())
      logger.warn(
        { result, prop, properties },
        "Are we sure these values can be merged?"
      );

    if (prop.references) {
      result.references ||= [];
      (Array.isArray(prop.references)
        ? prop.references
        : [prop.references]
      ).forEach((ref) => (result.references as any).push(ref));
    }

    if (prop.qualifiers) {
      if (result.qualifiers) {
        result.qualifiers = await mergeProperties(
          result.qualifiers,
          prop.qualifiers
        );
      } else {
        result.qualifiers = prop.qualifiers;
      }
    }

    if (prop.info?.pregrouped) {
      prop.info?.pregrouped?.forEach((i: any) =>
        result.info?.pregrouped?.push(i)
      );
    } else if (prop.info) {
      result.info?.pregrouped?.push(prop.info);
    }

    if (prop.info) {
      result.info!.reliability! =
        (result.info!.reliability || 0) + (prop.info?.reliability || 0);
    }
  }
  return result;
};

const mergeProperties = async (accumulated: Claims, properties: Claims) => {
  const entries = Object.entries(properties) as [
    CodeIssuer | Property,
    ClaimObject<any>[] | undefined
  ][];
  for await (const [propertiesKey, values] of entries) {
    if (!values?.length) continue;

    for await (const value of values) {
      const { match, origin } =
        (
          await propertyMatch(
            propertiesKey,
            [value],
            accumulated[propertiesKey] || []
          )
        )?.[0] || {};

      accumulated[propertiesKey] ||= [];
      if (match && origin) {
        accumulated[propertiesKey]![
          accumulated[propertiesKey]?.indexOf(origin)!
        ] = await mergeProperty([value, origin]);
      } else {
        accumulated[propertiesKey]!.push(value);
      }
      if (
        accumulated[propertiesKey]!.length >
        new Set(accumulated[propertiesKey]!.map(({ value }) => value)).size
      ) {
        // logger.warn({
        //   propertiesKey,
        //   accumalated: accumulated[propertiesKey],
        //   value,
        // }, 'Some clasing values');
      }
    }
  }
  return accumulated;
};

export const merge = async (
  locations: Location[],
  skipCoordinates?: boolean
): Promise<Location> => {
  let id: string | undefined = "";
  const geometry: Location["geometry"] = {
    type: "MultiPoint",
    coordinates: [],
  };
  const properties: Location["properties"] = {
    labels: [],
  };

  for await (const { id: i, geometry: g, ...entity } of locations) {
    const { id: noop, info, labels, ...p } = entity.properties;

    // Id
    id = id === undefined ? i?.toString() : id.toString() + "-" + i;

    // Labels
    labels.forEach((label) => {
      if (
        !properties.labels.some(
          (b) => normalize(label.value) === normalize(b.value) && label.lang === b.lang
        )
      ) {
        properties.labels.push({ ...label, value: normalize(label.value) });
      }
    });

    // Coordinates, skipping it only returns the first coordinats
    if (!skipCoordinates || geometry.coordinates.length === 0) {
      const coordinates = g.coordinates;
      if (isMultiPoint(coordinates)) {
        coordinates.forEach(
          (c) =>
            !containsPoint(c, geometry.coordinates) &&
            geometry.coordinates.push(c)
        );
      } else if (!containsPoint(coordinates, geometry.coordinates))
        geometry.coordinates.push(coordinates);
    }

    // Info
    if (info) {
      const { pregrouped, ...clone } = info;
      properties.info ||= {};
      properties.info!.pregrouped ||= [];
      properties.info!.pregrouped.push(clone);
    }

    // Properties
    Object.assign(properties, await mergeProperties(properties, p));
  }

  return {
    type: "Feature",
    id,
    geometry,
    properties,
  };
};

export const mergeMultipleEntities = (
  entities: (LocationV4 | Location)[],
  skipCoordinates?: boolean
): LocationV4 | Location => {
  if (isLocation(entities)) {
    return entities.reduce<Location>(
      (result, entity) => {
        let claimsKey: CodeIssuer | Property;
        const { id, info, labels, ...properties } = entity.properties;
        for (claimsKey in properties) {
          if (
            Object.prototype.hasOwnProperty.call(entity.properties, claimsKey)
          ) {
            const values = entity.properties[claimsKey];
            if (!values?.length) continue;
            values.forEach((value: any) => {
              if (value === undefined) return;
              result.properties[claimsKey] ||= [];
              if (
                !result.properties[claimsKey]?.some((a) => isEqual(a, value))
              ) {
                result.properties[claimsKey]!.push(value);
              }
            });
          }
        }

        entity.properties.labels.forEach((label) => {
          if (
            !result.properties.labels.some(
              (b) => label.value === b.value && label.lang === b.lang
            )
          ) {
            result.properties.labels.push(label);
          }
        });

        if (!skipCoordinates || result.geometry.coordinates.length === 0) {
          const coordinates = entity.geometry.coordinates;
          if (Array.isArray(coordinates[0])) {
            coordinates.forEach((c) =>
              result.geometry.coordinates.push(c as any)
            );
          } else [result.geometry.coordinates.push(coordinates as any)];
        }

        if (entity.properties.info) {
          const { pregrouped, ...clone } = entity.properties.info;
          result.properties.info ||= {};
          result.properties.info!.pregrouped ||= [];
          result.properties.info!.pregrouped.push(clone);
        }

        return result;
      },
      {
        type: "Feature",
        geometry: { type: "MultiPoint", coordinates: [] },
        properties: {
          labels: [],
        },
        id: entities[0].id?.toString()!,
      }
    );
  } else if (isNotLocation(entities)) {
    return entities.reduce<LocationV4>(
      (result, entity) => {
        let claimsKey: keyof LocationV4["claims"];
        for (claimsKey in entity.claims) {
          if (Object.prototype.hasOwnProperty.call(entity.claims, claimsKey)) {
            const values = entity.claims[claimsKey];
            if (!values?.length) continue;
            values.forEach((value: any) => {
              if (value === undefined) return;
              result.claims[claimsKey] ||= [];
              if (!result.claims[claimsKey]!.includes(value)) {
                result.claims[claimsKey]!.push(value);
              }
            });
          }
        }

        entity.labels.forEach((label) => {
          if (
            !result.labels.some(
              (b) => label.value === b.value && label.lang === b.lang
            )
          ) {
            result.labels.push(label);
          }
        });

        if (entity.info) {
          const { pregrouped, ...clone } = entity.info;
          result.info ||= {};
          result.info!.pregrouped ||= [];
          result.info!.pregrouped.push(clone);
        }
        return result;
      },
      { labels: [], claims: {}, id: entities[0].id?.toString()! }
    );
  }

  throw new Error("failed");
};

export async function matchAndMerge(
  origin: Location[],
  to: Location[],
  ok?: (a: Location, b: Location) => Promise<any>
) {
  await Promise.all(
    origin.map(async (a) => {
      const matchByIds = to.filter((b) => matchIds(b, a));

      if (matchByIds.length === 1) {
        const [idLoc, scored] = (
          await Promise.all(
            matchByIds.map(
              async (idLoc) =>
                [idLoc, await score(idLoc, a)] as [
                  Location,
                  Awaited<ReturnType<typeof score>>
                ]
            )
          )
        ).sort((a, b) => b[1].percentage - a[1].percentage)?.[0];

        if (scored.percentage >= 2) {
          await ok?.(a, idLoc);
          return;
        } else {
          // console.log(
          //   "id",
          //   require("util").inspect(
          //     {
          //       matchByIds,
          //       a,
          //       idLoc,
          //       scored,
          //       aLabel: a.properties.labels,
          //       idLocLabels: idLoc.properties.labels,
          //     },
          //     undefined,
          //     6,
          //     true
          //   )
          // );
        }
      }

      const matchedByDistance = to.filter((b) => {
        return scoreCoordinateLocation(
          (isMultiPoint(a.geometry.coordinates)
            ? a.geometry.coordinates
            : [a.geometry.coordinates]
          ).map((value) => ({ value: value as any })),

          (isMultiPoint(b.geometry.coordinates)
            ? b.geometry.coordinates
            : [b.geometry.coordinates]
          ).map((value) => ({ value: value as any })),

          { maxDistance: 8000 }
        ).some((i) => i.match);
      });
      if (matchedByDistance.length) {
        const scoredByDistance = (
          await Promise.all(
            matchedByDistance.map(
              async (b) => [b, await score(a, b)] as [Location, any]
            )
          )
        )?.sort((a, b) => b[1].percentage - a[1].percentage);
        const [idLoc, scored] = scoredByDistance?.[0];
        if (scored.percentage >= 2) {
          await ok?.(a, idLoc);
        } else {
          // console.log(
          //   require("util").inspect(
          //     {
          //       scoredByDistance: scoredByDistance.map((l) => l[1].percentage),
          //       scored: idLoc.properties.labels,
          //       scoredId: idLoc.id,
          //       a: a.properties.labels,
          //       aId: a.id,
          //     },
          //     false,
          //     5,
          //     true
          //   )
          // );
        }
      }
    })
  );
}
