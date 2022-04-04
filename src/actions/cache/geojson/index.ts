import extract from "extract-zip";
import { Feature, FeatureCollection } from "geojson";
import { LocationV4, Location } from "../../../types/location";
import { Property } from "../../../types/wikidata";

export const createGeoFeature = (location: LocationV4): Location | undefined => {
  const { claims: c, ...extra } = location;
  const { [Property.CoordinateLocation]: coordinates, ...claims } =
    c;
  const coordinate = coordinates?.[0]?.value;
  if (!coordinate || typeof coordinate[1] !== 'number' || typeof coordinate[0] !== 'number') return;

  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [coordinate![1], coordinate![0]] },
    properties: { ...claims, ...extra },
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
