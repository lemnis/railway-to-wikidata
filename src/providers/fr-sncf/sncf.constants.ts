import { Reliability } from "../../score/reliability";
import { CodeIssuer, Property } from "../../types/wikidata";

export const ScoreSncf = {
  [CodeIssuer.UIC]: 1,
  [Property.PostalCode]: 1,
}

export const ReliabilitySncf = {
  France: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * ScoreSncf[CodeIssuer.UIC]),
    [Property.PostalCode]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * ScoreSncf[Property.PostalCode]),
  },
};
