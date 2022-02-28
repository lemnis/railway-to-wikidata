import { Reliability } from "../../score/reliability";
import { CodeIssuer } from "../../types/wikidata";

export const ScoreCp = {
  [CodeIssuer.UIC]: 1,
};

export const ReliabilityCp = {
  Portugal: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * ScoreCp[CodeIssuer.UIC])
  },
};
