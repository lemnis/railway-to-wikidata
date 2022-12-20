import fetch from "node-fetch";
import { logger } from "../../utils/logger";

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
