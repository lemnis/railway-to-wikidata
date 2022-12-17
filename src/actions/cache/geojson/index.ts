import { featureCollection, Feature, FeatureCollection } from "@turf/turf";

export const createFeatureCollection = (
  features: Feature[]
): FeatureCollection =>
  featureCollection(
    features.sort((a: any, b: any) =>
      a.id?.toString()?.localeCompare?.(b.id?.toString())
    )
  );
