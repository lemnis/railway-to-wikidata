import fetch from "node-fetch";
import { RINF_LOGIN_DETAILS } from "../../../environment";
import {
  Country,
  CountryInfo,
  findCountryByAlpha2,
} from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { promises as fs } from "fs";
import { Language, LanguageInfo } from "../../transform/language";

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
    getCode?: (id: string, name: string) => string;
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
  },
  "United Kingdom": {
    country: Country.UnitedKingdom,
    language: Language.English,
    property: CodeIssuer.ATOC,
    getCode: (id, name) => {
      const s = name.split("_");
      if (s[0] !== "Station" || s.length < 3) {
        console.log(name);
      }

      return s[1];
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
      if (id === "BEFSR14") return "FSR";
      if (id === "BEFL4") return "FL";
      if (id === "BEFO926") return "FO";

      if (!id.match(/^[A-Z]*$/)) {
        console.log("Belgium", id);
      }

      // Remove country code
      return id.slice(2);
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
  const {
    value,
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
  } = await fetch(`${API_BASE_URL}/OperationalPoints`, {
    headers: {
      Authorization: `Bearer ${await token}`,
    },
  }).then((response) => response.json());

  const stations = value.filter((point) =>
    [
      "station",
      "small station",
      "passenger stop",
      "passenger terminal",
    ].includes(point.Type)
  );

  return stations.map<Location>(
    ({ Name, Country, Longitude, Latitude, UOPID }) => {
      const type = mapping[Country as keyof typeof mapping];
      const isNumericCode = UOPID.match(endsWith5Numbers);
      const stationCode =
        type?.getCode?.(UOPID, Name) ||
        (isNumericCode ? UOPID.slice(-5) : UOPID.slice(2));
      const country = type?.country || findCountryByAlpha2(UOPID.slice(0, 2));

      if (
        [CodeIssuer.UIC, CodeIssuer.IBNR].includes(type?.property as any) &&
        !isNumericCode
      ) {
        console.log(Country, Name, UOPID, stationCode);
      }

      return {
        type: "Feature",
        id: UOPID,
        geometry: { type: "Point", coordinates: [Longitude, Latitude] },
        properties: {
          labels: [
            { value: type?.getName?.(Name) || Name, lang: type?.language?.[1] },
          ],
          ...(type?.property
            ? {
                [type?.property!]: [
                  {
                    value: isNumericCode
                      ? country?.UIC?.[0] + stationCode
                      : stationCode,
                  },
                ],
              }
            : {}),
          [Property.Country]: [{ value: country?.wikidata }],
        },
      };
    }
  );
};
