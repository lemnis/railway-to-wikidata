export const editLabel = (
  matches: {
    missing: boolean;
    match: boolean;
    value: string;
    lang: string | undefined;
  }[]
) => {
  const result: Record<string, string[]> = {};

  matches
    .filter(({ match }) => !match)
    .forEach(({ lang, value }) => {
      if (!lang) {
        // TODO: Add logging and guessing of likely language
        return;
      }

      result[lang] ||= [];
      result[lang].push(value);
    });

  return result;
};
