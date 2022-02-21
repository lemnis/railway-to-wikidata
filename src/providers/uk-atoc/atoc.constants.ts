import { Reliability } from "../../score/reliability";
import { CodeIssuer } from "../../types/wikidata";

export const ScoreAtoc = {
  [CodeIssuer.ATOC]: 1
};

export const ReliabilityAtoc = {
  UnitedKingdom: {
    [CodeIssuer.ATOC]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * ScoreAtoc[CodeIssuer.ATOC]),
  },
};
