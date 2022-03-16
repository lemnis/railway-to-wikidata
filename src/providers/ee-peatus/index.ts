import { Property } from "../../types/wikidata";
import { LocationV4 } from "../../types/location";
import { Country } from "../../transform/country";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";

/**
 * @license Unknown
 * @see https://www.mnt.ee/eng/public-transportation/public-transport-information-system
 */
export const getLocations = (): Promise<LocationV4[]> =>
  getGtfsStationsByRailRoute(
    "https://peatus.ee/gtfs/gtfs.zip",
    "peatus"
  ).then((data) =>
    data.map(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      return {
        id: stop_id.toString(),
        labels: [{ value: stop_name }],
        claims: {
          [Property.Country]: [{ value: Country.Estonia.wikidata }],
          [Property.CoordinateLocation]: [
            { value: [stop_lat, stop_lon] },
          ],
        },
      };
    })
  );
