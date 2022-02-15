import { run } from "../../providers/wikidata/run";
import { simplify } from "../../providers/wikidata/simplify";
import { LocationV4 } from "../../types/location";
import { ClaimObject, Property } from "../../types/wikidata";
import { db, dbIsLoaded } from "../../utils/database";
import { logger } from "../../utils/logger";
import { getTimeZoneOffset } from "./utils/getTimeZoneOffset";

const getCollection = async () => {
  await dbIsLoaded;
  return (
    db.getCollection<LocationV4>(Property.LocatedInTimeZone) ||
    db.addCollection<LocationV4, {}>(Property.LocatedInTimeZone, {
      unique: ["id"],
    })
  );
};

export const getTimeZonesByName = async (name: string) => {
  const collection = await getCollection();
  const result = collection.where((data) =>
    data.labels.some(({ value }) => value === name)
  );
  db.close();
  return result;
};

// TODO: Add support for diffent timezones
export const getTimeZonesByOffset = async (offset: string, isWinterTime = true) => {
  const collection = await getCollection();
  const result = collection.where((data) =>
    !!data?.claims[Property.UTCTimezoneOffset]?.some(({ value, qualifiers }) => value === offset)
  );
  db.close();
  return result;
};

export const cacheWikidataTimeZones = async () => {
  const data = simplify(
    await run(`SELECT DISTINCT
    ?item ?itemLabel
    ?${Property.SaidToBeTheSameAs}
    ?${Property.UTCTimezoneOffset} 
    ?${Property.UTCTimezoneOffset}Qualifier${Property.ValidInPeriod}
    ?${Property.UTCTimezoneOffset}Qualifier${Property.ValidInPeriod}Label
    ?${Property.LocatedInTimeZone}
  WHERE {
  ?item (wdt:P31/(wdt:P279*)) wd:Q12143.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  OPTIONAL {
    ?item p:${Property.UTCTimezoneOffset} ?o.
    ?o ps:${Property.UTCTimezoneOffset} ?${Property.UTCTimezoneOffset}.
    OPTIONAL { ?o pq:${Property.ValidInPeriod} ?${Property.UTCTimezoneOffset}Qualifier${Property.ValidInPeriod}. }
  }
  OPTIONAL { ?item wdt:${Property.SaidToBeTheSameAs} ?${Property.SaidToBeTheSameAs}. }
  OPTIONAL { ?item wdt:${Property.LocatedInTimeZone} ?${Property.LocatedInTimeZone}. }
}`),
    [
      { property: Property.SaidToBeTheSameAs },
      {
        property: Property.UTCTimezoneOffset,
        qualifiers: [Property.ValidInPeriod],
      },
      { property: Property.LocatedInTimeZone },
    ]
  );

  const collection = await getCollection();
  collection.insert(data);
  db.close();
};

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
