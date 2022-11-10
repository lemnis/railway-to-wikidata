import { Label } from "../types/location";
import { compare } from "station-name-diff";

const compareToLabelArray = ({ value, lang }: Label, list: Label[]) => {
  const destinationLabels =
    (lang
      ? list.filter(({ lang: bLang }) => !bLang || bLang === lang)
      : list) || [];
  let [{ score: similarity }] = destinationLabels
    .map(
      ({ value: b }) =>
        [compare({ name: value }, { name: b }), b] as [
          { score: number },
          string
        ]
    )
    .sort((a, b) => b[0].score - a[0].score)?.[0] || [{}];

  return {
    missing: destinationLabels.length === 0,
    match: similarity > 0,
    value,
    lang,
    similarity,
  };
};

export const score = (aList: Label[], bList: Label[]) => {
  const matches = aList.map((aItem) => compareToLabelArray(aItem, bList));
  const percentage = matches.filter(
    ({ missing, similarity }) => !missing && similarity
  ).length
    ? matches
        .filter(({ missing }) => !missing)
        .reduce((total, { similarity }) => total + similarity, 0) /
      matches.filter(({ missing }) => !missing).length
    : 0;

  return { matches, percentage };
};
