import { Label } from "../types/location";

const { remove: removeAccents } = require("diacritics");

/** Remove accents (diacrítics), dashes and removes duplicates spaces */
const normalizeName = (name: string) =>
  removeAccents(name)
    .toLowerCase()
    .replace(/[-—–]/g, " ")
    .replace(/[’]/g, "'")
    .replace(/ +/g, " ");

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
