import {
  concatMap,
  delay,
  of,
  from,
  filter,
  catchError,
  Observable,
  EMPTY,
} from "rxjs";
import { query as queryLabel } from "./label";
import { query as queryProperties, querySingleProperty } from "./property";
import { exactMatch, run } from "./run";
import { simplify } from "./simplify";
import { LocationV4 } from "../../types/location";
import { Property, CodeIssuer } from "../../types/wikidata";
import { logger } from "../../utils/logger";

/** Uses elasticsearch / CirrusSearch for a fuzzy search */
export const search = (name: string, language?: string) =>
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

export const getAllRailwayStations = () => {
  return run(`SELECT DISTINCT * WHERE {
    ?item (p:P31/(p:P279*)) ?instance.
    ?instance ps:P31 wd:Q55488.
    
    FILTER NOT EXISTS { ?item wdt:P3999 ?endTime }
    FILTER NOT EXISTS { ?instance pq:P582 ?closure }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    ${querySingleProperty(Property.CoordinateLocation)}
    ${[...Object.values(CodeIssuer), ...Object.values(Property)]
      .filter((i) => i !== Property.CoordinateLocation)
      .map((i) => `OPTIONAL { ${querySingleProperty(i)} }`)
      .join(" ")}
    }
  `)
    .then((response) =>
      simplify(
        response,
        [...Object.values(CodeIssuer), ...Object.values(Property)].map(
          (property) => ({ property })
        )
      )
    )
    .then((response) => {
      console.log(response.length);
      return response;
    });
};

// Fuzzy filters
export const findStationsWithin1KM = (
  coordinates: [number, number],
  distance: number
) => `SERVICE wikibase:around {
   ?item wdt:P625 ?location.
bd:serviceParam wikibase:center "Point(${coordinates[1]} ${coordinates[0]})"^^geo:wktLiteral;
    wikibase:radius "${distance}";
    wikibase:distance ?distance.
  }
  ?item (wdt:P31/(wdt:P279*)) wd:Q548662;`;

export const getExactLocations = async (
  values: {
    [key in Property | CodeIssuer]?: key extends Property.StationCode
      ? { codes: string[]; country: string }[]
      : (number | string)[];
  },
  set: { property: string; qualifiers?: string[] }[]
) => {
  const [labelKeys, labelQuery] = queryLabel();
  const [propKeys, propQuery] = queryProperties(set);

  return await exactMatch(values, labelKeys, propKeys, labelQuery + propQuery);
};

const getLocations = (locations: LocationV4[]) => {
  const getty = (code: CodeIssuer) =>
    locations
      .map((location) => location.claims?.[code]?.map(({ value }) => value!))
      .flat()
      .filter((x): x is string => !!x);
  return from(
    getExactLocations(
      {
        [CodeIssuer.ATOC]: getty(CodeIssuer.ATOC),
        [CodeIssuer.Benerail]: getty(CodeIssuer.Benerail),
        [CodeIssuer.DB]: getty(CodeIssuer.DB),
        [CodeIssuer.GaresAndConnexions]: getty(CodeIssuer.GaresAndConnexions),
        [CodeIssuer.IATA]: getty(CodeIssuer.IATA),
        [CodeIssuer.IBNR]: getty(CodeIssuer.IBNR),
        [CodeIssuer.SNCF]: getty(CodeIssuer.SNCF),
        [CodeIssuer.Trainline]: getty(CodeIssuer.Trainline),
        [CodeIssuer.UIC]: getty(CodeIssuer.UIC),
        [Property.StationCode]: Object.entries(
          locations.reduce<Record<string, string[]>>((acc, location) => {
            const country = location.claims[Property.Country]?.[0].value;
            if (!country) return acc;
            location.claims[Property.StationCode]?.forEach(({ value }) => {
              if (!value) return;
              acc[country] ||= [];
              acc[country].push(value);
            });
            return acc;
          }, {})
        ).map((i) => ({
          codes: i[1]!,
          country: i[0]!,
        }))!,
      },
      Object.keys(locations?.[0].claims).map((property) => ({ property }))
    )
  );
};

export const foo = (locations: LocationV4[]): Observable<LocationV4[]> => {
  if (locations.length < 1) EMPTY;

  const split = Math.floor(locations.length / 2);
  return getLocations(locations).pipe(
    catchError(() => {
      logger.debug(`Decreasing size of locations to ${split} per call`);
      return of(locations.slice(0, split), locations.slice(split)).pipe(
        concatMap((lo) => foo(lo))
      );
    })
  );
};

//   try {

//     const mapped: ([LocationV4, LocationV4] | undefined)[] = wikidata.map(
//       (entity: any) => {
//         const match = subset
//           .copy()
//           .where((location) => matchIds(entity, location));

//         if (match.count() === 0) return;

//         let items = match.data();
//         if (match.count() > 1) {
//           logger.debug(
//             `Found more than one location for ${entity.id}, ` +
//               `merging ${items.map((i) => i.id)} into first record`
//           );
//           const id = items[0].$loki;
//           items.forEach((item) => {
//             if (item.$loki === id) {
//               locations.update({
//                 ...items[0],
//                 ...mergeMultipleEntities(items),
//               });
//             } else {
//               // locations.remove(item);
//             }
//           });
//           items = [locations.get(items[0].$loki)];
//         }
//         return [items[0], entity];
//       }
//     );

//     mapped
//       .filter((i): i is [LocationV4, LocationV4] => !!i && !!i[0] && !!i[1])
//       .forEach(([location, wikidata]) => {
//         const matched = score(location, wikidata);
//         location.info ||= {};
//         location.info.match ||= [];
//         location.info.match.push({
//           matched,
//           wikidata,
//           percentage: matched.labels.percentage + matched.claims.percentage,
//         });
//       });
//   } catch (error) {
//     if ((error as any).status === 429) {
//       logger.error((error as any).statusText);
//       sets = [];
//       continue;
//     }

export const getFuzzyLocationMatch = (
  locations: LocationV4[],
  set: { property: string; qualifiers?: string[] }[]
) => {
  const [labelKeys, labelQuery] = queryLabel();
  const [propKeys, propQuery] = queryProperties(set);

  return of(...locations).pipe(
    filter((location) => {
      const hasLabelAndCoordinates =
        !!location.claims[Property.CoordinateLocation]?.[0]?.value &&
        !!location.labels.length;

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
              location.claims[Property.CoordinateLocation]?.[0]?.value!,
              3
            )}
            ${search(location.labels[0]?.value, location.labels[0]?.lang)}
            ${labelQuery + propQuery}
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
          }`
        )
          .catch((error) => {
            logger.error({ error, location }, "Failed to search fuzzy");
            return { results: { bindings: [] } };
          })
          .then((rawWikidataEntities) => {
            // if (!rawWikidataEntities.results?.bindings?.length) {
            //   logger.error(
            //     location,
            //     "Failed to find any location by fuzzy search"
            //   );
            // }
            return simplify(rawWikidataEntities, propKeys.map((property) => ({ property })));
          })
          .then(
            (wikidataEntities) =>
              [wikidataEntities, location] as [LocationV4[], LocationV4]
          )
      ).pipe(
        // Prevent IP address block
        delay(3000)
      )
    )
    // tap(([wiki, location]) => {
    //   if (!wiki?.length) {
    //     console.log(`SELECT DISTINCT ?item ${[
    //       ...propKeys,
    //       ...labelKeys,
    //       // `${Property.InAdministrativeTerritory}Label`,
    //     ]
    //       .map((key) => `?${key} ?${key}Id`)
    //       .join(" ")} WHERE {
    //         ${findStationsWithin1KM(
    //           location.claims[Property.CoordinateLocation]?.[0]?.value!
    //         )}
    //         ${search(location.labels[0]?.value, location.labels[0]?.lang)}
    //         ${labelQuery + propQuery}
    //       }`);
    //   }
    // })
  );
};