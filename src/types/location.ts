import { ClaimObject, CodeIssuer, Property } from "./wikidata";

export interface Label {
  value: string;
  lang?: string;
  variants?: string[];
}

export interface LocationV3 {
  labels: Label[];
  claims: Partial<Record<CodeIssuer | Property, any[]>>;
  info?: Record<string, any>;
  id?: string;
}

export interface LocationV4 {
  id?: string;
  labels: Label[];
  claims: {
    [key in Property | CodeIssuer]?: key extends Property.CoordinateLocation
      ? ClaimObject<[number, number]>[]
      : ClaimObject<string>[];
  };
  info?: {
    match?: {
      match?: any;
      wikidata?: any;
      [key: string]: any;
    }[];
    matched?: number;
    [key: string]: any;
  };
}
