import { feature } from "@ideditor/country-coder";
import { point } from "@turf/turf";
import { TRAFIKLAB_COUNTRY_API_KEY } from "../../../environment";
import { Country, findCountryByUIC } from "../../transform/country";
import { Language } from "../../transform/language";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";
import { ReliabilityTrafiklab } from "./se-trafiklab.constants";

export const getLocations = (): Promise<Location[]> =>
  getGtfsStationsByRailRoute(
    `https://api.resrobot.se/gtfs/sweden.zip?key=${TRAFIKLAB_COUNTRY_API_KEY}`,
    "sweden",
    { routeType: [101, 102, 105, 106] }
  ).then((data) =>
    data.map<Location>(({ stop_lat, stop_lon, stop_name, stop_id: id }) => {
      const uicCountryCode = id.toString().slice(0, 2);
      const uicStationCode = id.toString().slice(-5);

      const country = findCountryByUIC(parseInt(uicCountryCode))?.wikidata;

      return point(
        [stop_lon!, stop_lat!],
        {
          labels: [{ value: stop_name!, lang: Language.Swedish[1] }],
          [CodeIssuer.UIC]: [
            {
              value: uicCountryCode + uicStationCode,
              info: {
                reliability:
                  country === Country.Sweden.wikidata
                    ? ReliabilityTrafiklab.Sweden[CodeIssuer.UIC]
                    : ReliabilityTrafiklab.Foreign[CodeIssuer.UIC],
              },
            },
          ],
          [Property.Country]: [{ value: country }],
        },
        { id }
      );
    })
  );
