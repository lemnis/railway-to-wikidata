import { Country } from "../../transform/country";
import { GtfsStops } from "../../types/gtfs";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";

const foreignLocations = {
  "179212": Country.Germany,
  "179193": Country.Ukraine,
  "179223": Country.Czech,
};

/**
 * @license CC0 1.0
 * @see https://mkuran.pl/gtfs/
 */
export const getLocations = async () => {
  const stations = await getGtfsStations<GtfsStops & { stop_IBNR: string }>(
    "https://mkuran.pl/gtfs/pkpic.zip",
    "pkp"
  );

  return stations.map<LocationV4>(
    ({ stop_lat, stop_lon, stop_name, stop_id }) => {
      const country =
        foreignLocations[stop_id as keyof typeof foreignLocations] ||
        Country.Poland;

      return {
        id: stop_id,
        labels: [{ value: stop_name }],
        claims: {
          [CodeIssuer.UIC]: [
            {
              value: (
                country.UIC?.[0] * 100000 +
                parseInt(stop_id.slice(0, -1))
              ).toString(),
            },
          ],
          [Property.Country]: [{ value: country.wikidata }],
          [Property.CoordinateLocation]: [
            { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
          ],
        },
      };
    }
  );
};
