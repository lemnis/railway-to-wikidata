import { Reliability } from "../../score/reliability";
import { CodeIssuer, Property } from "../../types/wikidata";

export const POLAND_UIC_SCORE = 0.9;

export const ReliabilityPKP = {
  Poland: {
    [Property.Country]:
      Reliability.START +
      (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW),
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.COMPUTED) *
        POLAND_UIC_SCORE,
  },
};
