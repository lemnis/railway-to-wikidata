import { ClaimObject } from "../../types/wikidata";
import { logger } from "../../utils/logger";
import { getTimeZoneOffset } from "./utils/getTimeZoneOffset";

const TimeZones = {
  0: 'Q6574',
  1: 'Q6655',
  2: 'Q6723'
}


// SELECT DISTINCT ?item ?itemLabel ?offset ?valid ?validLabel WHERE {
//   SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
//   {
//     SELECT DISTINCT ?item WHERE {
//       ?item p:P31 ?statement0.
//       ?statement0 (ps:P31/(wdt:P279*)) wd:Q12143.
//     }
//     LIMIT 10000
//   }
//   OPTIONAL {
//     ?item p:P2907 ?o.
//     ?o ps:P2907 ?offset;
//       pq:P1264 ?valid.
//   }
// }

// https://www.wikidata.org/wiki/Q8691#Q8691$36F70516-0C1E-4FBE-8C83-5B8684DE1F1Fy
// https://www.wikidata.org/wiki/Q8841887#Q8841887$0E3324B7-A791-4EB2-B082-301044F6D862
// https://www.wikidata.org/wiki/Q668382#Q668382$193ccc18-626e-4831-99b4-d6af7479cf9d

export const scoreLocatedInTimeZone = (
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
