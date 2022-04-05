import { simplify as simplifyLabel } from "./label";
import { simplify as simplifyProperties } from "./property";
import { simplify as simplifyCoordinates } from "./coordinates";
import { Location } from "../../types/location";
import { removeUri } from "./clean-up";
import { Property } from "../../types/wikidata";

export const simplify = (
  response: any,
  keys: { property: string; qualifiers?: string[] }[],
  extra?: string[]
): Location[] => {
  const groupedWikidataItems = (response.results.bindings as any[]).reduce<
    any[]
  >((acc, k) => {
    acc[k.item.value] = acc[k.item.value] || [];
    acc[k.item.value].push(k);
    return acc;
  }, []);

  return Object.values(groupedWikidataItems).map((items: any[]) => ({
    type: "Feature",
    id: removeUri(items[0].item.value),
    geometry: {
      type: "MultiPoint",
      coordinates: simplifyCoordinates(
        items.map((i) => i[Property.CoordinateLocation]).filter(Boolean)
      ),
    },
    properties: {
      labels: simplifyLabel(items),
      ...simplifyProperties(items, keys, extra),
    },
  }));
};

export const simplifyByKeyValue = (
  response: any,
  keys: { property: string; qualifiers?: string[] }[],
  extra?: string[]
) => {
  const groupedWikidataItems = (response.results.bindings as any[]).reduce<
    any[]
  >((acc, k) => {
    acc[k.item.value] = acc[k.item.value] || [];
    acc[k.item.value].push({
      item: k.item,
      ...(k.value ? { [removeUri(k.key.value)]: k.value } : {}),
    });
    return acc;
  }, []);

  return Object.values(groupedWikidataItems).map<Location>((items: any[]) => ({
    type: "Feature",
    id: removeUri(items[0].item?.value),
    geometry: {
      type: "MultiPoint",
      coordinates: simplifyCoordinates(
        items.map((i) => i[Property.CoordinateLocation]).filter(Boolean)
      ),
    },
    properties: {
      labels: simplifyLabel(items),
      [Property.Wikidata]: [{ value: removeUri(items[0].item?.value) }],
      ...simplifyProperties(items, keys, extra),
    },
  }));
};
