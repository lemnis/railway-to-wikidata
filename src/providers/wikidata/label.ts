import { Label } from "../../types/location";
import { ClaimObject } from "../../types/wikidata";

export const labelKeys = ["label", "alias"];

export const labelQuery = `
  OPTIONAL { ?item rdfs:label ?label. }
  OPTIONAL { ?item skos:altLabel ?alias; }
`;

export const simplify = (
  itemList: {
    label?: ClaimObject<string>;
    alias?: ClaimObject<string>;
    itemLabel?: ClaimObject<string>;
    altLabel?: ClaimObject<string>;
  }[]
) => {
  return itemList
    .reduce<Label[]>((acc, { label, alias, itemLabel, altLabel }) => {
      [label, alias, itemLabel, altLabel]
        .filter((x): x is ClaimObject<string> => !!x)
        .forEach(({ value, "xml:lang": lang }) => {
          if (value && !acc.some((a) => a.lang === lang && a.value === value)) {
            acc.push({
              lang,
              value,
            });
          }
        });
      return acc;
    }, [])
    .flat();
};
