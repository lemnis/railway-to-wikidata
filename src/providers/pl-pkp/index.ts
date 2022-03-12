import { Country } from "../../transform/country";
import { GtfsStops } from "../../types/gtfs";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStations, getGtfsStationsByRailRoute } from "../../utils/gtfs";
import { logger } from "../../utils/logger";

const foreignLocations = {
  "179212": Country.Germany,
  "179193": Country.Ukraine,
  "179223": Country.Czech,
};

const feeds = [
  [
    "http://komunikacja.bialystok.pl/cms/File/download/gtfs/google_transit.zip",
    "pl-bialystok",
  ],
  [
    "https://www.wroclaw.pl/open-data/dataset/rozkladjazdytransportupublicznegoplik_data/resource/62b3f371-2375-4979-874c-05c6bbb9b09e",
    "pl-wroclaw",
  ],
  ["https://mkuran.pl/gtfs/warsaw.zip", "pl-warsaw"],
  ["https://mkuran.pl/gtfs/polregio.zip", "pl-polregio"],
  ["https://mkuran.pl/gtfs/kolejemazowieckie.zip", "pl-kolejemazowieckie"],
  ["https://mkuran.pl/gtfs/wkd.zip", "pl-wkd"],
  ["https://mkuran.pl/gtfs/tristar.zip", "pl-tristar"],
];

/**
 * @license CC0 1.0
 * @see https://mkuran.pl/gtfs/
 */
const getPkp = async () => {
  const stations = await getGtfsStationsByRailRoute(
    "https://mkuran.pl/gtfs/pkpic.zip",
    "pkp"
  );

  return stations.map<LocationV4>(
    ({ stop_lat, stop_lon, stop_name, stop_id }) => {
      const country =
        (foreignLocations as any)[stop_id as any] ||
        Country.Poland;

      return {
        id: stop_id as any,
        labels: [{ value: stop_name }],
        claims: {
          [CodeIssuer.UIC]: [
            {
              value: (country.UIC?.[0] * 100000 + Math.floor(stop_id / 10)).toString(),
            },
          ],
          [Property.Country]: [{ value: country.wikidata }],
          [Property.CoordinateLocation]: [{ value: [stop_lat, stop_lon] }],
        },
      };
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
  ).then((i) => {
    return i
      .flat()
      .map<LocationV4>(({ stop_lat, stop_lon, stop_name, stop_id }) => ({
        id: stop_id as any,
        labels: [{ value: stop_name }],
        claims: {
          [CodeIssuer.UIC]: [
            {
              value: (
                Country.Poland.UIC?.[0] * 100000 +
                Math.floor(stop_id / 10)
              ).toString(),
            },
          ],
          [Property.Country]: [{ value: Country.Poland.wikidata }],
          [Property.CoordinateLocation]: [{ value: [stop_lat, stop_lon] }],
        },
      }));
  });

  return [await normals, await getPkp()].flat();
};
