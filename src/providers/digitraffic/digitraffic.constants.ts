import { CodeIssuer, Property } from "../../types/wikidata";

enum Reliability {
  START = 0.1,
  THIRD_PARTY = 0.1,
  FIRST_PARTY = 0.2,
  COMPUTED = 0.1,
  RAW = 0.2,
  SMALL_DATA_SET = 0.1,
  BIG_DATA_SET = 0.3,
}

export const LARGE_DATA_SIZE = 20;

export const FinlandScore = {
  [CodeIssuer.UIC]: 1,
  [Property.StationCode]: 1,
}

export const ForeignScore = {
  [CodeIssuer.UIC]: .1
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
