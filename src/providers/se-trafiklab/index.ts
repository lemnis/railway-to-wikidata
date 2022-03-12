import { TRAFIKLAB_COUNTRY_API_KEY } from "../../../environment";
import { findCountryByUIC } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";

export const getLocations = (): Promise<LocationV4[]> =>
  getGtfsStationsByRailRoute(
    `https://api.resrobot.se/gtfs/sweden.zip?key=${TRAFIKLAB_COUNTRY_API_KEY}`,
    "sweden",
    { routeType: [101, 102, 105, 106] }
  ).then((data) =>
    data.map(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      const uicCountryCode = stop_id.toString().slice(0, 2);
      const uicStationCode = stop_id.toString().slice(-5);
      return {
        id: stop_id.toString(),
        labels: [{ value: stop_name }],
        claims: {
          [CodeIssuer.UIC]: [{ value: uicCountryCode + uicStationCode }],
          [Property.Country]: [
            { value: findCountryByUIC(parseInt(uicCountryCode))?.wikidata },
          ],
          [Property.CoordinateLocation]: [{ value: [stop_lat, stop_lon] }],
        },
      };
    })
  );
