import { point } from "@turf/turf";
import { merge } from "../../actions/merge";
import { score } from "../../score";
import { Country } from "../../transform/country";
import { Location } from "../../types/location";
import { Property } from "../../types/wikidata";
import { rfiData } from "./rfi.data";
import { stationList } from "./stationList.data";

/**
 * Draft implementation of Trenitalia locations, no official data source.
 * Currently the data is copied from the website.
 * No license!
 */
export const getLocations = async () => {
  // Merge the 2 data sets by a very inperfect name match
  // TODO: improve matching of the 2 data sets
  const merged = rfiData.map((rfi) => ({
    ...rfi,
    stationList: stationList.find(
      (station) => rfi.ct === station.label || station.label === rfi.name
    ),
  }));

  const ungroupedStations = merged.map<Location>(
    ({ loc, name, stationList, ct: id, lk: webpage }) =>
      point(
        [parseFloat(loc.lng), parseFloat(loc.lat)],
        {
          labels: [{ value: name }],
          ...(stationList
            ? { [Property.StationCode]: [{ value: stationList?.value }] }
            : {}),
          [Property.Country]: [{ value: Country.Italy.wikidata }],
          ...(!webpage.includes("0")
            ? {
                [Property.OfficialWebsite]: [
                  { value: `https://www.rfi.it/en/stations/${webpage}` },
                ],
              }
            : {}),
        },
        { id }
      )
  );

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
