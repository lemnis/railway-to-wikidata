import { Reliability } from "../../score/reliability";

export const UIC_SCORE = .9;

export const RELIABILITY_UIC_SBB =
  Reliability.START +
  (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
    UIC_SCORE;
