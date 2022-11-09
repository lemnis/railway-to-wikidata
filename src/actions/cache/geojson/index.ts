import { Feature, FeatureCollection } from "geojson";

export const createFeatureCollection = (
  features: Feature[]
): FeatureCollection => {
  return {
    type: "FeatureCollection",
    features: features.sort((a: any, b: any) => {
      const aId = a.id?.toString();
      const bId = b.id?.toString();
      return aId?.localeCompare?.(bId)
    })
  };
};
