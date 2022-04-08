import { Label } from "../types/location";
import { distance, closest } from "fastest-levenshtein";

const { remove: removeAccents, diacriticsMap } = require("diacritics");

// Transform german characters
Object.assign(diacriticsMap, {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss",
  Ä: "AE",
  Ö: "OE",
  Ü: "UE",
  å: "aa",
  Å: "AA",
  ø: "oe",
  Ø: "OE",
});

const TransformMap = {
  de: new Map([
    [/ hbf$/, " hauptbahnhof"],
    [/ bf$/, " bahnhof"],
    [/ hauptbahnhof$/, " hbf"],
    [/ bahnhof$/, " bf"],
  ]),
  nl: new Map([
    [/ hbf$/, " hauptbahnhof"],
    [/ hbf$/, " centraal"],
    [/ bf$/, " bahnhof"],
    [/ hauptbahnhof$/, " hbf"],
    [/ bahnhof$/, " bf"],
    [/ a\/d /, "  aan den "],
    [/ a\/d /, " a. d. "],
    [/'([a-z])/, "$1"],
  ]),
};

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
    let match = destinationLabels.find(({ value: destinationLabel }) =>
      normalizeName(destinationLabel).includes(normalizeName(value))
    );
    const close = closest(
      value,
      destinationLabels.map(({ value }) => normalizeName(value))
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
      similarity: match ? 1 : distance(value, close) < value.length ? distance(value, close) / value.length : 0,
      // destinationLabels: destinationLabels.map(({ value: b }) =>
      //   normalizeName(b)
      // ),
      // normalize: normalizeName(value),
    };
  });

  const percentage = matches.filter(({ missing, match }) => !missing && match)
    .length
    ? matches.filter(({ missing }) => !missing).length /
      matches
        .filter(({ missing }) => !missing)
        .reduce((acc, c) => acc + c.similarity, 0)
    : 0;

  return { matches, percentage };
};
