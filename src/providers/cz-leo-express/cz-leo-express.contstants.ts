import { Reliability } from "../../score/reliability";
import { CodeIssuer, Property } from "../../types/wikidata";

export const ScoreLeoExpress = {
  [CodeIssuer.UIC]: .9,
};

export const ScoreForeign = {
  [CodeIssuer.UIC]: .6
};

export const ReliabilityLeoExpress = {
  Slovakia: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.COMPUTED * ScoreLeoExpress[CodeIssuer.UIC])
  },
  Foreign: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.THIRD_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.COMPUTED * ScoreForeign[CodeIssuer.UIC]),
  },
};
