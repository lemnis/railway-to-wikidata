import fetch from "node-fetch";
import { CodeIssuer, Property } from "../../types/wikidata";
import { LocationV4 } from "../../types/location";
import { logger } from "../../utils/logger";
import { simplify } from "./simplify";

class ServerError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public query?: string
  ) {
    super(message);
  }
}

export const buildWhere = (
  values: (string | number)[],
  property: CodeIssuer | Property,
  where: string
) => {
  return `{
      VALUES ?${property} { ${values.map((i) => `'${i}'`).join(" ")} }
      ${where}
    }`;
};

export const buildQuery = (
  values: string[],
  property: CodeIssuer | Property,
  keys: string[],
  where: string
) => {
  return `SELECT ?item ${[property, ...keys]
    .map((key) => `?${key} ?${key}Id`)
    .join(" ")} WHERE ${buildWhere(values, property, where)}`;
};

export const run = async (query: string) => {
  const response = await fetch("https://query.wikidata.org/sparql", {
    headers: {
      Accept: "application/sparql-results+json",
      "content-type": "application/sparql-query",
    },
    body: query,
    method: "POST",
  });
  logger.trace(query);
  if (response.ok) {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(error as any);
    }
  } else {
    throw new ServerError(
      "SPARQL Failed",
      response.status,
      response.statusText,
      logger.level === "debug" ? query : undefined
    );
  }
};

export const getBy = async (
  property: CodeIssuer | Property,
  codes: any[],
  label: string[],
  properties: string[],
  where: string
) => {
  const query = buildQuery(
    codes.filter(Boolean),
    property,
    [...label, ...properties],
    where
  );

  return simplify(await run(query), [property, ...properties].map((property) => ({ property })));
};

export const exactMatch = async (
  values: {
    [key in Property | CodeIssuer]?: key extends Property.StationCode
      ? { codes: string[]; country: string }[]
      : (number | string)[];
  },
  label: string[],
  properties: string[],
  query: string
) => {
  const innerSubQuery: string[] = (Object.keys(values) as any)
    .map((code: Property | CodeIssuer) => {
      if (code === Property.StationCode) {
        const searchFor = `?${Property.StationCode}Search`;
        const allStationCodes = `?${Property.StationCode}`;
        // const country = `?${Property.Country}`;

        return values[code]!.filter(
          ({ codes, country }) => codes.length && country
        )
          .map(
            ({ codes, country }) =>
              `{
              VALUES ${searchFor} { ${codes
                .map((code) => `"${code.toLowerCase()}"`)
                .join(" ")} }
              ?item wdt:${Property.StationCode} ${allStationCodes}; 
                    wdt:${Property.Country} wd:${country}. 
               FILTER(LCASE(STR(${allStationCodes})) = ${searchFor})
            }`
          )
          .flat()
          .filter(Boolean)
          .join(" UNION ");
      } else {
        return (
          values[code]?.length &&
          buildWhere(values[code]!, code, `?item wdt:${code} ?${code}`)
        );
      }
    })
    .flat()
    .filter(Boolean);

  return simplify(
    await run(
      `SELECT DISTINCT ?item ${[
        ...properties,
        ...label,
        `${Property.InAdministrativeTerritory}Label`,
      ]
        .map((key) => `?${key} ?${key}Id`)
        .join(
          " "
        )} WHERE { { SELECT DISTINCT ?item WHERE { ${innerSubQuery.join(
        " UNION "
      )} } } ${query} SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } }`
    ),
    properties.map((property) => ({ property }))
  );
};

export const fuzzyMatch = async (
  values: {
    labels: LocationV4["labels"];
    coordinates: [number, number];
  }[],
  label: string[],
  properties: string[],
  query: string
) => {
  throw new Error("Missing implementation for fuzzy match");
};
