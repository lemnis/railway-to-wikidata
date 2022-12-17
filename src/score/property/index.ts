import { propertyMatch } from "../../actions/match/property";
import { Claims } from "../../types/location";
import { CodeIssuer, Property, ClaimObject } from "../../types/wikidata";

export interface Match {
  match: boolean;
  value: any;
  [key: string]: any;
}

export const score = async (proposed: Claims, current: Claims) => {
  const result: Record<string, { matches: Match[]; missing: boolean }> = {};

  await Promise.all(
    (
      Object.entries(proposed) as any as [
        Property | CodeIssuer,
        ClaimObject[]
      ][]
    ).map(async ([key, value]) => {
      if (!value) return;

      const claim: ClaimObject<any>[] | undefined = current[key];
      const matches: Match[] = [];
      const missing = !claim || claim?.length === 0;

      if (claim) {
        (await propertyMatch(key, claim, value)).forEach((i) => {
          matches.push(i);
        });
      }

      result[key] = { matches, missing };
    })
  );

  const existing = Object.values(result)
    .filter(({ missing }) => !missing)
    .map(({ matches }) => matches.some((i) => i.match));

  const percentage = existing.filter((match) => match).length / existing.length;

  return {
    matches: result,
    percentage: existing.length ? percentage : 0,
    amountMissing: Object.values(result).filter((i) => i.missing).length,
  };
};
