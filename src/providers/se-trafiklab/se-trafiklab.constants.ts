import { Reliability } from "../../score/reliability";
import { CodeIssuer } from "../../types/wikidata";

export const ScoreTrafiklab = {
  [CodeIssuer.UIC]: 0,
};

export const ScoreForeignTrafikLab = {
  [CodeIssuer.UIC]: 0.2,
};

export const ReliabilityTrafiklab = {
  Sweden: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * ScoreTrafiklab[CodeIssuer.UIC]),
  },
  Foreign: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.THIRD_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * ScoreForeignTrafikLab[CodeIssuer.UIC]),
  },
};
