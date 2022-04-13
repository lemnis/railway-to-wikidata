import { Country } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";
import { RELIABILITY_UIC_IRAIL } from "./be-irail.constants";

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
    .map<Location>(({ stop_lat, stop_lon, stop_name, stop_id }) => ({
      type: "Feature",
      id: stop_id,
      geometry: {
        type: "Point",
        coordinates: [parseFloat(stop_lon), parseFloat(stop_lat)],
      },
      properties: {
        labels: [{ value: stop_name }],
        [CodeIssuer.UIC]: [
          {
            value: stop_id.slice(1, 8),
            info: { reliability: RELIABILITY_UIC_IRAIL },
          },
        ],
        [Property.Country]: [{ value: Country.Belgium.wikidata }],
      },
    }));
};
