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
    'node["railway"="stop"]',
  ]
    // Exclusions
    .map(
      (node) =>
        node +
        // Tourism
        "[usage!=tourism][usage!=leisure][tourism!=yes][tourism!=attraction][station!=miniature]" +
        // Disused
        "[station!=disused][disused!=yes][disused!=station][train!=disused]" +
        "[station!=abandoned][abandoned!=yes][abandoned!=station]" +
        "[historic!=yes][usage!=preserved_railway]" +
        // Freight
        "[usage!=freight][usage!=industrial][station!=freight][station!=cargo][passenger!=no]"
    )
    .flat()
    // train OR no public transport is defined
    .map((node) => [
      node + "[train][train!=no]",
      node +
        "[!train][!bus][!tram][!subway][!monorail][!light_rail][!ferry][!aerialway][!bus][!funicular]" +
        '[amenity!="bus_station"][station!=funicular][station!=subway][station!=monorail]',
    ])
    .flat()
    .map((q) => `${q}(${area});\r\n`)
    .join("");

const queryStation = (country: string, iso: number) => `
[out:json];
area["ISO3166-${iso}"="${country}"]->.searchArea;
(
  ${queryStationNodes("area.searchArea")}
);
out body;
>;
out skel qt;
`;

export const getStations = () =>
  of(
    ...Object.values(Country)
      .map((country) => country.alpha2)
      .map((country) => [country, 1] as [string, number])
    // ['ES', 1] as [string, number]
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
