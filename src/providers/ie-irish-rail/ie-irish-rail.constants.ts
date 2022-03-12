import { Reliability } from "../../score/reliability";
import { Property } from "../../types/wikidata";

export const IrelandScore = {
  [Property.StationCode]: 1,
}

export const ReliabilityDigitraffic = {
  Ireland: {
    [Property.StationCode]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * IrelandScore[Property.StationCode]),
  }
};
