import { Feature, FeatureCollection } from "geojson";
import { LocationV4 } from "../../types/location";
import { Property } from "../../types/wikidata";

// MultiPoint
// LineString
// MultiLineString
// Polygon
// MultiPolygon

export const createGeoFeature = (location: LocationV4): Feature | undefined => {
  const { [Property.CoordinateLocation]: coordinates, ...claims } =
    location.claims;
  const coordinate = coordinates?.[0]?.value;
  if (!coordinate) return;

  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [coordinate![1], coordinate![0]] },
    properties: { ...claims, labels: location.labels },
  };
};

export const createFeatureCollection = (
  features: Feature[]
): FeatureCollection => {
  return {
    type: "FeatureCollection",
    features,
  };
};
