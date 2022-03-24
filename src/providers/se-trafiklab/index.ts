import { TRAFIKLAB_COUNTRY_API_KEY } from "../../../environment";
import { findCountryByUIC } from "../../transform/country";
import { Language } from "../../transform/language";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";

export const getLocations = (): Promise<Location[]> =>
  getGtfsStationsByRailRoute(
    `https://api.resrobot.se/gtfs/sweden.zip?key=${TRAFIKLAB_COUNTRY_API_KEY}`,
    "sweden",
    { routeType: [101, 102, 105, 106] }
  ).then((data) =>
    data.map<Location>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      const uicCountryCode = stop_id.toString().slice(0, 2);
      const uicStationCode = stop_id.toString().slice(-5);
      return {
        type: "Feature",
        id: stop_id,
        geometry: {
          type: "Point",
          coordinates: [stop_lon, stop_lat],
        },
        properties: {
          labels: [{ value: stop_name, lang: Language.Swedish[1] }],
          [CodeIssuer.UIC]: [{ value: uicCountryCode + uicStationCode }],
          [Property.Country]: [
            { value: findCountryByUIC(parseInt(uicCountryCode))?.wikidata },
          ],
        },
      };
    })
  );
