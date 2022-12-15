import { Language, LanguageInfo } from "../language";

export interface CountryInfo {
  wikidata: string;
  UIC?: number[];
  IVR?: string;
  IBNR?: number[];
  alpha2: string;
  alpha3?: string;
  language?: LanguageInfo;
}

type EnforceObjectType<T> = <V extends T>(v: V) => V;
const enforceObjectType: EnforceObjectType<Record<string, CountryInfo>> = (v) =>
  v;

export const Country = enforceObjectType({
  Austria: {
    wikidata: "Q40" as "Q40",
    UIC: [81],
    IVR: "A",
    IBNR: [81],
    alpha2: "AT",
  },
  Belarus: {
    wikidata: "Q184",
    UIC: [21],
    alpha2: "BY",
  },
  Belgium: {
    wikidata: "Q31",
    UIC: [88],
    IVR: "B",
    IBNR: [88],
    alpha2: "BE",
  },
  Bulgaria: {
    wikidata: "Q219",
    UIC: [52],
    IBNR: [52],
    alpha2: "BG",
  },
  Croatia: {
    wikidata: "Q224",
    UIC: [78],
    IBNR: [78],
    alpha2: "HR",
  },
  Czech: {
    wikidata: "Q213" as "Q213",
    UIC: [54],
    IBNR: [54],
    alpha2: "CZ",
  },
  Denmark: {
    wikidata: "Q35",
    UIC: [86],
    IBNR: [86],
    alpha2: "DK",
  },
  Estonia: {
    wikidata: "Q191",
    UIC: [26],
    alpha2: "EE",
  },
  Finland: {
    wikidata: "Q33",
    UIC: [10],
    alpha2: "FI",
    alpha3: "FIN",
  },
  France: {
    wikidata: "Q142",
    UIC: [87],
    IVR: "F",
    IBNR: [87],
    alpha2: "FR",
  },
  Germany: {
    wikidata: "Q183" as "Q183",
    UIC: [80],
    IVR: "D",
    IBNR: [36, 37, 50, 71, 72, 80, 96],
    alpha2: "DE",
  },
  Greece: {
    wikidata: "Q41",
    UIC: [73],
    alpha2: "GR",
    alpha3: "GRC",
  },
  Hungary: {
    wikidata: "Q28" as "Q28",
    UIC: [55],
    IBNR: [55],
    alpha2: "HU",
  },
  Ireland: {
    wikidata: "Q27",
    UIC: [60],
    alpha2: "IE",
  },
  Italy: {
    wikidata: "Q38",
    UIC: [83],
    IBNR: [83],
    alpha2: "IT",
  },
  Latvia: {
    wikidata: "Q211",
    UIC: [25],
    alpha2: "LV",
  },
  Liechtenstein: {
    wikidata: "Q347",
    UIC: [],
    alpha2: "LI",
  },
  Lithuania: {
    wikidata: "Q37",
    UIC: [24],
    alpha2: "LT",
  },
  Luxembourg: {
    wikidata: "Q32",
    UIC: [82],
    IBNR: [82],
    alpha2: "LU",
  },
  Montenegro: {
    wikidata: "Q236",
    UIC: [62],
    alpha2: "ME",
  },
  Netherlands: {
    wikidata: "Q55",
    UIC: [84],
    IVR: "NL",
    IBNR: [84],
    alpha2: "NL",
    language: Language.Dutch
  },
  NorthMacedonia: {
    wikidata: "Q221",
    UIC: [65],
    alpha2: "MK",
  },
  Norway: {
    wikidata: "Q20",
    UIC: [76],
    IBNR: [76],
    alpha2: "NO",
  },
  Poland: {
    wikidata: "Q36" as "Q36",
    UIC: [51],
    IBNR: [51],
    alpha2: "PL",
  },
  Portugal: {
    wikidata: "Q45",
    UIC: [94],
    alpha2: "PT",
  },
  Romania: {
    wikidata: "Q218",
    UIC: [53],
    IBNR: [53],
    alpha2: "RO",
  },
  Russia: {
    wikidata: "Q159",
    UIC: [20],
    alpha2: "RU",
    alpha3: "RUS",
  },
  Serbia: {
    wikidata: "Q403",
    UIC: [72],
    alpha2: "RS",
    language: Language.Serbian
  },
  Slovakia: {
    wikidata: "Q214" as "Q214",
    UIC: [56],
    IBNR: [56],
    alpha2: "SK",
    language: Language.Slovak
  },
  Slovenia: {
    wikidata: "Q215" as "Q215",
    UIC: [79],
    IBNR: [79],
    alpha2: "SI",
    language: Language.Slovenian
  },
  Spain: {
    wikidata: "Q29",
    UIC: [71],
    alpha2: "ES",
    language: Language.Spanish
  },
  Sweden: {
    wikidata: "Q34",
    UIC: [74],
    IBNR: [74],
    alpha2: "SE",
    language: Language.Swedish
  },
  Switzerland: {
    wikidata: "Q39",
    UIC: [85],
    IVR: "CH",
    alpha2: "CH",
    IBNR: [85],
  },
  Ukraine: {
    wikidata: "Q212",
    UIC: [22],
    alpha2: "UA",
    IBNR: [22],
  },
  UnitedKingdom: {
    wikidata: "Q145",
    UIC: [70],
    IVR: "GB",
    alpha2: "GB",
  },
});

export const findCountryByUIC = (code: number): CountryInfo | undefined =>
  Object.values(Country).find((country) =>
    (country as CountryInfo).UIC?.includes(code)
  );

export const findCountryByIBNR = (code: number): CountryInfo | undefined =>
  Object.values(Country).find((country) =>
    (country as CountryInfo).IBNR?.includes(code)
  );

export const findCountryByIVR = (code: string): CountryInfo | undefined =>
  Object.values(Country).find(
    (country) => (country as CountryInfo).IVR === code
  );

export const findCountryByAlpha2 = (code: string): CountryInfo | undefined =>
  Object.values(Country).find(
    (country) => (country as CountryInfo).alpha2 === code
  );

export const findCountryByAlpha3 = (code: string): CountryInfo | undefined =>
  Object.values(Country).find(
    (country) => (country as CountryInfo).alpha3 === code
  );

export const findCountryNameByWikidata = (code: string) =>
  Object.entries(Country).find(
    ([, country]) => (country as CountryInfo).wikidata === code
  )?.[0];
