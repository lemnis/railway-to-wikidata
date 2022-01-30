import { Country } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";

/**
 * @see https://transitfeeds.com/p/societe-nationale-des-chemins-de-fer-belges/528
 * @see https://www.transit.land/feeds/f-u-nmbs~sncb
 */
export const getLocations = () =>
  getGtfsStations("https://gtfs.irail.be/nmbs/gtfs/latest.zip", "irail").then(
    (data) =>
      data.map<LocationV4>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
        const url = `https://transitfeeds.com/p/societe-nationale-des-chemins-de-fer-belges/528/latest/stop/${stop_id}`;

        return {
          id: url,
          labels: [{ value: stop_name }],
          claims: {
            [CodeIssuer.UIC]: [{ value: Country.Belgium.UIC[0] + stop_id }],
            // [Property.StationCode]: [{ value: stop_id }],
            [Property.Country]: [{ value: Country.Belgium.wikidata }],
            [Property.CoordinateLocation]: [
              { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
            ],
          },
        };
      })
  );
