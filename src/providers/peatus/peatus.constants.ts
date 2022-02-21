import { Reliability } from "../../score/reliability";
import { Property } from "../../types/wikidata";

export const ESTONIA_UIC_SCORE = 0;

export const ReliabilityNs = {
  ESTONIA: {
    [Property.Country]:
      Reliability.START +
      (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW),
  },
};
