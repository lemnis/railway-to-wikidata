import { score as scoreLabel } from "./label";
import { score as scoreClaims } from "./property";
import { LocationV4 } from "../types/location";

export const score = (location: LocationV4, wikidata: LocationV4) => {
  return {
    labels: scoreLabel(location.labels, wikidata.labels),
    claims: scoreClaims(
      location.claims,
      wikidata.claims,
      location,
      wikidata
    ),
  };
};
