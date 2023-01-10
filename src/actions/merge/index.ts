import { cleanCoords, coordEach, multiPoint } from "@turf/turf";
import { isEqual } from "lodash";
import { normalize } from "station-name-diff";
import { score } from "../../score";
import { scoreCoordinateLocation } from "../../transform/coordinateLocation";
import { Location, Claims } from "../../types/location";
import { ClaimObject, CodeIssuer, Property } from "../../types/wikidata";
import { logger } from "../../utils/logger";
import { matchIds } from "../match";
import { propertyMatch } from "../match/property";

type Score = Awaited<ReturnType<typeof score>>;

let count = 0;

const mergeProperty = async (
  properties: ClaimObject<any>[],
  verbose: boolean
) => {
  const result: ClaimObject<any> = verbose
    ? { info: { pregrouped: [], reliability: 0 } }
    : {};

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

    if (verbose && prop.info?.pregrouped) {
      prop.info?.pregrouped?.forEach((i: any) =>
        result.info?.pregrouped?.push(i)
      );
    } else if (verbose && prop.info) {
      result.info?.pregrouped?.push(prop.info);
    }

    if (verbose && prop.info) {
      result.info!.reliability! =
        (result.info!.reliability || 0) + (prop.info?.reliability || 0);
    }
  }
  return result;
};

const mergeProperties = async (
  accumulated: Claims,
  properties: Claims,
  verbose = true
) => {
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
        ] = await mergeProperty([value, origin], verbose);
      } else {
        accumulated[propertiesKey]!.push(value);
      }
    }
  }
  return accumulated;
};

export const merge = async (
  locations: Location[],
  skipCoordinates?: boolean,
  verbose = true
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
    if (verbose && info) {
      const { pregrouped, ...clone } = info;
      feature.properties.info ||= {};
      feature.properties.info!.pregrouped ||= [];
      feature.properties.info!.pregrouped.push(clone);
    }

    // Properties
    Object.assign(
      feature.properties,
      await mergeProperties(feature.properties, p, verbose)
    );
  }

  return cleanCoords(feature);
};

export async function matchAndMerge(
  origin: Location[],
  to: Location[],
  ok?: (a: Location, b: Location) => Promise<any>
) {
  const map = new Map<any, any[]>();

  await Promise.all(
    origin.map(async (a) => {
      const matchByIds = to.filter((b) => matchIds(a, b));

      if (matchByIds.length) {
        const scoredMatchByIds = (
          await Promise.all(
            matchByIds.map(async (b) => {
              let first = await score(b, a);
              let second = await score(a, b);
              return [
                b,
                first.percentage > second.percentage ? first : second,
              ] as [Location, Score];
            })
          )
        ).sort((a, b) => b[1].percentage - a[1].percentage);
        const [b, scored] = scoredMatchByIds?.[0];

        if (
          // Default match
          scored.percentage >= 1.9 ||
          // If labels not fully match, but coordinates are within 150 meters
          (scored.labels.percentage !== 1 &&
            scored.coordinates.percentage > 0.95 &&
            scored.percentage > 1.49) ||
          // If no coordinates are present
          ((!!b.geometry.coordinates?.[0] || b.geometry.coordinates?.[0]) &&
            scored.percentage > 1.4) ||
          (scored.labels.percentage !== 1 &&
            scored.claims.percentage === 1 &&
            scored.percentage > 1.49)
        ) {
          // await ok?.(a, b);
          if (!map.has(b)) map.set(b, []);
          map.get(b)?.push(a);
          return;
        } else if (scored.labels.matches.some((i) => i.similarity))
          console
            .log
            // [
            //   `${idLoc?.id} vs ${b.id}`,
            //   scored.labels.percentage,
            //   scored.claims.percentage,
            //   scored.coordinates.percentage,
            // ],
            // idLoc.geometry.coordinates,
            // idLoc.properties,
            // b.geometry.coordinates,
            // b.properties
            ();
      }

      const matchedByDistance = to.filter((b) => {
        return scoreCoordinateLocation(a, b, {
          maxDistance: 8000,
        }).some((i) => i.match);
      });

      if (matchedByDistance.length) {
        const scoredByDistance = (
          await Promise.all(
            matchedByDistance.map(async (b) => {
              let first = await score(b, a);
              let second = await score(a, b);
              return [
                b,
                first.percentage > second.percentage ? first : second,
              ] as [Location, Score];
            })
          )
        )?.sort((a, b) => b[1].percentage - a[1].percentage);

        const [b, scored] = scoredByDistance?.[0];

        if (
          scored.percentage >= 1.9 ||
          (scored.labels.percentage !== 1 &&
            scored.coordinates.percentage > 0.8 &&
            scored.percentage > 1.49)
        ) {
          if (!map.has(b)) map.set(b, []);
          map.get(b)?.push(a);
        }
        // else if (
        //   typeof idLoc.id === "string" &&
        //   idLoc.id?.startsWith("Q") &&
        //   scored.coordinates.percentage > 0.8
        // )
        // console.log(
        //   [
        //     `${idLoc?.id} vs ${b.id}`,
        //     scored.labels.percentage,
        //     scored.claims.percentage,
        //     scored.coordinates.percentage,
        //     scored.coordinates.matches?.[0]?.distance,
        //   ],
        //   idLoc.geometry.coordinates,
        //   idLoc.properties,
        //   b.geometry.coordinates,
        //   b.properties
        // );
      }
    })
  );

  await Promise.all(
    Array.from(map.entries()).map(async ([b, aItems]) => {
      if (aItems.length > 1) {
        await Promise.all(aItems.map(async (a) => [a, await score(a, b)])).then(
          async (i) => {
            const sorted = i.sort((k, l) => l[1].percentage - k[1].percentage);

            if (
              sorted.length > 1 &&
              sorted[0][1].percentage - sorted[1][1].percentage < 0.4
            ) {
              count++;
            }

            if (sorted?.[0]) await ok?.(sorted[0][0], b);
          }
        );
        return;
      }

      return Promise.all(
        aItems.map(async (a) => {
          await ok?.(a, b);
        })
      );
    })
  );

  console.log(count);
}
