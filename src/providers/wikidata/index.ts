import {
  concatMap,
  delay,
  of,
  from,
  filter,
  catchError,
  Observable,
  EMPTY,
  map,
  tap,
  throwError,
} from "rxjs";
import { labelKeys, labelQuery } from "./label";
import { query as queryProperties, querySingleProperty } from "./property";
import { run } from "./run";
import { simplify, simplifyByKeyValue } from "./simplify";
import { Location } from "../../types/location";
import { Property, CodeIssuer } from "../../types/wikidata";
import { logger } from "../../utils/logger";
import { Country } from "../../transform/country";

export const getAllRailwayStations = async () => {
  // TODO: Exclude closed station, but  include stations who got reopened (e.g. veendam)
  const k = simplify(
    await run(`SELECT DISTINCT ?item ?${Property.Country} WHERE {
      ?item p:P31 ?instance.
      ?instance (ps:P31/(wdt:P279*)) wd:Q55488.
      ?item wdt:P625 ?P625.
      ?item wdt:${Property.Country} ?${Property.Country}
  }
  ORDER BY ?item`),
    [{ property: Property.Country }]
  );
  const ids = k
    .filter(({ properties }) =>
      properties[Property.Country]?.some(({ value }) =>
        Object.values(Country)
          .map((i) => i.wikidata)
          .includes(value!)
      )
    )
    .map(({ id }) => id);

  console.log("Found ", ids.length, "wikidata articles");

  const properties = [...Object.values(CodeIssuer), ...Object.values(Property)];

  const getLocations = (ids: string[]) => {
    return from(
      run(
        `SELECT DISTINCT * WHERE {
          VALUES ?item {
            ${ids.map((i) => `wd:${i}`).join(" ")}
          }
          VALUES ?key {
            ${properties.map((property) => `wdt:${property}`).join(" ")}
            rdfs:label
            skos:altLabel
            wdt:P31
          }
         
          OPTIONAL {
            ?item ?key ?value
          }
        }`
      ).catch((res) => catchError(res))
    ).pipe(
      concatMap((response) => {
        if(typeof response === 'function') {
          return throwError(() => JSON.stringify(response));
        }

        return from([simplifyByKeyValue(
          response,
          properties.map((property) => ({ property }))
        )]);
      })
    );
  };

  const splitter = (ids: string[]): Observable<Location[]> => {
    if (ids.length < 1) EMPTY;

    const split = Math.floor(ids.length / 2);
    return getLocations(ids).pipe(
      catchError((e) => {
        console.log(e, `Decreasing size of ids to ${split} per call`);
        return of(ids.slice(0, split), ids.slice(split)).pipe(
          filter((lo) => lo.length > 0),
          concatMap((lo) => splitter(lo))
        );
      })
    );
  };

  return splitter(ids as string[]);
};

export const getUICRailwayStations = async () => {
  const properties = [...Object.values(CodeIssuer), ...Object.values(Property)];
  const query = `SELECT DISTINCT * WHERE {
      ${querySingleProperty(Property.CoordinateLocation)}
      ${querySingleProperty(CodeIssuer.UIC)}

      VALUES ?key {
        ${properties.map((property) => `wdt:${property}`).join(" ")}
        rdfs:label
        skos:altLabel
        wdt:P31
      }
     
      OPTIONAL {
        ?item ?key ?value
      }
    }
  `;
  const response = await run(query);

  const data = simplifyByKeyValue(
    response,
    properties.map((property) => ({ property }))
  );

  return { data, query };
};

/** Uses elasticsearch / CirrusSearch for a fuzzy search */
const search = (name: string, language?: string) =>
  `SERVICE wikibase:mwapi
    {
      bd:serviceParam wikibase:endpoint "www.wikidata.org";
                      wikibase:api "Generator";
                      mwapi:generator "search";
                      mwapi:gsrsearch "${name}"${
    language ? `@${language}` : ""
  };
                      mwapi:gsrlimit "max".
      ?item wikibase:apiOutputItem mwapi:title.
    }
    ${
      language
        ? `?item rdfs:label ?label. FILTER( LANG(?label)="${language}" )`
        : ""
    }`;

// Fuzzy filters
const findStationsWithin1KM = (
  coordinates: [number, number],
  distance: number
) => `SERVICE wikibase:around {
  ?item wdt:P625 ?location.
  bd:serviceParam wikibase:center "Point(${coordinates[1]} ${coordinates[0]})"^^geo:wktLiteral;
    wikibase:radius "${distance}";
    wikibase:distance ?distance.
  }
  ?item (wdt:P31/(wdt:P279*)) wd:Q548662;`;

export const getFuzzyLocationMatch = (
  locations: Location[],
  set: { property: string; qualifiers?: string[] }[]
) => {
  const [propKeys, propQuery] = queryProperties(set);

  return of(...locations).pipe(
    filter((location) => {
      const hasLabelAndCoordinates =
        !!location.properties[Property.CoordinateLocation]?.[0]?.value &&
        !!location.properties.labels.length;

      if (!hasLabelAndCoordinates)
        logger.warn(location, "Location is missing coordinates and / or label");

      return hasLabelAndCoordinates;
    }),
    concatMap((location) =>
      from(
        run(
          `SELECT DISTINCT ?item ${[
            ...propKeys,
            ...labelKeys,
            `${Property.InAdministrativeTerritory}Label`,
          ]
            .map((key) => `?${key} ?${key}Id`)
            .join(" ")} WHERE {
            ${findStationsWithin1KM(
              location.properties[Property.CoordinateLocation]?.[0]
                ?.value! as any,
              3
            )}
            ${search(
              location.properties.labels[0]?.value,
              location.properties.labels[0]?.lang
            )}
            ${labelQuery + propQuery}
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
          }`
        )
          .catch((error) => {
            logger.error({ error, location }, "Failed to search fuzzy");
            return { results: { bindings: [] } };
          })
          .then((rawWikidataEntities) =>
            simplify(
              rawWikidataEntities,
              propKeys.map((property) => ({ property }))
            )
          )
          .then(
            (wikidataEntities) =>
              [wikidataEntities, location] as [Location[], Location]
          )
      ).pipe(
        // Prevent IP address block
        delay(3000)
      )
    )
  );
};
