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

export const NORWAY_UIC_SCORE = 0.9;
export const FOREIGN_UIC_SCORE = 0;

export const ReliabilityEntur = {
  Norway: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * NORWAY_UIC_SCORE),
  },
  Foreign: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.THIRD_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * FOREIGN_UIC_SCORE),
  },
};
