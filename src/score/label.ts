import { Label } from "../types/location";
import { ClaimObject } from "../types/wikidata";

const { remove: removeAccents } = require("diacritics");

/** Remove accents (diacrítics), dashes and removes duplicates spaces */
const normalizeName = (name: string) =>
  removeAccents(name)
    .toLowerCase()
    .replace(/[-—–]/g, " ")
    .replace(/[’]/g, "'")
    .replace(/ +/g, " ");

export const query = (): [string[], string] => [
  ["label", "alias"],
  `
  OPTIONAL { ?item rdfs:label ?label. }
  OPTIONAL { ?item skos:altLabel ?alias; }
`,
];

export const simplify = (
  itemList: { label?: ClaimObject<string>; alias?: ClaimObject<string> }[]
) => {
  return itemList
    .reduce<Label[]>((acc, { label, alias }) => {
      [label, alias]
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

export const score = (base: Label[], expansion: Label[]) => {
  const matches = base.map(({ value, lang, variants }) => {
    const destinationLabels =
      (lang
        ? expansion.filter(({ lang }) => !lang || lang === lang)
        : expansion
      )
        ?.map((label) => [
          label,
          ...(label.variants || []).map((value) => ({
            value,
            lang: label.lang,
          })),
        ])
        .flat() || [];
    let match = destinationLabels.find(({ value }) =>
      normalizeName(value).includes(normalizeName(value))
    );
    if (!match && variants) {
      for (const variant of variants) {
        match = destinationLabels.find(({ value }) =>
          normalizeName(value).includes(normalizeName(variant))
        );
        if (match) break;
      }
    }
    return {
      missing: destinationLabels.length === 0,
      match: !!match,
      value,
      lang,
    };
  });

  const percentage = matches.filter(({ missing }) => !missing).length
    ? matches.filter(({ match }) => match).length /
      matches.filter(({ missing }) => !missing).length
    : 0;

  return { matches, percentage };
};
