import { ExecutionContext } from "ava";
import { Feature, Point } from "geojson";
import { distanceTo } from "geolocation-utils";
import { score, WITHOUT_LOCATION_SCORE_THRESHOLD } from "../score";
import { Property } from "../types/wikidata";

async function getScore(
  wikipedia: Feature<Point, { labels: any[]; [key: string]: any }>[],
  location: Feature<Point, { labels: any[]; [key: string]: any }>,
  result: any
) {
  const { geometry, properties } = location;
  const { labels, ...claims } = properties;

  const close = wikipedia.filter((feature) => {
    return (
      distanceTo(
        feature!.geometry.coordinates! as [number, number],
        geometry.coordinates! as [number, number]
      ) < 3000
    );
  });

  if (!close.length) {
    result.notFound.push(location);
    return;
  }

  const scored = await score(
    {
      labels: [labels as any],
      claims: {
        ...claims,
        [Property.CoordinateLocation]: [
          { value: geometry.coordinates as [number, number] },
        ],
      },
    },
    {
      labels: close[0].properties.labels,
      claims: {
        ...(close[0].properties as any),
        [Property.CoordinateLocation]: [
          { value: close[0]?.geometry.coordinates },
        ],
      },
    }
  );

  Object.entries(scored.claims.matches).forEach(([key, values]) => {
    result[key] ||= { total: 0, matches: 0, notFound: [], missing: [] };

    if (values.missing) {
      result[key].missing.push(scored);
      return;
    }

    if (scored.percentage > WITHOUT_LOCATION_SCORE_THRESHOLD) {
      result[key].total += values.matches.length;
      result[key].matches += values.matches.filter(({ match }) => match).length;
      if (values.matches.filter(({ match }) => !match).length) {
        result[key].notFound.push(scored);
      }
    }
  });
}

export async function getFullMatchScore(locations: any[], otherSource: any[]) {
  const result: any = { notFound: [], missing: [] };
  await Promise.all(
    locations.map((location) => {
      getScore(otherSource, location, result);
    })
  );
  return result;
}

export function closeTo(t: ExecutionContext, actual: number, expected: number) {
  t.assert(
    actual <= expected,
    `${actual} should be lower or equal than ${expected}`
  );
  t.assert(
    actual >= expected - 0.1,
    `${actual} should be higher or equal than ${expected - 0.1}`
  );
}
