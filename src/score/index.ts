import { score as scoreLabel } from "./label";
import { score as scoreClaims } from "./property";
import { Location } from "../types/location";
import { Property } from "../types/wikidata";
import { Position } from "geojson";
import { scoreCoordinateLocation } from "../transform/coordinateLocation";

export const SCORE_THRESHOLD = 2.3;
export const WITHOUT_LOCATION_SCORE_THRESHOLD = 1.3;

const isMultiPoint = (
  position: Position[] | Position
): position is Position[] => {
  return Array.isArray(position[0]);
};

export const score = async (location: Location, wikidata: Location) => {
  const { id, info, labels: locationLabels, ...properties } = location.properties;
  const labels = scoreLabel(
    locationLabels,
    wikidata.properties.labels
  );
  const claims = await scoreClaims(properties, wikidata.properties);

  const coordinates = scoreCoordinateLocation(
    (isMultiPoint(location.geometry.coordinates)
      ? location.geometry.coordinates
      : [location.geometry.coordinates]
    ).map((value) => ({ value: value as any })),

    (isMultiPoint(wikidata.geometry.coordinates)
      ? wikidata.geometry.coordinates
      : [wikidata.geometry.coordinates]
    ).map((value) => ({ value: value as any }))
  );
  const closestDistance = coordinates
    .map((i) => i.distance)
    ?.sort((a, b) => a! - b!);
  const distanceInPercentage =
    closestDistance[0] && closestDistance[0]! < 3000
      ? 1 - closestDistance[0]! / 3000
      : 0;
  return {
    id: location.id || ":(",
    labels,
    claims,
    coordinates: {
      matches: coordinates,
      percentage: distanceInPercentage,
    },
    percentage: labels.percentage + claims.percentage + distanceInPercentage,
  };
};
