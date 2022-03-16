import { ClaimObject, CodeIssuer, Property } from "./wikidata";
import { score } from "../score";
import { Feature, Point, MultiPoint } from "geojson";

export interface Label {
  value: string;
  lang?: string;
  variants?: string[];
}

interface Basic {
  id: string;
  labels: Label[];
  info?: {
    match?: {
      matched?: ReturnType<typeof score>;
      wikidata?: any;
      [key: string]: any;
    }[];
    matched?: number;
  };
}

export interface LocationV4 extends Basic {
  claims: {
    [key in Property | CodeIssuer]?: key extends Property.CoordinateLocation
      ? ClaimObject<[number, number]>[]
      : ClaimObject<string>[];
  };
}

export type Location = Feature<
  Point | MultiPoint,
  Basic &  {
    [key in Property | CodeIssuer]?: key extends keyof Basic
      ? Basic[key]
      : ClaimObject<string>[];
  }
>;
