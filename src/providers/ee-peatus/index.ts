import { Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { Country } from "../../transform/country";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";

/**
 * @license Unknown
 * @see https://www.mnt.ee/eng/public-transportation/public-transport-information-system
 */
export const getLocations = async (): Promise<Location[]> => {
  const data = await getGtfsStationsByRailRoute(
    "https://peatus.ee/gtfs/gtfs.zip",
    "peatus"
  );

  return data
    .map<Location>(({ stop_lat, stop_lon, stop_name, stop_id }) => ({
      type: "Feature",
      id: stop_id,
      geometry: { type: "Point", coordinates: [stop_lon, stop_lat] },
      properties: {
        labels: [{ value: stop_name }],
        [Property.Country]: [{ value: Country.Estonia.wikidata }],
      },
    }))
    .sort((a, b) => a.id!.toString().localeCompare(b.id!.toString()));
};
