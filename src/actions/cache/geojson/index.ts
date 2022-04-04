import { Feature, FeatureCollection } from "geojson";

export const createFeatureCollection = (
  features: Feature[]
): FeatureCollection => {
  return {
    type: "FeatureCollection",
    features,
  };
};
