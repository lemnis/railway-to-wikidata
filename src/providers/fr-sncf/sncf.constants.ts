import { Reliability } from "../../score/reliability";

export const SCORE_UIC = 1;
export const SCORE_POSTAL_CODE = 1;

export const RELIABILITY_SNCF_UIC =
  Reliability.START +
  (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
    SCORE_UIC;

export const RELIABILITY_SNCF_POSTAL_CODE =
  Reliability.START +
  (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
    SCORE_POSTAL_CODE;
