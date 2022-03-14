import { Country } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";

/**
 * @see https://transitfeeds.com/p/societe-nationale-des-chemins-de-fer-belges/528
 * @see https://www.transit.land/feeds/f-u-nmbs~sncb
 */
export const getLocations = async () => {
  const data = await getGtfsStations(
    "https://gtfs.irail.be/nmbs/gtfs/latest.zip",
    "irail"
  );
  return data
    .filter(({ location_type }) => location_type === "1")
    .map<LocationV4>(({ stop_lat, stop_lon, stop_name, stop_id, ...item }) => {
      const uic = stop_id.slice(1, 8);
      const url = `https://irail.be/stations/NMBS/00${uic}`;
      return {
        id: url,
        labels: [{ value: stop_name }],
        claims: {
          [CodeIssuer.UIC]: [{ value: uic }],
          [Property.Country]: [{ value: Country.Belgium.wikidata }],
          [Property.CoordinateLocation]: [
            { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
          ],
        },
      };
    });
};
