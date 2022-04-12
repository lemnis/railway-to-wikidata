import { Reliability } from "../../score/reliability";
import { CodeIssuer, Property } from "../../types/wikidata";

export const Score = {
  [CodeIssuer.ATOC]: 1,
  [CodeIssuer.DB]: 0.8,
  [CodeIssuer.GaresAndConnexions]: 1,
  [CodeIssuer.UIC]: 0.9,
  [CodeIssuer.Benerail]: 1,
  [CodeIssuer.IBNR]: 1,
  [CodeIssuer.SNCF]: 1,
  [CodeIssuer.Trainline]: 0.9,
};

export const ReliabilityTrainline = {
  [CodeIssuer.ATOC]:
    Reliability.START +
    (Reliability.THIRD_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
      Score[CodeIssuer.ATOC],
  [CodeIssuer.DB]:
    Reliability.START +
    (Reliability.THIRD_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
      Score[CodeIssuer.DB],
  [CodeIssuer.GaresAndConnexions]:
    Reliability.START +
    (Reliability.THIRD_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
      Score[CodeIssuer.GaresAndConnexions],
  [CodeIssuer.UIC]:
    Reliability.START +
    (Reliability.THIRD_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
      Score[CodeIssuer.UIC],
  [CodeIssuer.Benerail]:
    Reliability.START +
    (Reliability.THIRD_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
      Score[CodeIssuer.Benerail],
  [CodeIssuer.IBNR]:
    Reliability.START +
    (Reliability.THIRD_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
      Score[CodeIssuer.IBNR],
  [CodeIssuer.SNCF]:
    Reliability.START +
    (Reliability.THIRD_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
      Score[CodeIssuer.SNCF],
  [CodeIssuer.Trainline]:
    Reliability.START +
    (Reliability.THIRD_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW) *
      Score[CodeIssuer.Trainline],
};
