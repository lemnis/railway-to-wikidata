import { Items, Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { Country } from "../../transform/country";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";
import { point } from "@turf/turf";
import { score } from "../../score";
import { merge } from "../../actions/merge";

/**
 * @license Unknown
 * @see https://www.mnt.ee/eng/public-transportation/public-transport-information-system
 */
export const getLocations = async (): Promise<Location[]> => {
  const data = await getGtfsStationsByRailRoute(
    "https://peatus.ee/gtfs/gtfs.zip",
    "peatus"
  );

  // https://web.peatus.ee/pysakit/estonia:10137

  const ungroupedStations = data
    .map<Location>(({ stop_lat, stop_lon, stop_name, stop_id }) =>
      point(
        [stop_lon!, stop_lat!],
        {
          labels: [{ value: stop_name! }],
          [Property.Country]: [{ value: Country.Estonia.wikidata }],
          [Property.StationCode]: [
            {
              value: stop_id.toString(),
              qualifiers: { [Property.AppliesToPart]: [{ value: Items.EstonianTransportAdministration }] },
            },
          ],
        },
        { id: stop_id }
      )
    )
    .sort((a, b) => a.id!.toString().localeCompare(b.id!.toString()));

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
