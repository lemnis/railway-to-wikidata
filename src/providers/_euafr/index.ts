import fetch from "node-fetch";
import { RINF_LOGIN_DETAILS } from "../../../environment";
import {
  Country,
  CountryInfo,
  findCountryByAlpha2,
} from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { Language, LanguageInfo } from "../../transform/language";
import { getReliabilityScore } from "./euafr.constants";
import { feature } from "@ideditor/country-coder";
import { point } from "@turf/turf";

const API_BASE_URL = "https://rinf.era.europa.eu/api";

const body = new URLSearchParams();
body.append("grant_type", "password");
body.append("password", RINF_LOGIN_DETAILS.password);
body.append("username", RINF_LOGIN_DETAILS.username);

const endsWith5Numbers = /[0-9]{5}$/;

export const token = fetch(`${API_BASE_URL}/token`, {
  method: "POST",
  body,
})
  .then((response) => response.json())
  .then(({ access_token }) => access_token);

const mapping: Record<
  string,
  {
    getCode?: (id: string, name: string) => string | undefined;
    filter?: (id: string, name: string) => boolean;
    getName?: (name: string) => string;
    property?: CodeIssuer | Property | undefined;
    country?: CountryInfo;
    language?: LanguageInfo;
  }
> = {
  Bulgaria: { property: CodeIssuer.UIC },
  Croatia: { property: CodeIssuer.UIC },
  Finland: {
    property: CodeIssuer.UIC, // [0-9]{5}
    language: Language.Finnish,
  },
  Italy: { property: CodeIssuer.UIC },
  Spain: {
    property: CodeIssuer.UIC,
    language: Language.Spanish,
  },
  "Czech Republic": { property: CodeIssuer.UIC },
  Romania: { property: CodeIssuer.UIC },
  Switzerland: { property: CodeIssuer.UIC }, // [0-9]{5}
  Denmark: { property: undefined }, // [0-9]{5}
  Estonia: { property: undefined }, // A-Z0-9]{3,10}
  France: { property: undefined }, // [0-9]
  Greece: { property: undefined }, // [0-9]{5}
  Hungary: { property: undefined }, // [0-9]{5}
  Latvia: { property: undefined }, // [0-9]{10}
  Lithuania: { property: undefined },
  Luxembourg: { property: undefined },
  Norway: {
    property: CodeIssuer.UIC,
    getCode: (id) => "0" + id.slice(-5, -1),
  },
  Poland: { property: CodeIssuer.UIC },
  Portugal: { property: CodeIssuer.UIC },
  Slovenia: {
    property: CodeIssuer.UIC,
    language: Language.Slovenian,
  },
  "The Netherlands": {
    property: Property.StationCode,
    language: Language.Dutch,
    filter: (id, name) =>
      !["aansl", "overloopwissels"].some((n) => name.includes(n)),
  },
  "United Kingdom": {
    country: Country.UnitedKingdom,
    language: Language.English,
    property: CodeIssuer.ATOC,
    getCode: (o, fullName) => {
      // Commonly the name is constructed as 'Station_${ID}_${name}'
      const [f, id] = fullName.split("_");

      if (!id?.match(/^[A-Z]{3}/)?.[0]) {
        return undefined;
      }

      return id;
    },
    getName: (name) => name.split("_")[2],
  },
  Sweden: {
    property: Property.StationCode,
    language: Language.Swedish,
  },
  Belgium: {
    property: Property.StationCode,
    getCode: (id) => {
      if (id === "BEDSPA1" || (id.startsWith("BEFND") && id.length === 7))
        return "FNND";

      // Remove country code and numbers used as suffix
      return id.slice(2).match(/^[A-Z]+/)?.[0]!;
    },
  },
  Germany: {
    property: CodeIssuer.DB,
    /**
     * Remove text after space and country code, so:
     * If ATFOO BAR, return FOO
     */
    getCode: (id) => {
      const cleanId = id.replace(/0/g, "").split(" ")?.[0];
      if (!cleanId.match(/^[A-Z]*$/)) {
        console.log("Germany", id);
      }

      return cleanId.slice(2);
    },
  },
  "Slovak Republic": {
    language: Language.Slovak,
    property: CodeIssuer.UIC,
    /** Get first 5 numbers,format [0-9]{6} */
    getCode: (id) => id.slice(2, 7),
  },
  Austria: {
    language: Language.German,
    property: Property.StationCode,
    /**
     * Remove text after space and country code, so:
     * If ATFOO BAR, return FOO
     */
    getCode: (id) => id.split(" ")?.[0].slice(2),
  },
};

export const getLocations = async () => {
  const response = await fetch(`${API_BASE_URL}/OperationalPoints`, {
    headers: {
      Authorization: `Bearer ${await token}`,
    },
  });

  const {
    value: locations,
  }: {
    value: {
      ID: number;
      VersionId: number;
      Name: string;
      Type: string;
      Country: string;
      Latitude: number;
      Longitude: number;
      UOPID: string;
      OPTypeGaugeChangeover: string;
      TafTAPCodes: any;
    }[];
  } = await response.json();

  return locations
    .filter(({ Type }) =>
      [
        "station",
        "small station",
        "passenger stop",
        "passenger terminal",
      ].includes(Type)
    )
    .filter(({ Name, Country, UOPID }) => {
      const type = mapping[Country as keyof typeof mapping];
      return type?.filter ? type?.filter(UOPID, Name) : true;
    })
    .map<Location>(({ Name, Country, Longitude, Latitude, UOPID: id }) => {
      const type = mapping[Country as keyof typeof mapping];
      const isNumericCode = id.match(endsWith5Numbers);
      const country = findCountryByAlpha2(
        feature(Country)?.properties.iso1A2 || id.slice(0, 2).toUpperCase()
      );
      let property = type?.property;
      const stationCode =
        type?.getCode?.(id, Name) ||
        (isNumericCode ? id.slice(-5) : id.slice(2));

      if (!country) {
        console.error(`ERROR: Could not parse ${Country} as country`);
      }
      if (
        [CodeIssuer.UIC, CodeIssuer.IBNR].includes(property as any) &&
        !isNumericCode
      ) {
        console.warn(
          `WARN:
  Expected numeric id, but got "${id}", removing id from result.
  https://www.openstreetmap.org/#map=17/${Latitude}/${Longitude} (${Name})`
        );
        property = undefined;
      }

      return point(
        [Longitude, Latitude],
        {
          labels: [
            {
              value: type?.getName?.(Name) || Name,
              lang: type?.language?.[1],
            },
          ],
          ...((property && stationCode)
            ? {
                [property]: [
                  {
                    value: isNumericCode
                      ? country?.UIC?.[0] + stationCode
                      : stationCode,
                    info: {
                      reliability:
                        country && getReliabilityScore(country)[property],
                    },
                  },
                ],
              }
            : {}),
          [Property.Country]: [{ value: country?.wikidata }],
        },
        { id }
      );
    });
};
