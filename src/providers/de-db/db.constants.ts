import { Reliability } from "../../score/reliability";
import { CodeIssuer, Property } from "../../types/wikidata";

export const GERMANY_IBNR_SCORE = 1;
export const GERMANY_DB_SCORE = 1;
export const GERMANY_POSTAL_CODE_SCORE = 1;
export const GERMANY_STATION_CATEGORY_SCORE = 0;
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
