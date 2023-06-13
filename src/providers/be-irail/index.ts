import { multiPoint, point } from "@turf/turf";
import { Country } from "../../transform/country";
import { LocationType } from "../../types/gtfs";
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
    .filter(({ location_type }) => location_type === LocationType.STATION)
    .map<Location>(({ stop_lat, stop_lon, stop_name, stop_id: id }) => {
      const properties = {
        labels: stop_name ? [{ value: stop_name }] : [],
        [CodeIssuer.UIC]: [
          {
            value: id.toString().slice(1, 8),
            info: { reliability: RELIABILITY_UIC_IRAIL },
          },
        ],
        [Property.Country]: [{ value: Country.Belgium.wikidata }],
      };

      return stop_lon && stop_lat
        ? point([stop_lon, stop_lat], properties, {
            id,
          })
        : multiPoint([], properties, { id });
    });
};
