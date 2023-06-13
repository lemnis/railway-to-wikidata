import { point } from "@turf/turf";
import { Country, findCountryByAlpha2 } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import {
  RELIABILITY_UIC_LEO_EXPRESS_CZECH,
  RELIABILITY_UIC_LEO_EXPRESS_FOREIGN,
} from "./cz-leo-express.contstants";
import { stations, line } from "./cz-leo-express.data";

export const getLocations = () => {
  const lines = line.flat();

  return Object.values(stations)
    .filter(({ type }) => type === "train")
    .map<Location>(({ name, country: countryCode, gps_lat, gps_lon, id }) => {
      const country = findCountryByAlpha2(countryCode.toUpperCase());
      const uic = id.length === 5 ? country?.UIC?.[0] + id : id;

      return point(
        [parseFloat(gps_lon), parseFloat(gps_lat)],
        {
          labels: [{ value: name }],
          [CodeIssuer.UIC]: [
            {
              value: uic,
              info: {
                enabled: lines.includes(parseInt(id)) ? ["cz-leo-express"] : [],
                reliability:
                  country === Country.Czech
                    ? RELIABILITY_UIC_LEO_EXPRESS_CZECH
                    : RELIABILITY_UIC_LEO_EXPRESS_FOREIGN,
              },
            },
          ],
          [Property.Country]: [{ value: country?.wikidata }],
        },
        { id }
      );
    });
};
