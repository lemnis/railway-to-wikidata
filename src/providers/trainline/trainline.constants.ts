import { Reliability } from "../../score/reliability";
import { CodeIssuer, Property } from "../../types/wikidata";

export const GenericScore = {
  [CodeIssuer.ATOC]: 1,
  [CodeIssuer.DB]: 0.8,
  [CodeIssuer.GaresAndConnexions]: 1,
  [CodeIssuer.UIC]: 1,
  [CodeIssuer.Benerail]: 1,
  [CodeIssuer.IBNR]: 1,
  [CodeIssuer.SNCF]: 1,
  [CodeIssuer.Trainline]: 1,
}

export const ReliabilityTrainline = {
  Poland: {
    [Property.Country]:
      Reliability.START +
      (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW),
  },
};
