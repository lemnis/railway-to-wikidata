import { ClaimObject, CodeIssuer, Property } from "./wikidata";
import { score } from "../score";
import { Feature, Point, MultiPoint } from "@turf/turf";

export interface Label {
  value: string;
  lang?: string;
  info?: {
    variant: boolean,
    [key: string]: any
  }
}

interface Basic {
  labels: Label[];
  info?: {
    enabled?: boolean,
    match?: {
      matched?: ReturnType<typeof score>;
      wikidata?: any;
      [key: string]: any;
    }[];
    matched?: number;
    /** When merged, contains original info object */
    pregrouped?: Basic["info"][];
    /** Accumalated reliability score of all merged sources */
    reliability?: number;
    [key: string]: any;
  };
}

export type Claims = {
  [key in Property | CodeIssuer]?: ClaimObject<string>[];
};

export type Location = Feature<Point | MultiPoint, Basic & Claims>;
