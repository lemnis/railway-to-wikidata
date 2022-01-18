const { remove: removeAccents } = require("diacritics");

interface Label {
  value: string;
  lang?: string;
  variants?: string[];
}

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

export const simplify = (itemList: { label?: any; alias?: any }[]) => {
  return itemList
    .reduce<Label[]>((acc, { label, alias }) => {
      [label, alias].filter(Boolean).forEach((value) => {
        const lang = value["xml:lang"];
        if (!acc.some((a) => a.lang !== lang && a.value === value)) {
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


export const match = (source: Label[], destination: Label[]) => {
  const mapVariants = (label: Label) => [
    label,
    ...(label.variants || []).map((value) => ({ value, lang: label.lang })),
  ];

  const matches = source.map((name) => {
    const destinationLabels =
      (name.lang
        ? destination.filter(({ lang }) => !lang || lang === name.lang)
        : destination
      )
        ?.map(mapVariants)
        .flat() || [];
    let match = destinationLabels.find(({ value }) =>
      normalizeName(value).includes(normalizeName(name.value))
    );
    if (!match && name.variants) {
      for (const variant of name.variants) {
        match = destinationLabels.find(({ value }) =>
          normalizeName(value).includes(normalizeName(variant))
        );
        if (match) break;
      }
    }
    return {
      missing: destinationLabels.length === 0,
      match: !!match,
      value: name.value,
      lang: name.lang || match?.lang,
    };
  });

  const percentage = matches.filter(({ missing }) => !missing).length
    ? matches.filter(({ match }) => match).length /
      matches.filter(({ missing }) => !missing).length
    : 0;

  return { matches, percentage };
};
