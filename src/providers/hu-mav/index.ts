import { CodeIssuer, Property } from "../../types/wikidata";
import { LocationV4 } from "../../types/location";
import { Country } from "../../transform/country";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";

/**
 * @see https://gtfs.menetbrand.com/letoltes/
 */
export const getLocations = () =>
  getGtfsStationsByRailRoute(
    "https://gtfs.menetbrand.com/download/mav",
    "mav"
  ).then((data) =>
    data.map<LocationV4>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      return {
        id: stop_id.toString(),
        labels: [{ value: stop_name }],
        claims: {
          [CodeIssuer.UIC]: [
            { value: (Country.Hungary.UIC?.[0] * 100000 + stop_id).toString() },
          ],
          [Property.Country]: [{ value: Country.Hungary.wikidata }],
          [Property.CoordinateLocation]: [{ value: [stop_lat, stop_lon] }],
        },
      };
    })
  );
