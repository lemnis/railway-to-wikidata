import { coordEach, multiPoint } from "@turf/turf";
import { isEqual } from "lodash";
import { normalize } from "station-name-diff";
import { score } from "../../score";
import { scoreCoordinateLocation } from "../../transform/coordinateLocation";
import { Location, Claims } from "../../types/location";
import { ClaimObject, CodeIssuer, Property } from "../../types/wikidata";
import { logger } from "../../utils/logger";
import { matchIds } from "../match";
import { propertyMatch } from "../match/property";

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
    }
  }
  return accumulated;
};

export const merge = async (
  locations: Location[],
  skipCoordinates?: boolean
): Promise<Location> => {
  let feature = multiPoint<Location["properties"]>([], { labels: [] });

  for await (const location of locations) {
    const { id: locationId, ...entity } = location;
    const { info, labels, ...p } = entity.properties;

    // Id,
    feature.id =
      feature.id === undefined
        ? locationId?.toString()
        : feature.id.toString() + "-" + locationId;

    // Labels, push unique labels
    labels.forEach((label) => {
      if (
        !feature.properties.labels.some(
          (b) =>
            normalize(label.value) === normalize(b.value) &&
            label.lang === b.lang
        )
      ) {
        feature.properties.labels.push({
          ...label,
          value: normalize(label.value),
        });
      }
    });

    // Coordinates, skipping it only returns the first coordinats
    if (!skipCoordinates || feature.geometry.coordinates.length === 0) {
      coordEach(location, (coord) => {
        feature.geometry.coordinates.push(coord);
      });
    }

    // Info
    if (info) {
      const { pregrouped, ...clone } = info;
      feature.properties.info ||= {};
      feature.properties.info!.pregrouped ||= [];
      feature.properties.info!.pregrouped.push(clone);
    }

    // Properties
    Object.assign(
      feature.properties,
      await mergeProperties(feature.properties, p)
    );
  }

  return feature;
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
        const [idLoc, scored, b] = (
          await Promise.all(
            matchByIds.map(
              async (idLoc) =>
                [idLoc, await score(idLoc, a), a] as [
                  Location,
                  Awaited<ReturnType<typeof score>>,
                  Location
                ]
            )
          )
        ).sort((a, b) => b[1].percentage - a[1].percentage)?.[0];

        if (
          scored.percentage >= 1.9 ||
          (scored.labels.percentage !== 1 &&
            scored.coordinates.percentage > 0.99 &&
            scored.percentage > 1.49)
        ) {
          await ok?.(a, idLoc);
          return;
        } else if (
          scored.percentage < 2 &&
          scored.coordinates.percentage > 0.997
        )
          console.log(
            [
              `${idLoc?.id} vs ${b.id}`,
              scored.percentage,
              scored.labels.percentage,
              scored.claims.percentage,
            ],
            idLoc.properties,
            b.properties
          );
      }

      const matchedByDistance = to.filter((b) => {
        return scoreCoordinateLocation(a, b, {
          maxDistance: 8000,
        }).some((i) => i.match);
      });
      if (matchedByDistance.length) {
        const scoredByDistance = (
          await Promise.all(
            matchedByDistance.map(
              async (b) =>
                [b, await score(a, b), a] as [Location, any, Location]
            )
          )
        )?.sort((a, b) => b[1].percentage - a[1].percentage);
        const [idLoc, scored, b] = scoredByDistance?.[0];

        if (
          scored.percentage >= 1.9 ||
          (scored.labels.percentage !== 1 &&
            scored.coordinates.percentage > 0.99 &&
            scored.percentage > 1.49)
        ) {
          await ok?.(a, idLoc);
        } else if (
          scored.percentage < 2 &&
          scored.coordinates.percentage > 0.997
        )
          console.log(
            [
              `${idLoc?.id} vs ${b.id}`,
              scored.percentage,
              scored.labels.percentage,
              scored.claims.percentage,
            ],
            idLoc.properties,
            b.properties
          );
      }
    })
  );
}
