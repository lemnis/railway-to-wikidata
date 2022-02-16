import { scoreCoordinateLocation } from "../../transform/coordinateLocation";
import { scoreLocatedInTimeZone } from "../../transform/locatedInTimeZone";
import { scoreStationCode } from "../../transform/stationCode";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property, ClaimObject } from "../../types/wikidata";

const customMatchers: Partial<
  Record<
    Property,
    (
      source: ClaimObject<any>[],
      destination: ClaimObject<any>[],
      missing: boolean
    ) => any[] | Promise<any[]>
  >
> = {
  [Property.LocatedInTimeZone]: scoreLocatedInTimeZone,
  [Property.CoordinateLocation]: scoreCoordinateLocation,
  [Property.StationCode]: scoreStationCode,
};

export interface Match {
  match: boolean;
  value: any;
  [key: string]: any;
}

export const score = async (
  proposed: LocationV4["claims"],
  current: LocationV4["claims"],
  proposedObject?: LocationV4,
  currentObject?: LocationV4
) => {
  const result: Record<string, { matches: Match[]; missing: boolean }> = {};

  (
    Object.entries(proposed) as any as [Property | CodeIssuer, ClaimObject[]][]
  ).forEach(async ([key, value]) => {
    if (!value) return;

    const claim: ClaimObject<any>[] | undefined = current[key];
    const matches: Match[] = [];
    const missing = !claim || claim?.length === 0;

    const customMatcher =
      key in customMatchers &&
      customMatchers[key as keyof typeof customMatchers];
    if (customMatcher && claim && value) {
      const k = await customMatcher(value, claim, missing);
      k.forEach((i) => matches.push(i));
    } else {
      value.forEach(({ value }) => {
        const match = claim?.map(({ value }) => value).includes(value) || false;
        if (!match && key === Property.ElevationAboveSeaLevel)
          console.log(
            value,
            claim?.map(({ value }) => value)
          );
        matches.push({ match, value });
      });
    }

    result[key] = { matches, missing };
  });

  const existing = Object.values(result)
    .filter(({ missing }) => !missing)
    .map(({ matches }) => matches)
    .flat();

  const percentage =
    existing.filter(({ match }) => match).length / existing.length;

  return {
    matches: result,
    percentage: existing.length ? percentage : 0,
    amountMissing: Object.values(result).filter((i) => i.missing).length,
  };
};
