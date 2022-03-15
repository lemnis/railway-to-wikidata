import { Reliability } from "../../score/reliability";
import { CodeIssuer, Property } from "../../types/wikidata";

export const ScoreZsk = {
  [CodeIssuer.UIC]: .7,

  // Wien Meidling (foreign location) is a bit off
  [Property.CoordinateLocation]: .8,
};

export const ForeignScore = {
  [CodeIssuer.UIC]: .45,

  // Wien Meidling (foreign location) is a bit off
  [Property.CoordinateLocation]: .8,
};

export const ReliabilityZsk = {
  Slovakia: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.SMALL_DATA_SET +
        Reliability.COMPUTED * ScoreZsk[CodeIssuer.UIC])
  },
  Foreign: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.THIRD_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.COMPUTED * ScoreZsk[CodeIssuer.UIC]),
    [Property.CoordinateLocation]:
      Reliability.START +
      (Reliability.THIRD_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * ScoreZsk[Property.CoordinateLocation])
  },
};
