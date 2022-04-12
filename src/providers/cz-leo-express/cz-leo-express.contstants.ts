import { Reliability } from "../../score/reliability";

export const SCORE_UIC_CZECH = 0.9;
export const SCORE_UIC_FOREIGN = 0.6;

export const RELIABILITY_UIC_LEO_EXPRESS_CZECH =
  Reliability.START +
  (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.COMPUTED) *
    SCORE_UIC_CZECH;

export const RELIABILITY_UIC_LEO_EXPRESS_FOREIGN =
  Reliability.START +
  (Reliability.THIRD_PARTY + Reliability.BIG_DATA_SET + Reliability.COMPUTED) *
    SCORE_UIC_FOREIGN;
