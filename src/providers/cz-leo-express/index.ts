import { findCountryByAlpha2 } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { stations } from "./cz-leo-express.data";

export const getLocations = () => {
  return Object.values(stations)
    .filter(({ type }) => type === "train")
    .map<LocationV4>(({ name, country, gps_lat, gps_lon, id }) => {
      const uic =
        id.length === 5
          ? findCountryByAlpha2(country.toUpperCase())?.UIC?.[0] + id
          : id;

      return {
        labels: [{ value: name }],
        claims: {
          [CodeIssuer.UIC]: [{ value: uic }],
          [Property.Country]: [
            { value: findCountryByAlpha2(country.toUpperCase())?.wikidata },
          ],
          [Property.CoordinateLocation]: [
            { value: [parseFloat(gps_lat), parseFloat(gps_lon)] },
          ],
        },
      };
    });
};
