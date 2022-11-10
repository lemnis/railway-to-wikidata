import { ExecutionContext } from "ava";
import { Feature, Point } from "geojson";
import { distanceTo } from "geolocation-utils";
import { cloneDeep, isMatch } from "lodash";
import { score, WITHOUT_LOCATION_SCORE_THRESHOLD } from "../score";
import { Location } from "../types/location";
import { CodeIssuer, Property } from "../types/wikidata";
import { inspect } from "util";
import { matchByNameAndDistance } from "../actions/match";

async function getScore(
  wikipedia: Location[],
  location: Location,
  result: any,
  exclude: (CodeIssuer | Property)[]
) {
  const { geometry, properties } = location;
  const { labels, ...claims } = properties;

  const close = wikipedia
    .filter((feature) => matchByNameAndDistance(feature, location))
    .sort((a, b) => {
      const aCoordinates: any =
        typeof a.geometry.coordinates?.[0] === "number"
          ? a.geometry.coordinates
          : a.geometry.coordinates?.[0];
      const bCoordinates: any =
        typeof b.geometry.coordinates?.[0] === "number"
          ? b.geometry.coordinates
          : b.geometry.coordinates?.[0];
      const d = distanceTo(aCoordinates, bCoordinates);
      return d === 3000 ? 0 : d < 3000 ? -1 : 1;
    });

  if (!close.length) {
    result.notFound.push(location);
    return;
  }

  const scored = await score(location, close[0]);

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
    } else {
      result.lowScore ||= [];
      result.lowScore.push(scored);
    }
  });
}

export async function getFullMatchScore(
  locations: Location[],
  otherSource: Location[],
  exclude: (CodeIssuer | Property)[] = []
) {
  const result: {
    notFound: any;
    missing: any;
    [key: string]: {
      notFound: any[];
      missing: any[];
      total: number;
      matches: number;
    };
  } = { notFound: [] as any, missing: [] as any };
  await Promise.all(
    locations.map((location) => {
      return getScore(otherSource, location, result, exclude);
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
