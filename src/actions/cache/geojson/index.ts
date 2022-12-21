import { featureCollection, Feature, FeatureCollection } from "@turf/turf";
import { Location } from "../../../types/location";

export const createFeatureCollection = (
  features: Location[]
): FeatureCollection => {
  // Sort labels
  features.forEach((item) => {
    if (!item.properties?.labels) return;

    item.properties.labels = item.properties?.labels.sort((a, b) => {
      return (
        a.value?.localeCompare?.(b.value) ||
        (b.lang && a.lang?.localeCompare?.(b.lang)) ||
        0
      );
    });
  });

  return featureCollection(
    features.sort((a: any, b: any) =>
      a.id?.toString()?.localeCompare?.(b.id?.toString())
    )
  );
};
