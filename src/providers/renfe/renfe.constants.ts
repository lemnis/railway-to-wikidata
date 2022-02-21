import { Reliability } from "../../score/reliability";
import { CodeIssuer, Property } from "../../types/wikidata";

export const ScoreRenfe = {
  [CodeIssuer.UIC]: 0,
  [Property.StationCode]: 1,
}

export const ReliabilityRenfe = {
  Spain: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.COMPUTED * ScoreRenfe[CodeIssuer.UIC]),
    [Property.StationCode]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * ScoreRenfe[Property.StationCode]),
  },

  Foreign: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.THIRD_PARTY +
        Reliability.SMALL_DATA_SET +
        Reliability.COMPUTED * ScoreRenfe[CodeIssuer.UIC]),
    [Property.StationCode]:
      Reliability.START +
      (Reliability.THIRD_PARTY +
        Reliability.SMALL_DATA_SET +
        Reliability.RAW * ScoreRenfe[Property.StationCode]),
  },
};
