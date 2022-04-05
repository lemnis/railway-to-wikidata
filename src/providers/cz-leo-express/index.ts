import { findCountryByAlpha2 } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { stations } from "./cz-leo-express.data";

export const getLocations = () => {
  return Object.values(stations)
    .filter(({ type }) => type === "train")
    .map<Location>(({ name, country, gps_lat, gps_lon, id }) => {
      const uic =
        id.length === 5
          ? findCountryByAlpha2(country.toUpperCase())?.UIC?.[0] + id
          : id;

      return {
        type: "Feature",
        id,
        geometry: {
          type: "Point",
          coordinates: [parseFloat(gps_lon), parseFloat(gps_lat)],
        },
        properties: {
          labels: [{ value: name }],
          [CodeIssuer.UIC]: [{ value: uic }],
          [Property.Country]: [
            { value: findCountryByAlpha2(country.toUpperCase())?.wikidata },
          ],
        },
      };
    });
};
