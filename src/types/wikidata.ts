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
  ESR = "P2815",
}

export enum Property {
  StationCode = "P296",
  InAdministrativeTerritory = "P131",
  PostalCode = "P281",
  StreetNumber = "P670",
  /** street, road, or square, where the item is located.
   * To add the number, use Property "street number" as qualifier */
  LocatedOnStreet = "P669",
  /** Full street address where subject is located.
   * Include building number, city/locality, post code */
  StreetAddress = "P6375",
  Location = "P276",
  CoordinateLocation = "P625",
  Country = "P17",
  AppliesToPart = "P518",
  NumberOfPlatformTracks = "P1103",
  InstanceOf = 'P31',
  NumberOfPlatformFaces = "P5595",
  OfficialWebsite = "P856",
  DBStationCategory = "P5105",
  PropertyConstraint = "P2302",
  ReferenceURL = "P854",
  WheelchairAccessibility = "P2846",
  ElevationAboveSeaLevel = "P2044",
  SaidToBeTheSameAs = "P460",
  ValidInPeriod = "P1264",
  EndTime = 'P582',
  Wikidata = 'PWIKI',
  WifiAccess = 'P2848'
}

export enum Items {
  AdministrativeTerritorialEntity = "Q56061",
  NederlandseSpoorwegen = "Q23076",
  WheelchairAccessible = 'Q24192067',
  WheelchairPartiallyAccessible = 'Q63731120',
  WheelchairInaccessible = 'Q24192069',
  RailwayStop = 'Q55678',
  RailwayStation = 'Q55488',
  MetroStation = 'Q928830',
  No = 'Q1814990',
  Yes = 'Q6452715'
}

export enum Constraint {
  PreferSingle,
  SingleValue = "Q19474404",
  DistinctValue = "Q21502410",
}

export const PropertyOptions: {
  [prop in Property | CodeIssuer]?: {
    [Property.PropertyConstraint]: Constraint[];
  };
} = {
  [Property.CoordinateLocation]: {
    [Property.PropertyConstraint]: [Constraint.PreferSingle],
  },
  [Property.InAdministrativeTerritory]: {
    [Property.PropertyConstraint]: [Constraint.SingleValue],
  },
  [Property.DBStationCategory]: {
    [Property.PropertyConstraint]: [Constraint.SingleValue],
  },
  [Property.PostalCode]: {
    [Property.PropertyConstraint]: [Constraint.SingleValue],
  },
  [Property.Country]: {
    [Property.PropertyConstraint]: [Constraint.SingleValue],
  },
  [CodeIssuer.UIC]: {
    [Property.PropertyConstraint]: [
      Constraint.DistinctValue,
      Constraint.PreferSingle,
    ],
  },
  [CodeIssuer.DB]: {
    [Property.PropertyConstraint]: [Constraint.SingleValue],
  },
  [CodeIssuer.IBNR]: {
    [Property.PropertyConstraint]: [Constraint.SingleValue],
  },
  [CodeIssuer.Benerail]: {
    [Property.PropertyConstraint]: [Constraint.SingleValue],
  },
  [CodeIssuer.IATA]: {
    [Property.PropertyConstraint]: [Constraint.SingleValue],
  },
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
  oldValue?: T;

  qualifiers?: Record<string, Claim<"qualifiers" | "references">[]>;
  references?: Record<string, Claim<"qualifiers" | "references">>[];

  label?: string;
  "xml:lang"?: string;
  info?: Record<string, any>
  [key: string]: string | boolean | undefined | number | Record<string, any>;
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
  claims?: Record<string, ClaimObject[]>;

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
