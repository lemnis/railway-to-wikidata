import { Reliability } from "../../score/reliability";
import { CodeIssuer } from "../../types/wikidata";

export const IBNR_SCORE = 1;

export const ReliabilityOebb = {
  Austria: {
    [CodeIssuer.IBNR]:
      Reliability.START +
      (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
        IBNR_SCORE,
  },
  Foreign: {
    [CodeIssuer.IBNR]:
      Reliability.START +
      (Reliability.THIRD_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
        IBNR_SCORE,
  },
};
