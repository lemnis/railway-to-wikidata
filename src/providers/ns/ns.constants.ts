import { Reliability } from "../../score/reliability";
import { CodeIssuer, Property } from "../../types/wikidata";

/** It seems that 1 location fails */
export const FOREIGN_COUNTRY_SCORE = 1;
export const FOREIGN_IBNR_SCORE = 1;
export const FOREIGN_UIC_SCORE = 0.9;

export const NETHERLANDS_FACES_SCORE = 0.5;
export const NETHERLANDS_IBNR_SCORE = 1;
export const NETHERLANDS_TRACKS_SCORE = 0.9;
export const NETHERLANDS_UIC_SCORE = 1;

export const ReliabilityNs = {
  Netherlands: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * NETHERLANDS_UIC_SCORE),
    [CodeIssuer.IBNR]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * NETHERLANDS_IBNR_SCORE),
    [Property.Country]:
      Reliability.START +
      (Reliability.FIRST_PARTY + Reliability.BIG_DATA_SET + Reliability.RAW),
    [Property.NumberOfPlatformTracks]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * NETHERLANDS_TRACKS_SCORE),
    [Property.NumberOfPlatformFaces]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.SMALL_DATA_SET +
        Reliability.RAW * NETHERLANDS_FACES_SCORE),
  },
  Foreign: {
    [CodeIssuer.UIC]:
      Reliability.START +
      (Reliability.THIRD_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * FOREIGN_UIC_SCORE),
    [CodeIssuer.IBNR]:
      Reliability.START +
      (Reliability.THIRD_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.RAW * FOREIGN_IBNR_SCORE),
    [Property.Country]:
      Reliability.START +
      (Reliability.FIRST_PARTY +
        Reliability.BIG_DATA_SET +
        Reliability.COMPUTED * FOREIGN_COUNTRY_SCORE),
  },
};
