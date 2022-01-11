import { CodeIssuer, Country, Property } from "./wikidata";

export type Location = {
  stationCode?: string;
  uic?: number;
  names: string[];
  latitude?: number;
  longitude?: number;
  country?: Country;
  language?: string;
} & {
  [key in Property]?: string;
};

export type LocationV2 = {
  labels: { value: string; lang?: string; variants?: string[] }[];
} & Partial<Record<CodeIssuer | Property, any[]>>;

export interface LocationV3 {
  labels: { value: string; lang?: string; variants?: string[] }[];
  claims: Partial<Record<CodeIssuer | Property, any[]>>;
  info?: Record<string, any>;
}

export interface LocationV4 {
  labels: { value: string; lang?: string; variants?: string[] }[];
  claims: {
    [key in Property | CodeIssuer]?: key extends Property.CoordinateLocation
      ? { value: [number, number] }[]
      : { value: string[] };
  };
  info?: {
    matched: {
      match: any;
      wikidat: any;
    }[];
    [key: string]: any;
  };
}
