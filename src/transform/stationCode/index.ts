import { ClaimObject } from "../../types/wikidata";

/** Compares station codes case insenstive */
export const scoreStationCode = (
  source: ClaimObject<string>[],
  destination: ClaimObject<string>[]
) =>
  source.map(({ value: a }) => {
    const match = destination?.find(({ value: b }) =>
      a ? a.toLowerCase() === b?.toLowerCase() : false
    );

    return {
      match: !!match,
      value: a,
      missing: destination.length === 0,
      origin: match,
    };
  });
