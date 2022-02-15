import { ClaimObject } from "../../types/wikidata";

/** Compares station codes case insenstive */
export const scoreStationCode = (
  source: ClaimObject<string>[],
  destination: ClaimObject<string>[]
) =>
  source
    .map(({ value }) => value)
    .map((value) => {
      const match = destination?.find(
        ({ value }) =>
          value && value.toLowerCase() === value?.toLowerCase()
      );
      return {
        match: !!match,
        value,
        missing: destination.length === 0,
      };
    });
