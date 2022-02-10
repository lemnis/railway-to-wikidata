import { Country } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";

/**
 * @see https://www.transportforireland.ie/transitData/PT_Data.html
 */
export const getLocations = () =>
  getGtfsStations("https://www.transportforireland.ie/transitData/google_transit_irishrail.zip", "irish-rail").then(
    (data) =>
      data
        .filter(({ location_type }) => location_type === "1")
        .map<LocationV4>(
          ({ stop_lat, stop_lon, stop_name, stop_id, ...item }) => {
            const uic = stop_id.slice(1, 8);
            return {
              id: stop_id,
              labels: [{ value: stop_name }],
              claims: {
                [CodeIssuer.UIC]: [{ value: uic }],
                // [Property.StationCode]: [{ value: stop_id }],
                [Property.Country]: [{ value: Country.Ireland.wikidata }],
                [Property.CoordinateLocation]: [
                  { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
                ],
              },
            };
          }
        )
  );
