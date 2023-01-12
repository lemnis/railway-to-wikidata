import { feature } from "@ideditor/country-coder";
import { point } from "@turf/turf";
import { merge } from "../../actions/merge";
import { groupByScore } from "../../group/score";
import { score } from "../../score";
import { Country, findCountryByAlpha2 } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";
import { logger } from "../../utils/logger";

const foreignLocations = {
  "179212": Country.Germany,
  "179193": Country.Ukraine,
  "179223": Country.Czech,
};

const feeds = [
  // [
  //   "http://komunikacja.bialystok.pl/cms/File/download/gtfs/google_transit.zip",
  //   "pl-bialystok",
  // ],
  // [
  //   "https://www.wroclaw.pl/open-data/87b09b32-f076-4475-8ec9-6020ed1f9ac0/OtwartyWroclaw_rozklad_jazdy_GTFS.zip",
  //   "pl-wroclaw",
  // ],
  ["https://mkuran.pl/gtfs/warsaw.zip", "pl-warsaw"],
  ["https://mkuran.pl/gtfs/polregio.zip", "pl-polregio"],
  ["https://mkuran.pl/gtfs/kolejemazowieckie.zip", "pl-kolejemazowieckie"],
  ["https://mkuran.pl/gtfs/wkd.zip", "pl-wkd"],
  // ["https://mkuran.pl/gtfs/tristar.zip", "pl-tristar"],
];

/**
 * @license CC0 1.0
 * @see https://mkuran.pl/gtfs/
 */
const getPkp = async () => {
  const stations = await getGtfsStationsByRailRoute(
    "https://mkuran.pl/gtfs/pkpic.zip",
    "pl-pkp"
  );

  return stations.map<Location>(
    ({ stop_lat, stop_lon, stop_name, stop_id: id }) => {
      const coordinates: [number, number] = [stop_lon, stop_lat];
      const country = findCountryByAlpha2(
        feature(coordinates)?.properties.iso1A2!
      )!;

      return point(
        coordinates,
        {
          labels: [{ value: stop_name }],
          ...(country === Country.Poland
            ? {
                [CodeIssuer.UIC]: [
                  { value: Country.Poland.UIC?.[0]?.toString() + id },
                ],
              }
            : {}),
          [Property.Country]: [{ value: country.wikidata }],
        },
        { id }
      );
    }
  );
};

export const getLocations = async () => {
  const normals = Promise.all(
    feeds.map((i) =>
      getGtfsStationsByRailRoute(i[0], i[1]).catch((i) => {
        logger.warn(i);
        return [];
      })
    )
  ).then((stationsNested) =>
    stationsNested
      .flat()
      .map<Location>(({ stop_lat, stop_lon, stop_name, stop_id: id }) => {
        const coordinates: [number, number] = [stop_lon, stop_lat];
        const country = findCountryByAlpha2(
          feature(coordinates)?.properties.iso1A2!
        )!;
        const stationCode =
          typeof id === "number"
            ? id.toString().slice(0, 5)
            : id?.match(/^[0-9]{5}/)?.[0];

        return point(
          coordinates,
          {
            labels: [{ value: stop_name.replace(/ \(?peron [0-9\/]+\)?$/i, '') }],
            ...(stationCode && country === Country.Poland
              ? {
                  [CodeIssuer.UIC]: [
                    {
                      value: Country.Poland.UIC?.[0] + stationCode,
                    },
                  ],
                }
              : {}),
            [Property.Country]: [{ value: country?.wikidata }],
          },
          { id }
        );
      })
  );
  
  const groupedStations = await groupByScore(
    [await normals, await getPkp()].flat(),
    (score) => score?.percentage >= 2
  );

  return await Promise.all(
    groupedStations.map((stations) =>
      stations.length > 1 ? merge(stations, false, false) : stations[0]
    )
  );
};
