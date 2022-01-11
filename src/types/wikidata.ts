export enum CodeIssuer {
  DB = "P8671",
  IBNR = "P954",
  UIC = "P722",
  Benerail = "P8448",
  ATOC = "P4755",
  Trainline = "P6724",
  SNCF = "P8181",
  IATA = "P238",
  GaresAndConnexions = "P3104",
}

export enum Property {
  StationCode = "P296",
  InAdministrativeTerritory = "P131",
  PostalCode = "P281",
  Location = "P276",
  CoordinateLocation = "P625",
  Country = "P17",
  AppliesToPart = "P518",
  LocatedInTimeZone = "P421",
  NumberOfPlatformTracks = 'P1103',
  NumberOfPlatformFaces = 'P5595',
  OfficialWebsite = 'P856'
}

export enum Items {
  AdministrativeTerritorialEntity = "Q56061",
}

export enum Country {
  Afghanistan = "Q889",
  Albania = "Q222",
  Algeria = "Q262",
  Armenia = "Q399",
  Austria = "Q40",
  Azerbaijan = "Q227",
  Belarus = "Q184",
  Belgium = "Q31",
  BosniaAndHerzegovina = "Q225",
  Bulgaria = "Q219",
  China = "Q148",
  Croatia = "Q224",
  Cuba = "Q241",
  Czech = "Q213",
  Denmark = "Q35",
  Egypt = "Q79",
  Estonia = "Q191",
  Finland = "Q33",
  France = "Q142",
  Georgia = "Q230",
  Germany = "Q183",
  Greece = "Q41",
  Hungary = "Q28",
  Iran = "Q794",
  Iraq = "Q796",
  Ireland = "Q27",
  Israel = "Q801",
  Italy = "Q38",
  Japan = "Q17",
  Kazakhstan = "Q232",
  Kyrgyzstan = "Q813",
  Latvia = "Q211",
  Lebanon = "Q822",
  Lithuania = "Q37",
  Lituania = "Q37",
  Luxembourg = "Q32",
  Marocco = "Q1028",
  Moldova = "Q217",
  Monaco = "Q235",
  Mongolia = "Q711",
  Montenegro = "Q236",
  Morocco = "Q1028",
  Netherlands = "Q55",
  NewZealand = "Q664",
  NorthKorea = "Q423",
  NorthMacedonia = "Q221",
  Norway = "Q20",
  Poland = "Q36",
  Portugal = "Q45",
  Romania = "Q218",
  Romanian = "Q218",
  Russia = "Q159",
  Serbia = "Q403",
  Slovakia = "Q214",
  Slovenia = "Q215",
  SouthKorea = "Q884",
  Spain = "Q29",
  Sweden = "Q34",
  Switzerland = "Q39",
  Syria = "Q858",
  Tajikistan = "Q863",
  Tunisia = "Q948",
  Turkey = "Q43",
  Turkmenistan = "Q874",
  Ukraine = "Q212",
  UnitedKingdom = "Q145",
  Uzbekistan = "Q265",
  Vietnam = "Q88",

  Cyprus = "Q229",
  Malta = "Q233",
  Andorra = "Q228",
}

export const UICCountryCode = {
  "10": Country.Finland,
  "20": Country.Russia,
  "21": Country.Belarus,
  "22": Country.Ukraine,
  "23": Country.Moldova,
  "24": Country.Lithuania,
  "25": Country.Latvia,
  "26": Country.Estonia,
  "27": Country.Kazakhstan,
  "28": Country.Georgia,
  "29": Country.Uzbekistan,
  "30": Country.NorthKorea,
  "31": Country.Mongolia,
  "32": Country.Vietnam,
  "33": Country.China,
  "40": Country.Cuba,
  "41": Country.Albania,
  "42": Country.Japan,
  "44": Country.BosniaAndHerzegovina,
  "49": Country.BosniaAndHerzegovina,
  "50": Country.BosniaAndHerzegovina,
  "51": Country.Poland,
  "52": Country.Bulgaria,
  "53": Country.Romania,
  "54": Country.Czech,
  "55": Country.Hungary,
  "56": Country.Slovakia,
  "57": Country.Azerbaijan,
  "58": Country.Armenia,
  "59": Country.Kyrgyzstan,
  "60": Country.Ireland,
  "61": Country.SouthKorea,
  "62": Country.Montenegro,
  "64": Country.NewZealand,
  "65": Country.NorthMacedonia,
  "66": Country.Tajikistan,
  "67": Country.Turkmenistan,
  "68": Country.Afghanistan,
  "70": Country.UnitedKingdom,
  "71": Country.Spain,
  "72": Country.Serbia,
  "73": Country.Greece,
  "74": Country.Sweden,
  "75": Country.Turkey,
  "76": Country.Norway,
  "78": Country.Croatia,
  "79": Country.Slovenia,
  "80": Country.Germany,
  "81": Country.Austria,
  "82": Country.Luxembourg,
  "83": Country.Italy,
  "84": Country.Netherlands,
  "85": Country.Switzerland,
  "86": Country.Denmark,
  "87": Country.France,
  "88": Country.Belgium,
  "90": Country.Egypt,
  "91": Country.Tunisia,
  "92": Country.Algeria,
  "93": Country.Morocco,
  "94": Country.Portugal,
  "95": Country.Israel,
  "96": Country.Iran,
  "97": Country.Syria,
  "98": Country.Lebanon,
  "99": Country.Iraq,
};

export const IBNRCountryCode = {
  "36": Country.Germany,
  "37": Country.Germany,
  "50": Country.Germany,
  "71": Country.Germany,
  "72": Country.Germany,
  "80": Country.Germany,
  "96": Country.Germany,

  "51": Country.Poland,
  "53": Country.Romania,
  "54": Country.Czech,
  "55": Country.Hungary,
  "56": Country.Slovakia,
  "74": Country.Sweden,
  "78": Country.Croatia,
  "79": Country.Slovenia,
  "81": Country.Austria,
  "82": Country.Luxembourg,
  "83": Country.Italy,
  "84": Country.Netherlands,
  "85": Country.Switzerland,
  "86": Country.Denmark,
  "87": Country.France,
  "88": Country.Belgium,

};

export const ISOAlpha2Code = {
  BE: Country.Belgium,
  CH: Country.Switzerland,
  DE: Country.Germany,
  PT: Country.Portugal,
  BA: Country.BosniaAndHerzegovina,
  IL: Country.Israel,
  MA: Country.Morocco,
  TJ: Country.Tajikistan,
  AT: Country.Austria,
  HU: Country.Hungary,
  MC: Country.Monaco,
  ME: Country.Montenegro,
  SI: Country.Slovenia,
  TN: Country.Tunisia,
  EE: Country.Estonia,
  FI: Country.Finland,
  GR: Country.Greece,
  LB: Country.Lebanon,
  LU: Country.Luxembourg,
  MK: Country.NorthMacedonia,
  RU: Country.Russia,
  TR: Country.Turkey,
  AL: Country.Albania,
  FR: Country.France,
  MN: Country.Mongolia,
  NO: Country.Norway,
  BG: Country.Bulgaria,
  RO: Country.Romania,
  SY: Country.Syria,
  CZ: Country.Czech,
  GE: Country.Georgia,
  LT: Country.Lithuania,
  SE: Country.Sweden,
  ES: Country.Spain,
  AF: Country.Afghanistan,
  AZ: Country.Azerbaijan,
  AM: Country.Armenia,
  IQ: Country.Iraq,
  HR: Country.Croatia,
  UA: Country.Ukraine,
  VN: Country.Vietnam,
  LV: Country.Latvia,
  SK: Country.Slovakia,
  CU: Country.Cuba,
  MD: Country.Moldova,
  PL: Country.Poland,
  KG: Country.Kyrgyzstan,
  RS: Country.Serbia,
  BY: Country.Belarus,
  GB: Country.UnitedKingdom,
  DK: Country.Denmark,
  DZ: Country.Algeria,
  KZ: Country.Kazakhstan,
  NL: Country.Netherlands,
  IT: Country.Italy,
  TM: Country.Turkmenistan,
  IE: Country.Ireland,
  JP: Country.Japan,
  EG: Country.Egypt,
  IR: Country.Iran,

  // Without UIC Code
  AD: Country.Andorra,
  LI: Country.Lituania,
  MT: Country.Malta,
  CY: Country.Cyprus,
};

export const References = {
  GaresVoyaguers: "Q14915744",
  Trainline:  "Q63450820",
  SBB: (UIC: number) => `https://lod.opentransportdata.swiss/didok/${UIC}`,
  Digitraffic: 'https://rata.digitraffic.fi/api/v1/metadata/stations',
  ATOC: (stationCode: string) => `https://ojp.nationalrail.co.uk/service/ldbboard/dep/${stationCode}`,
  NS: (stationCode: string) => `https://www.ns.nl/en/stationsinformatie/${stationCode}`,
  DB: {
    P248: 'Q63433395'
  }
};

export interface ClaimObject<T = string | number> {
  id?: string;
  property?: string;
  value?: T;
  rank?: string;

  text?: string;
  language?: string;
  amount?: number;
  unit?: string;
  snaktype?: string;
  remove?: boolean;

  qualifiers?: Record<string, Claim<"qualifiers" | "references">>;
  references?: Record<string, string>[] | Record<string, string>;
}

type Claim<T extends string = never> =
  | string
  | number
  | Omit<ClaimObject, T>
  | Claim<T>[];

export interface EntityEdit {
  id: string;
  labels?: Record<string, null | string>;
  descriptions?: Record<string, null | string>;
  sitelinks?: Record<string, null | string>;
  /**
   *  For any language specified, the values you pass will overwrite the existing values,
   *  which means a empty array or null will remove all existing aliases.
   */
  aliases?: Record<
    string,
    null | string | (string | { value: string; add?: boolean })[]
  >;
  claims?: Record<string, Claim>;

  // For convenience, the summary and baserevid can also be passed from this edit object
  summary?: string;
  baserevid?: number;
}
interface ClaimStrict extends Omit<ClaimObject, "qualifiers"> {
  qualifiers?: Record<string, Omit<ClaimObject, "qualifiers" | "references">[]>;
}

export interface EntityStrict {
  id: string;
  labels?: Record<string, { value: string; add?: boolean }[]>;
  claims?: ClaimStrict;
}
