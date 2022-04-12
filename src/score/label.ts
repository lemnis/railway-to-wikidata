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
        ? expansion.filter(
            ({ lang: destinationLang }) =>
              !destinationLang || destinationLang === lang
          )
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
      normalizeName(value),
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

    const similarity = close ?
      1 -
      distance(normalizeName(value), normalizeName(close)) /
        Math.max(normalizeName(value).length, normalizeName(close).length) : 0;

    return {
      missing: destinationLabels.length === 0,
      match: !!match,
      value,
      lang,
      origin: close,
      // distance: distance(normalizeName(value), close && normalizeName(close)),
      // length: Math.max(
      //   value && normalizeName(value).length,
      //   close && normalizeName(close).length
      // ),
      similarity: match ? 1 : similarity > 0.4 ? similarity : 0,
      destinationLabels: destinationLabels.map(({ value: b }) =>
        normalizeName(b)
      ),
      normalize: normalizeName(value),
    };
  });

  const percentage = matches.filter(
    ({ missing, similarity }) => !missing && similarity
  ).length
    ? matches
        .filter(({ missing }) => !missing)
        .reduce((acc, c) => acc + c.similarity, 0) /
      matches.filter(({ missing }) => !missing).length
    : 0;

  return { matches, percentage };
};
