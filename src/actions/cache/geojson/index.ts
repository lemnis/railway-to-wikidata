import { featureCollection, Feature, FeatureCollection } from "@turf/turf";
import { Location, Claims } from "../../../types/location";

export const createFeatureCollection = (
  features: Location[]
): FeatureCollection => {
  // Sort properties
  features.forEach((item) => {
    Object.keys(item.properties).forEach((k: any) => {
      const key: keyof Claims | "labels" = k;
      item.properties[key] = item.properties[key]!.sort((a, b) => {
        return (
          (b.value && a.value?.localeCompare?.(b.value)) ||
          (typeof b.lang === "string" &&
            typeof a.lang === "string" &&
            a.lang?.localeCompare?.(b.lang)) ||
          0
        );
      }) as any;
    });
  });

  return featureCollection(
    features.sort((a: any, b: any) =>
      a.id?.toString()?.localeCompare?.(b.id?.toString())
    )
  );
};
