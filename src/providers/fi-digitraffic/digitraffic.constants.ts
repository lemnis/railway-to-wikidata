import { Reliability } from "../../score/reliability";
import { CodeIssuer, Property } from "../../types/wikidata";

export const FinlandScore = {
  [CodeIssuer.UIC]: 1,
  [Property.StationCode]: 1,
}

export const ForeignScore = {
  [CodeIssuer.UIC]: 0
}

export const ReliabilityDigitraffic = {
  Finland: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * FinlandScore[CodeIssuer.UIC]),
    [Property.StationCode]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * FinlandScore[Property.StationCode]),
  },
  Foreign: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.THIRD_PARTY +
        Reliability.SMALL_DATA_SET +
        Reliability.RAW * ForeignScore[CodeIssuer.UIC]),
  },
};
