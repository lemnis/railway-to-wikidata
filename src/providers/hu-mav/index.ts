import { Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { Country } from "../../transform/country";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";
import { groupByScore } from "../../group/score";
import { merge } from "../../actions/merge";
import { multiPoint, point } from "@turf/turf";

/**
 * @see https://gtfs.menetbrand.com/letoltes/
 */
export const getLocations = async () => {
  const ungroupedStations = await getGtfsStationsByRailRoute(
    "https://gtfs.menetbrand.com/download/mav",
    "mav"
  ).then((data) =>
    data.map<Location>(({ stop_lat, stop_lon, stop_name, stop_id: id }) => {
      const properties = {
        labels: [{ value: stop_name! }],
        [Property.Country]: [{ value: Country.Hungary.wikidata }],
      };

      return stop_lat && stop_lon
        ? point([stop_lat, stop_lon], properties, { id })
        : multiPoint([], properties, { id });
    })
  );

  const groupedStations = await groupByScore(
    ungroupedStations,
    (score) => score?.percentage >= 2.5
  );

  return await Promise.all(
    groupedStations.map((stations) =>
      stations.length > 1 ? merge(stations, false, false) : stations[0]
    )
  );
};
