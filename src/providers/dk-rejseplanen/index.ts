import { CodeIssuer, Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { findCountryByCoordinates } from "../../transform/country";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";
import { point } from "@turf/turf";

export const getLocations = async () => {
  const data = await getGtfsStationsByRailRoute(
    "https://gtfs.pro/files/sourcedata/rejseplanen.zip",
    "dk-rejseplanen"
  );

  return data.map<Location>(
    ({ stop_lat, stop_lon, stop_name, stop_id: id }) => {
      const coordinates: [number, number] = [stop_lon!, stop_lat!];
      const country = findCountryByCoordinates(coordinates);

      return point(
        coordinates,
        {
          labels: [{ value: stop_name! }],
          [CodeIssuer.UIC]: [
            {
              value: parseInt(id.toString()).toString(),
              info: { enabled: ["dk-rejseplanen"] },
            },
          ],
          [Property.Country]: [{ value: country?.wikidata }],
        },
        { id }
      );
    }
  );
};
