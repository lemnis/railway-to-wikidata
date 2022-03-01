import { Reliability } from "../../score/reliability";
import { CodeIssuer, Property } from "../../types/wikidata";

export const HungaryScore = {
  [CodeIssuer.UIC]: 1,
}

export const ReliabilityDigitraffic = {
  Finland: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * HungaryScore[CodeIssuer.UIC]),
  }
};
