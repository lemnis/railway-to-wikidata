export enum Service {
  /** Call any generator API.
   * Use "generator" parameter to specify,
   * and specific generator parameters to further amend the search.  */
  Generator = "Generator",
  /** Get a list of categories on the page.  */
  Categories = "Categories",
  /** Full-text search in wiki. */
  Search = "Search",
  /** Wikibase entity search, by title.  */
  EntittySearch = "EntitySearch",
}

type Input = {
  [Service.Generator]: {
    generator: string;
    prop?: string;
    pprop?: string;
    [key: string]: any;
  };
  [Service.Categories]: {
    titles: string;
    cllimit?: string;
  };
  [Service.Search]: {
    srsearch: string;
    srwhat?: string;
    srlimit?: number;
  };
  [Service.EntittySearch]: {
    search: string;
    language?: string;
    type?: string;
    limit?: number;
  };
};

const Id = {
  [Service.Generator]: "mwapi:title",
  [Service.Categories]: "mwapi:title",
  [Service.Search]: "mwapi:title",
  [Service.EntittySearch]: "mwapi:item",
};

/**
 * @see https://www.mediawiki.org/wiki/Wikidata_Query_Service/User_Manual/MWAPI
 */
export const mwapi = <T extends Service>(
  service: T,
  input: Input[T],
  output: [string, string, string][] = [["?item", "apiOutput", Id[service]]]
) => {
  return `SERVICE wikibase:mwapi {
    bd:serviceParam wikibase:endpoint "www.wikidata.org";
                    wikibase:api "${service}";
                    ${Object.entries(input)
                      .map(([key, value]) => `mwapi:${key} "${value}"`)
                      .join(";")}.
    ${output.map((a) => `${a[0]} wikibase:${a[1]} ${a[2]}`).join(".")}
  }`;
};

export const search = (name: string, language: string, instanceOf: string) => `
  ${mwapi(Service.EntittySearch, { search: name, language }, [
    ["?item", "apiOutputItem", "mwapi:item"],
    ["?order", "apiOrdinal", "true"],
  ])}
  ?item (wdt:P31/(wdt:P279*)) wd:${instanceOf}.
`;
