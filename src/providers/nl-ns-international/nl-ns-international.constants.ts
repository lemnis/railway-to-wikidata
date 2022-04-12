import { Reliability } from "../../score/reliability";

export const IBNR_SCORE = 1;
export const BENERAIL_SCORE = 1;

export const RELIABILITY_IBNR_NS_INTERNATIONAL =
  Reliability.START +
  (Reliability.FIRST_PARTY +
    Reliability.BIG_DATA_SET +
    Reliability.RAW * IBNR_SCORE);

export const RELIABILITY_BENERAIL_NS_INTERNATIONAL =
  Reliability.START +
  (Reliability.FIRST_PARTY +
    Reliability.BIG_DATA_SET +
    Reliability.RAW * BENERAIL_SCORE);
