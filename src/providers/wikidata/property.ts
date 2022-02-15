import { removeUri, simplifyByDatatype } from "./clean-up";
import { ClaimObject } from "../../types/wikidata";

export const querySingleProperty = (
  property: string,
  qualifiers?: string[]
) => `?item p:${property} ?${property}Id. ?${property}Id ps:${property} ?${property}
${
  qualifiers
    ? qualifiers.map((q) => `?${property}Id pq:${q} ${property}Qualifiers${q}`)
    : ""
}`;

export const query = (
  properties: { property: string; qualifiers?: string[] }[]
): [string[], string] => [
  properties.map(({ property }) => property).flat(),
  properties
    .map(
      ({ property, qualifiers }) =>
        `OPTIONAL { ${querySingleProperty(property, qualifiers)} }\r\n`
    )
    .join(" "),
];

const simplifyValue = (value: string, type: string, datatype: string) =>
  type === "uri"
    ? removeUri(value)!
    : datatype!
    ? simplifyByDatatype(datatype, value)
    : value!;

export const simplify = (
  itemList: { [key: string]: { value: string; [key: string]: any } }[],
  properties: { property: string; qualifiers?: string[] }[],
  extra: string[] = []
) => {
  const result = itemList.reduce<Record<string, Map<string, ClaimObject>>>(
    (claimObject, item, i) => {
      properties.forEach(({ property: key, qualifiers }) => {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          claimObject[key] = claimObject[key] || new Map();

          const { value, type, datatype } = item[key];

          const claim: ClaimObject = {
            value: simplifyValue(value, type, datatype) as string,
            ...(`${key}Id` in item ? { id: item[`${key}Id`].value } : {}),
            ...(item[`${key}Label`]
              ? { label: item[`${key}Label`]?.value }
              : {}),
          };

          if (qualifiers) {
            claim.qualifiers = qualifiers.reduce<
              Record<string, { value: any; id?: string }[]>
            >((qualifierObject, qualifierKey) => {
              const computedKey = `${key}Qualifier${
                qualifierKey.slice(0, 1).toUpperCase() + qualifierKey.slice(1)
              }`;

              if (Object.prototype.hasOwnProperty.call(item, computedKey)) {
                qualifierObject[qualifierKey] ||= [];
                qualifierObject[qualifierKey].push({
                  value: item[computedKey].value,
                  ...(`${computedKey}Id` in item
                    ? { id: item[`${computedKey}Id`]?.value }
                    : {}),
                  ...(`${computedKey}Label` in item
                    ? { label: item[`${computedKey}Label`]?.value }
                    : {}),
                });
              }

              return qualifierObject;
            }, {});
          }

          const id = item[`${key}Id`]?.value || key + item[key].value;
          claimObject[key].set(id, claim);
        }
      });
      extra.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          claimObject[key] = claimObject[key] || new Set();
          (claimObject[key] as any).add(item[key].value);
        }
      });
      return claimObject;
    },
    {}
  );

  const r: Record<string, ClaimObject[]> = {};
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      r[key] = extra.includes(key)
        ? (Array.from(result[key].values()).map((value) => ({ value })) as any)
        : Array.from(result[key].values());
    }
  }

  return r;
};
