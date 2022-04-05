import { score as scoreLabel } from "./label";
import { score as scoreClaims } from "./property";
import { Location } from "../types/location";
import { Property } from "../types/wikidata";

export const SCORE_THRESHOLD = 2.3;
export const WITHOUT_LOCATION_SCORE_THRESHOLD = 1.3;

export const score = async (location: Location, wikidata: Location) => {
  const labels = scoreLabel(location.properties.labels, wikidata.properties.labels);
  const claims = await scoreClaims(
    location.properties,
    wikidata.properties,
  );

  const distance = claims?.matches[Property.CoordinateLocation]?.matches.map(
    (i) => i.distance < 3000 ? 1 - (i.distance / 3000) : 0
  );

  return {
    id: location.id || ':(',
    labels,
    claims,
    percentage: labels.percentage + claims.percentage + (distance?.reduce((a, b) => a + b, 0) || 0),
  };
};
