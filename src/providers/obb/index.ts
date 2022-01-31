import { CodeIssuer, Property } from "../../types/wikidata";
import { LocationV4 } from "../../types/location";
import { findCountryByUIC } from "../../transform/country";
import { getGtfsStations } from "../../utils/gtfs";

/**
 * @version 2018.06.26
 * @license CC BY 4.0
 * @see https://data.oebb.at/oebb
 */
export const getLocations = (): Promise<LocationV4[]> =>
  getGtfsStations(
    "https://data.oebb.at/oebb?dataset=uddi:cd36722f-1b9a-11e8-8087-b71b4f81793a&file=uddi:d3e25791-7889-11e8-8fc8-edb0b0e1f0ef/GFTS_Fahrplan_OEBB.zip",
    "obb"
  ).then((data) =>
    data.map(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      return {
        id: stop_id,
        labels: [{ value: stop_name }],
        claims: {
          [CodeIssuer.UIC]: [{ value: stop_id }],
          [Property.Country]: [
            {
              value: findCountryByUIC(parseInt(stop_id[0] + stop_id[1]))
                ?.wikidata,
            },
          ],
          [Property.CoordinateLocation]: [
            { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
          ],
        },
      };
    })
  );
