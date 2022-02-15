import { score as scoreLabel } from "./label";
import { score as scoreClaims } from "./property";
import { LocationV4 } from "../types/location";
import { Property } from "../types/wikidata";

export const SCORE_THRESHOLD = 2.3;
export const WITHOUT_LOCATION_SCORE_THRESHOLD = 1.3;

export const score = (location: LocationV4, wikidata: LocationV4) => {
  const labels = scoreLabel(location.labels, wikidata.labels);
  const claims = scoreClaims(
    location.claims,
    wikidata.claims,
    location,
    wikidata
  );

  const distance = claims.matches[Property.CoordinateLocation].matches.map(
    (i) => i.distance < 3000 ? 1 - (i.distance / 3000) : 0
  );

  return {
    labels,
    claims,
    percentage: labels.percentage + claims.percentage + distance.reduce((a, b) => a + b, 0),
  };
};
