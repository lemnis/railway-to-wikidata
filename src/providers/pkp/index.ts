import { Country } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";

/**
 * @license CC0 1.0
 * @see https://mkuran.pl/gtfs/
 */
export const getLocations = () =>
  getGtfsStations("https://mkuran.pl/gtfs/pkpic.zip", "pkp").then((data) =>
    data
      // .filter(({ location_type }) => location_type === "1")
      .map<LocationV4>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
        return {
          id: stop_id,
          labels: [{ value: stop_name }],
          claims: {
            [CodeIssuer.UIC]: [
              {
                value: (
                  Country.Poland.UIC?.[0] * 100000 +
                  parseInt(stop_id.slice(0, -1))
                ).toString(),
              },
            ],
            // [Property.StationCode]: [{ value: stop_id }],
            [Property.Country]: [{ value: Country.Poland.wikidata }],
            [Property.CoordinateLocation]: [
              { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
            ],
          },
        };
      })
  );
