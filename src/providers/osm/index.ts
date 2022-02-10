import osmToGeojson from "osmtogeojson";
import { overpass } from "overpass-ts";
import { concatMap, delay, from, map, of } from "rxjs";
import { Country } from "../../transform/country";
import { FrenchRegions, GermanRegions, RussianRegions } from "./regions";

export * from './stations';

const touristicRailway = [
  '[railway="preserved"][usage!=test][service!=yard]',
  '["railway:preserved"="yes"][usage!=test][service!=yard]',
  "[historic]",
  "[tourism]",
  '[usage="tourism"]',
  '[passenger="tourism"]',
];

const queryTrack = (country: string, iso: number) => `
[out:json];
(
  area["ISO3166-${iso}"="${country}"];
  way
    ["railway"="rail"]
    [disused!=yes][abandoned!=yes][!historic]
    // ["railway:traffic_mode"!=freight][access!=private][passengers!=no][man_made!=crane]
    [service!=yard][service!=spur][service!=siding]
    [usage!=test][usage!=military][usage!=industrial](area);

);
out body;
>;
out skel qt;
`;

const smallCountries = Object.values(Country)
  .map((country) => country.alpha2)
  .filter(
    (code) =>
      ![
        Country.Russia.alpha2,
        Country.France.alpha2,
        Country.Germany.alpha2,
      ].includes(code)
  );

export const getTracks = () =>
  of(
    ...[...FrenchRegions, ...GermanRegions, ...RussianRegions].map(
      (region) => [region, 2] as [string, number]
    ),
    ...smallCountries.map((country) => [country, 1] as [string, number])
  ).pipe(
    concatMap(([region, alpha]) =>
      from(
        overpass(queryTrack(region, alpha))
          .then((response) => response.json())
          .then((data) => [region, data])
      ).pipe(delay(30000))
    ),
    map((osm) => [osm[0], osmToGeojson(osm[1])])
  );
