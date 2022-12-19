import {
  feature,
  featuresContaining,
  wikidataQIDs,
} from "@ideditor/country-coder";
import { multiPoint, point } from "@turf/turf";
import fetch from "node-fetch";
import {
  findCountryByAlpha2,
  findCountryByIBNR,
} from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import {
  RELIABILITY_BENERAIL_NS_INTERNATIONAL,
  RELIABILITY_IBNR_NS_INTERNATIONAL,
} from "./nl-ns-international.constants";

export const getLocations = async () => {
  const response = await fetch(
    "https://www.nsinternational.com/api/v2/stations/"
  );
  const data: {
    beneCode: string;
    name: string;
    type: string;
    aliases?: string[];
    hafasCodes?: number[];
    location: {
      type: "Point";
      coordinates: [number, number];
    };
  }[] = await response.json();

  return data.map<Location>(
    ({ beneCode: id, name, aliases, hafasCodes, location }) => {
      let country: { wikidata: string } | undefined = location.coordinates?.[0]
        ? feature(location.coordinates)?.properties
        : undefined;
      if (country === feature("Kingdom of Denmark")?.properties) {
        country = feature("Denmark")?.properties;
      }
      if (country === feature("Kingdom of the Netherlands")?.properties) {
        country = feature("Netherlands")?.properties;
      }
      if (!country) {
        country = findCountryByAlpha2(id.slice(0, 2));
      }

      const properties = {
        labels: [
          { value: name },
          ...(aliases ? aliases.map((value) => ({ value })) : []),
        ],
        [CodeIssuer.Benerail]: [
          {
            value: id,
            info: { reliability: RELIABILITY_BENERAIL_NS_INTERNATIONAL },
          },
        ],
        [CodeIssuer.IBNR]: hafasCodes?.map((value) => ({
          value: value.toString(),
          info: { reliability: RELIABILITY_IBNR_NS_INTERNATIONAL },
        })),
        [Property.Country]: [{ value: country?.wikidata }],
      };

      return location.coordinates?.[0]
        ? point(location.coordinates, properties, { id })
        : multiPoint([], properties, { id });
    }
  );
};
