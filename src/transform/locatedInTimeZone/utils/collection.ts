import { run } from "../../../providers/wikidata/run";
import { simplify } from "../../../providers/wikidata/simplify";
import { LocationV4 } from "../../../types/location";
import { Property } from "../../../types/wikidata";
import { db, dbIsLoaded } from "../../../utils/database";

const collection = (async () => {
  await dbIsLoaded;
  return (
    db.getCollection<LocationV4>(Property.LocatedInTimeZone) ||
    db.addCollection<LocationV4, {}>(Property.LocatedInTimeZone, {
      unique: ["id"],
    })
  );
})();

export const getTimeZonesByName = async (name: string) => {
  const result = (await collection).where((data) => data.labels.some(({ value }) => value === name)
  );
  // db.close();
  return result;
};

export const getTimeZonesByOffset = async (
  offset: string,
  isWinterTime = true
) => {
  const result = (await collection).where(
    (data) => !!data?.claims[Property.UTCTimezoneOffset]?.some(
      ({ value, qualifiers }) => value === offset
    )
  );
  // db.close();
  return result;
};

export const getTimeZoneByWikiId = async (offset: string) => {
  const result = (await collection).find({ id: offset });
  // db.close();
  return result;
};

export const getTimeZoneByWikiIds = async (ids: string[]) => {
  const result = (await collection).find({ id: { $in: ids } });
  // db.close();
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
    FILTER NOT EXISTS { ?o pq:${Property.EndTime} ?endTime. }  
  }
  OPTIONAL {
    ?item wdt:${Property.SaidToBeTheSameAs}
    ?${Property.SaidToBeTheSameAs}.
  }
  OPTIONAL {
    ?item wdt:${Property.LocatedInTimeZone} ?${Property.LocatedInTimeZone}.
  }
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

  (await collection).insert(data);
};
