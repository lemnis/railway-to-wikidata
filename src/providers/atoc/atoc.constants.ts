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

export const UnitedKingdomScore = {
  [CodeIssuer.ATOC]: 1
};

export const ReliabilityDigitraffic = {
  UnitedKingdom: {
    [CodeIssuer.ATOC]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * UnitedKingdomScore[CodeIssuer.ATOC]),
  },
};
