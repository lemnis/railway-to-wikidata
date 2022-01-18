import { match as matchLabel } from "./label";
import { match as matchClaims } from "./property";
import { LocationV3 } from "../types/location";

export const match = (location: LocationV3, wikidata: LocationV3) => {
  return {
    labels: matchLabel(location.labels, wikidata.labels),
    claims: matchClaims(location.claims, wikidata.claims, location, wikidata),
  };
};
