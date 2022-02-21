import { CodeIssuer, Property } from "../../types/wikidata";
import { LocationV4 } from "../../types/location";
import { Country } from "../../transform/country";
import { getGtfsStations } from "../../utils/gtfs";

/**
 * @see https://gtfs.menetbrand.com/letoltes/
 */
export const getLocations = (): Promise<LocationV4[]> =>
  getGtfsStations(
    "https://gtfs.menetbrand.com/download/mav",
    "mav"
  ).then((data) =>
    data.map(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      return {
        id: stop_id,
        labels: [{ value: stop_name }],
        claims: {
          [CodeIssuer.UIC]: [{ value: (
              Country.Hungary.UIC?.[0] * 10000 +
              parseInt(stop_id)
          ).toString() }],
          [Property.Country]: [{ value: Country.Hungary.wikidata }],
          [Property.CoordinateLocation]: [
            { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
          ],
        },
      };
    })
  );
