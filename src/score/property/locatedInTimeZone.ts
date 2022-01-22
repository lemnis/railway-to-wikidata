import { ClaimObject } from "../../types/wikidata";
import { logger } from "../../utils/logger";
import { getTimeZoneOffset } from "./utils/getTimeZoneOffset";

export const locatedInTimeZone = (
  source: ClaimObject<string>[],
  destination: ClaimObject<string>[],
  missing: boolean
) =>
  source
    .map(({ value }) => value)
    .filter((item): item is string => !!item)
    .map((timeZone) => {
      const offset = getTimeZoneOffset(timeZone);
      const match =
        offset === 1
          ? destination?.find(
              ({ value: claimValue }) => claimValue === "Q25989"
            )
          : undefined;

      if (!match && !missing) {
        logger.error("Mismatch time zone happened");
        logger.error(destination);
        logger.error(offset);
      }
      return {
        match: !!match,
        value: source,
        destination: match?.value || destination?.map(({ value }) => value),
        missing,
      };
    });
