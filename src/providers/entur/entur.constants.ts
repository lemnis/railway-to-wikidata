import { Reliability } from "../../score/reliability";
import { CodeIssuer } from "../../types/wikidata";

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
