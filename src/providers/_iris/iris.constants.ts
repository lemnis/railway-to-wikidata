import { Reliability } from "../../score/reliability";
import { CodeIssuer } from "../../types/wikidata";

export const IBNR_SCORE = 1;
export const DB_SCORE = 1;

export const ReliabilityIris = {
  [CodeIssuer.IBNR]:
    Reliability.START +
    (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
      IBNR_SCORE,
  [CodeIssuer.DB]:
    Reliability.START +
    (Reliability.THIRD_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
      DB_SCORE,
};
