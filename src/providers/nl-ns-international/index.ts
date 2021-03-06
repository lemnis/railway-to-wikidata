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
    ({ beneCode, name, aliases, hafasCodes, location }) => ({
      type: "Feature",
      id: beneCode,
      geometry: location.coordinates[0]
        ? location
        : { type: "MultiPoint", coordinates: [] },
      properties: {
        labels: [
          { value: name },
          ...(aliases ? aliases.map((value) => ({ value })) : []),
        ],
        [CodeIssuer.Benerail]: [
          {
            value: beneCode,
            info: { reliability: RELIABILITY_BENERAIL_NS_INTERNATIONAL },
          },
        ],
        [CodeIssuer.IBNR]: hafasCodes?.map((value) => ({
          value: value.toString(),
          info: { reliability: RELIABILITY_IBNR_NS_INTERNATIONAL },
        })),
        [Property.Country]: [
          {
            value:
              hafasCodes
                ?.map((i) =>
                  findCountryByIBNR(parseInt(i.toString().slice(0, 2)))
                )
                .filter(Boolean)?.[0]?.wikidata ||
              findCountryByAlpha2(beneCode.slice(0, 2))?.wikidata,
          },
        ],
      },
    })
  );
};
