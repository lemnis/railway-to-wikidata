import { feature } from "@ideditor/country-coder";
import { point } from "@turf/turf";
import { merge } from "../../actions/merge";
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
          [CodeIssuer.UIC]: [
            {
              value: (
                country.UIC?.[0]! * 100000 +
                Math.floor((id as any) / 10)
              ).toString(),
            },
          ],
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
        const stationCode =
          typeof id === "number" ? id : id?.match(/^[0-9]{5}/)?.[0];

        return point(
          [stop_lon, stop_lat],
          {
            labels: [{ value: stop_name }],
            ...(stationCode
              ? {
                  [CodeIssuer.UIC]: [
                    {
                      value: (
                        Country.Poland.UIC?.[0] * 100000 +
                        parseFloat(stationCode.toString())
                      ).toString(),
                    },
                  ],
                }
              : {}),
            [Property.Country]: [
              { value: feature([stop_lon, stop_lat])?.properties.wikidata },
            ],
          },
          { id }
        );
      })
  );

  const ungroupedStations = [await normals, await getPkp()].flat();

  const groupedStations: Location[][] = [];

  for await (const station of ungroupedStations) {
    const [index, highestMatch] =
      (await Promise.all(
        groupedStations.map((r, index) =>
          Promise.all(r.map((b) => score(station, b)))
            .then((r) => r.sort((a, b) => b.percentage - a.percentage)?.[0])
            .then(
              (r) => [index, r] as [number, Awaited<ReturnType<typeof score>>]
            )
        )
      ).then(
        (r) => r.sort((a, b) => b[1].percentage - a[1].percentage)?.[0]
      )) || [];

    if (highestMatch?.percentage >= 2) {
      groupedStations[index].push(station);
    } else {
      groupedStations.push([station]);
    }
  }

  return await Promise.all(
    groupedStations.map((stations) =>
      stations.length > 1 ? merge(stations, false, false) : stations[0]
    )
  );
};
