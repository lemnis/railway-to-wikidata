import { ClaimObject, Property } from "../../types/wikidata";
import { logger } from "../../utils/logger";

/** P131 */
export const inAdministrativeTerritory = (
  source: ClaimObject[],
  destination: ClaimObject[],
  missing: boolean
) => {
  if(destination?.every(({ label }) => !label)) {
    logger.error(
      { source, destination },
      "inAdministrativeTerritory requires label"
    );
  }

  return source.map(({ value }) => ({
    match: destination?.some(({ label }) => label === value),
    value: value,
    missing,
  }));
};
