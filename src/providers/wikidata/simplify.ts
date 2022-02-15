import { simplify as simplifyLabel } from "./label";
import { simplify as simplifyProperties } from "./property";
import { LocationV4 } from "../../types/location";


export const simplify = (
  response: any,
  keys: { property: string, qualifiers?: string[] }[],
  extra?: string[]
): LocationV4[] => {
  const groupedWikidataItems = (response.results.bindings as any[]).reduce<
    any[]
  >((acc, k) => {
    acc[k.item.value] = acc[k.item.value] || [];
    acc[k.item.value].push(k);
    return acc;
  }, []);

  return Object.values(groupedWikidataItems).map((items) => ({
    labels: simplifyLabel(items),
    id: items[0].item.value,
    claims: simplifyProperties(
      items,
      keys,
      extra
    ),
  }));
};
