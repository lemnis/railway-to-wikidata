import { Country, findCountryByAlpha2 } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import {
  RELIABILITY_UIC_LEO_EXPRESS_CZECH,
  RELIABILITY_UIC_LEO_EXPRESS_FOREIGN,
} from "./cz-leo-express.contstants";
import { stations } from "./cz-leo-express.data";

export const getLocations = () => {
  return Object.values(stations)
    .filter(({ type }) => type === "train")
    .map<Location>(({ name, country: countryCode, gps_lat, gps_lon, id }) => {
      const country = findCountryByAlpha2(countryCode.toUpperCase());
      const uic = id.length === 5 ? country?.UIC?.[0] + id : id;

      return {
        type: "Feature",
        id,
        geometry: {
          type: "Point",
          coordinates: [parseFloat(gps_lon), parseFloat(gps_lat)],
        },
        properties: {
          labels: [{ value: name }],
          [CodeIssuer.UIC]: [
            {
              value: uic,
              info: {
                reliability:
                  country === Country.Czech
                    ? RELIABILITY_UIC_LEO_EXPRESS_CZECH
                    : RELIABILITY_UIC_LEO_EXPRESS_FOREIGN,
              },
            },
          ],
          [Property.Country]: [{ value: country?.wikidata }],
        },
      };
    });
};
