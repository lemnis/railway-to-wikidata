import fetch from "node-fetch";
import { Country, findCountryByUIC } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { ReliabilityEntur } from "./entur.constants";

const source = `{
  stopPlace(
    size: 10000,
    stopPlaceType: railStation
  ) {
    id
    name {
      lang
      value
    }
    keyValues {
      key
      values
    }
    geometry {
      type
      coordinates
    }
  }
}`;

interface StopPlace {
  id: string;
  name: { lang: string; value: string }[] | { lang: string; value: string };
  keyValues: {
    key:
      | "imported-id" // Other StopPlaces
      | "jbvCode" // Station Code
      | "uicCode" // UIC
      | "grailsId"
      | "iffCode"
      | "lisaId"
      | "tpsiId"
      | "grailsID";
    values: string[];
  }[];
  geometry: { type: "Point"; coordinates: [number, number][] };
}

export const getLocations = () =>
  fetch("https://api.dev.entur.io/stop-places/v1/graphql", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: source }),
    method: "POST",
  })
    .then((response) => response.json())
    .then((response) => response.data.stopPlace)
    .then((stopPlaces: StopPlace[]) =>
      stopPlaces
        .filter(({ keyValues }) =>
          keyValues.some(({ key }) => ["uicCode", "jbvCode"].includes(key))
        )
        .map<Location>(({ id, keyValues, geometry, name }) => {
          const uicCodes = keyValues
            .filter(({ key }) => key === "uicCode")
            .map(({ values }) => values)
            .flat()
            // Some UIC code incorrectly start with some 0's..
            .map((value) => parseFloat(value).toString())
            .filter(Boolean);
          const stationCodes = keyValues
            .filter(({ key }) => key === "jbvCode")
            .map(({ values }) => values)
            .flat();

          const labels = [name].flat().map((i) => ({
            ...i,
            lang: i.lang === "nor" ? "no" : i.lang,
          }));

          // In some rare cases UIC code is missing, instead guess the country trough its name.
          const guessedCountry = labels.some(({ value }) =>
            value.includes("station")
          )
            ? Country.Sweden
            : labels.some(({ value }) => value.includes("stasjon"))
            ? Country.Norway
            : undefined;
          const uicCountry = uicCodes
            .map((value) => findCountryByUIC(parseInt(value.slice(0, 2))))
            .filter(Boolean)?.[0];
          const country = uicCountry || guessedCountry;

          return {
            type: "Feature",
            id,
            geometry: {
              type: "MultiPoint",
              coordinates: geometry.coordinates || [],
            },
            properties: {
              labels,
              [CodeIssuer.UIC]: uicCodes.map((value) => ({
                value,
                info: {
                  reliability:
                    country === Country.Norway
                      ? ReliabilityEntur.Norway[CodeIssuer.UIC]
                      : ReliabilityEntur.Foreign[CodeIssuer.UIC],
                },
              })),
              [Property.Country]: [
                {
                  value: country?.wikidata,
                },
              ],
              [Property.StationCode]: stationCodes.map((value) => ({ value })),
            },
          };
        })
    );
