import { FeatureCollection } from "geojson";
import osmToGeojson from "osmtogeojson";
import { overpass } from "overpass-ts";
import { concatMap, count, delay, from, map, of, tap } from "rxjs";
import { Country, CountryInfo } from "../../transform/country";
import { logger } from "../../utils/logger";
import { osmToWikidata } from "./osmToWikidata.utils";

const splitInChunks = <T extends any[]>(input: T, chunkSize: number): T[] =>
  input.reduce((all, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    all[chunkIndex] ||= [];
    all[chunkIndex].push(item);
    return all;
  }, []);

const queryStation = (areas: { country: string; iso: number }[]) => `
[out:json];
${areas
  .map(
    ({ country, iso }) => `area["ISO3166-${iso}"="${country}"]->.${country};`
  )
  .join("")}
(
    ${areas
      .map(
        ({ country }) => `
        node["uic_ref"](area.${country});
        way["uic_ref"](area.${country});
        relation["uic_ref"](area.${country});
    `
      )
      .join("")}    
);
out body;
>;
out skel qt;
`;

/**
 * Split the countries in multiple groups that roughly have the same amount of items
 */
const chunked = () => {
  const countries = new Set(Object.values(Country));
  let index = 0;
  const chunkSize = 2;
  const chunk: CountryInfo[][] = [[], [], [], [], []];

  chunk[index].push(Country.France);
  countries.delete(Country.France);
  index++;

  chunk[index].push(Country.Germany);
  countries.delete(Country.Germany);
  index++;

  chunk[index].push(Country.Russia);
  countries.delete(Country.Russia);
  index++;

  chunk[index].push(Country.Switzerland);
  countries.delete(Country.Switzerland);
  index++;

  [...countries].forEach((item, index) => {
    let chunkIndex = Math.floor(index / chunkSize) + 1;
    if (chunkIndex > 14) chunkIndex = 6;
    else if (chunkIndex > 9) chunkIndex = 5;
    else if (chunkIndex > 4) chunkIndex = 4;
    chunk[chunkIndex] ||= [];
    chunk[chunkIndex].push(item);
  });

  return chunk;
};

export const getUicLocations = () =>
  of(
    ...chunked().map((ch) =>
      ch.map((country) => ({
        country: country.alpha2,
        iso: 1,
      }))
    )
  ).pipe(
    concatMap((countries) =>
      from(
        overpass(queryStation(countries))
          .then((response) => response.json())
          .catch(() => {
            logger.error(
              countries.map(({ country }) => country),
              "Openstreetmap query failed"
            );
            return overpass(queryStation(countries))
              .then((response) => response.json())
              .catch(() => {
                logger.error(
                  countries.map(({ country }) => country),
                  "Openstreetmap query failed 2"
                );
                return { elements: [] };
              });
          })
          .then(
            (data) =>
              [countries.map(({ country }) => country), data] as [string[], any]
          )
      ).pipe(delay(30000))
    ),
    map(
      (osm) =>
        [osm[0], osmToWikidata(osmToGeojson(osm[1]) as any)] as [
          string[],
          FeatureCollection
        ]
    )
  );
