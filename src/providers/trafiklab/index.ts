import { TRAFIKLAB_API_KEY } from "../../../environment";
import { findCountryByUIC } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";

export const getLocations = (): Promise<LocationV4[]> =>
  getGtfsStationsByRailRoute(
    `https://opendata.samtrafiken.se/gtfs/sj/sj.zip?key=${TRAFIKLAB_API_KEY}`,
    "trafilab-sj",
    { routeType: 100 }
  ).then((data) =>
    data
      .map(({ stop_lat, stop_lon, stop_name, stop_id }) => {
        const uicCountryCode = stop_id.toString().slice(5, 7);
        const uicStationCode = stop_id.toString().slice(8, 13);
        return {
          labels: [{ value: stop_name }],
          claims: {
            [CodeIssuer.UIC]: [{ value: uicCountryCode + uicStationCode }],
            [Property.Country]: [
              { value: findCountryByUIC(parseInt(uicCountryCode))?.wikidata },
            ],
            [Property.CoordinateLocation]: [
              { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
            ]
          },
        };
      })
  );
