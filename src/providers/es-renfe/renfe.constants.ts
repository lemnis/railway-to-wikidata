import { Reliability } from "../../score/reliability";

export const SCORE_UIC = 1;

export const RELIABILITY_RENFE_UIC =
  Reliability.START +
  (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.COMPUTED) *
    SCORE_UIC;
