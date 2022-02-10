import osmToGeojson from "osmtogeojson";
import { overpass } from "overpass-ts";
import { concatMap, delay, from, map, of } from "rxjs";
import { Country } from "../../transform/country";
import { logger } from "../../utils/logger";

const queryStationNodes = (area: string) =>
  [
    'node["public_transport"="station"]',
    'node["railway"="station"]',
    'node["railway"="halt"]',
  ]
    // train OR no public transport is defined
    .map((node) => [
      node + "[train][train!=no]",
      node + "[!train][!tram][!subway][!monorail][!light_rail][!ferry]",
    ])
    .flat()
    // Exclusions
    .map(
      (node) =>
        node +
        // Tourism
        "[usage!=tourism][usage!=leisure][tourism!=yes][tourism!=attraction][station!=miniature]" +
        // Disused
        "[station!=abandoned][disused!=yes][abandoned!=yes]" +
        // Freight
        "[usage!=freight][station!=freight][passenger!=no]"
    )
    .flat()
    .map((q) => `${q}(${area});\r\n`)
    .join("");

const queryStation = (country: string, iso: number) => {
  return `
[out:json];
area["ISO3166-${iso}"="${country}"];
(
  ${queryStationNodes("area")}
);
out body;
>;
out skel qt;
`;
};

export const getStations = () =>
  of(
    ...Object.values(Country)
      .map((country) => country.alpha2)
      .map((country) => [country, 1] as [string, number])
  ).pipe(
    concatMap(([region, alpha]) =>
      from(
        overpass(queryStation(region, alpha))
          .then((response) => response.json())
          .catch(() => {
            logger.error({ region }, "Openstreetmap query failed");
            return { elements: [] };
          })
          .then((data) => [region, data])
      ).pipe(delay(30000))
    ),
    map((osm) => [osm[0], osmToGeojson(osm[1])])
  );
