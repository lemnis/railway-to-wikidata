import { score as scoreLabel } from "./label";
import { score as scoreClaims } from "./property";
import { Location } from "../types/location";
import { Property } from "../types/wikidata";
import { scoreCoordinateLocation } from "../transform/coordinateLocation";

export const SCORE_THRESHOLD = 2.3;
export const WITHOUT_LOCATION_SCORE_THRESHOLD = 1.3;

export const score = async (
  location: Location,
  wikidata: Location,
  any?: any[]
) => {
  const { info, labels: locationLabels, ...properties } = location.properties;
  const labels = scoreLabel(locationLabels, wikidata.properties.labels);
  const claims = await scoreClaims(properties, wikidata.properties);

  const coordinates = scoreCoordinateLocation(location, wikidata);
  const closestDistance = coordinates
    .map((i) => i.distance)
    ?.sort((a, b) => a! - b!);
  const distanceInPercentage =
    closestDistance[0] != undefined && closestDistance[0]! < 3000
      ? 1 - closestDistance[0]! / 3000
      : 0;

  let maxScore = 0;
  if (locationLabels.length && wikidata.properties.labels?.length) maxScore++;
  if (location.geometry.coordinates?.length) maxScore++;
  const propertiesSize = Object.values(properties)?.filter(
    (i) => i?.length
  ).length;
  const maxPropertiesScore = propertiesSize >= 5 ? 1 : propertiesSize * 0.2;
  if (
    propertiesSize &&
    Object.values(wikidata.properties)?.filter((i) => i?.length).length
  )
    maxScore = maxScore + maxPropertiesScore;

  const newPercentage =
    (1 / maxScore) *
    (labels.percentage +
      distanceInPercentage +
      maxPropertiesScore * claims.percentage);

  return {
    id: location.id,
    labels,
    claims,
    maxScore,
    debug: {
      newPercentage,
    },
    coordinates: {
      matches: coordinates,
      percentage: distanceInPercentage,
    },
    percentage: labels.percentage + claims.percentage + distanceInPercentage,
  };
};
