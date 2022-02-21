import { CodeIssuer, Property } from "../../types/wikidata";
import { LocationV4 } from "../../types/location";
import { Country, findCountryByUIC } from "../../transform/country";
import { getGtfsStations } from "../../utils/gtfs";

/**
 * @see https://data.gov.sk/dataset/https-www-zsr-sk-files-pre-cestujucich-cestovny-poriadok-gtfs-gtfs-zip
 */
export const getLocations = (): Promise<LocationV4[]> =>
  getGtfsStations(
    "https://www.zsr.sk/files/pre-cestujucich/cestovny-poriadok/gtfs/gtfs.zip",
    "zsr"
  ).then((data) =>
    data.map(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      return {
        id: stop_id,
        labels: [{ value: stop_name }],
        claims: {
          [CodeIssuer.UIC]: [{ value: (
              Country.Slovakia.UIC?.[0] * 10000 +
              parseInt(stop_id)
          ).toString() }],
          [Property.Country]: [
            {
              value: Country.Slovakia.wikidata,
            },
          ],
          [Property.CoordinateLocation]: [
            { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
          ],
        },
      };
    })
  );
