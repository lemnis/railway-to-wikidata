import { Reliability } from "../../score/reliability";
import { CodeIssuer, Property } from "../../types/wikidata";

export const SCORE_IBNR = 1;
export const SCORE_DB = 1;
export const SCORE_POSTAL_CODE = 1;
export const SCORE_STATION_CATEGORY = 0;
export const SCORE_IN_ADMINISTRATIVE_TERRITORY = 1;

export const RELIABILITY_DB_IBNR =
  Reliability.START +
  (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
    SCORE_IBNR;
export const RELIABILITY_DB_DB =
  Reliability.START +
  (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
    SCORE_DB;
export const RELIABILIT_DB_POSTAL_CODE =
  Reliability.START +
  (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
    SCORE_POSTAL_CODE;
export const RELIABILIT_DB_STATION_CATEGORY =
  Reliability.START +
  (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
    SCORE_STATION_CATEGORY;
export const RELIABILIT_DB_IN_ADMINISTRATIVE_TERRITORY =
  Reliability.START +
  (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
    SCORE_IN_ADMINISTRATIVE_TERRITORY;
