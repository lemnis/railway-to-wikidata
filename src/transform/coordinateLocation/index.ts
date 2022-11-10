import {
  explode,
  nearestPoint,
  AllGeoJSON,
} from "@turf/turf";

export const scoreCoordinateLocation = (
  a: AllGeoJSON,
  b: AllGeoJSON,
  { maxDistance = 3000 }: { maxDistance?: number } = {}
) =>{
  const destination = explode(b);

  return explode(a).features.map((value) => {
    if (destination.features.length === 0) {
      return {
        value: value.geometry.coordinates,
        match: false,
        missing: true,
      };
    }

    const distance =
      nearestPoint(value, explode(destination))?.properties?.distanceToPoint *
      1000;

    return {
      distance,
      value: value.geometry.coordinates,
      match: distance < maxDistance,
      missing: false,
    };
  });
}