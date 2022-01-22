import { match as matchLabel } from "./label";
import { match as matchClaims } from "./property";
import { LocationV4 } from "../types/location";

export const score = (location: LocationV4, wikidata: LocationV4) => {
  return {
    labels: matchLabel(location.labels, wikidata.labels),
    claims: matchClaims(
      location.claims,
      wikidata.claims,
      location,
      wikidata
    ),
  };
};
