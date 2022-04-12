import { Reliability } from "../../score/reliability";

export const UIC_SCORE = 1;

export const RELIABILITY_UIC_IRAIL =
  Reliability.START +
  (Reliability.THIRD_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
    UIC_SCORE;
