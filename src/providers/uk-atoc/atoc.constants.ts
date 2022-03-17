import { Reliability } from "../../score/reliability";
import { CodeIssuer } from "../../types/wikidata";

export const SCORE_ATOC = 1;

export const ReliabilityAtoc = {
  UnitedKingdom: {
    [CodeIssuer.ATOC]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * SCORE_ATOC),
  },
};
