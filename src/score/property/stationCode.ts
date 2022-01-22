import { ClaimObject } from "../../types/wikidata";

/**
 * Compares case insenstive
 */
export const stationCode = (
  source: ClaimObject<string>[],
  destination: ClaimObject<string>[],
  missing: boolean
) =>
  source
    .map(({ value }) => value)
    .map((sourceValue) => {
      const match = destination?.find(
        ({ value }) =>
          value && value.toLowerCase() === sourceValue?.toLowerCase()
      );
      return {
        match: !!match,
        value: sourceValue,
        destination: match?.value || destination?.map(({ value }) => value),
        missing,
      };
    });
