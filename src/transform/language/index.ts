export interface LanguageInfo {
  1: string;
}

type EnforceObjectType<T> = <V extends T>(v: V) => V;
const enforceObjectType: EnforceObjectType<Record<string, LanguageInfo>> = (
  v
) => v;

export const Language = enforceObjectType({
  Albanian: {
    1: "sq",
  },
  Armenian: {
    1: "hy",
  },
  Azerbaijani: {
    1: "az",
  },
  Bulgarian: {
    1: "bg",
  },
  Croatian: {
    1: "hr",
  },
  Czech: {
    1: "cs",
  },
  Danish: {
    1: "da",
  },
  Estonian: {
    1: "et",
  },
  Finnish: {
    1: "fi",
  },
  French: {
    1: "fr",
  },
  Georgia: {
    1: "ka",
  },
  German: {
    1: "de",
  },
  Greek: {
    1: "el",
  },
  Hungary: {
    1: "hu",
  },
  Irish: {
    1: "ie",
  },
  Italian: {
    1: "it",
  },
  Latvian: {
    1: "lv",
  },
  Lithuanian: {
    1: "lt",
  },
  Luxembourgish: {
    1: "lb",
  },
  Dutch: {
    1: "nl",
  },
  Macedonian: {
    1: "mk",
  },
  Norway: {
    1: "no",
  },
  Polish: {
    1: "pl",
  },
  Portugal: {
    1: "pt",
  },
  Romanian: {
    1: "ro",
  },
  Russian: {
    1: "ru",
  },
  Serbian: {
    1: "sn",
  },
  Slovak: {
    1: "sk",
  },
  Slovenian: {
    1: "sl",
  },
  Spanish: {
    1: "es",
  },
  Swedish: {
    1: "sv",
  },
  Turkish: {
    1: "tr",
  },
  Ukrainian: {
    1: "uk",
  },
  English: {
    1: "en",
  },
});
