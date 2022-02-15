import { CodeIssuer, Property } from "../../types/wikidata";

enum Reliability {
  START = 0.1,
  THIRD_PARTY = 0.1,
  FIRST_PARTY = 0.2,
  COMPUTED = 0.1,
  RAW = 0.2,
  SMALL_DATA_SET = 0.1,
  BIG_DATA_SET = 0.3,
}

export const LARGE_DATA_SIZE = 20;

export const GERMANY_IBNR_SCORE = 1;
export const GERMANY_DB_SCORE = 1;
export const GERMANY_POSTAL_CODE_SCORE = 1;
export const GERMANY_STATION_CATEGORY_SCORE = 1;
export const GERMANY_IN_ADMINISTRATIVE_TERRITORY_SCORE = 1;

export const Score = {
  [Property.PostalCode]: GERMANY_POSTAL_CODE_SCORE,
}

export const ReliabilityDb = {
  Germany: {
    [CodeIssuer.IBNR]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * GERMANY_IBNR_SCORE),
    [CodeIssuer.DB]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * GERMANY_DB_SCORE),
    [Property.PostalCode]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * Score[Property.PostalCode]),
    [Property.DBStationCategory]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * GERMANY_STATION_CATEGORY_SCORE),
    [Property.InAdministrativeTerritory]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * GERMANY_IN_ADMINISTRATIVE_TERRITORY_SCORE),
  },
};
