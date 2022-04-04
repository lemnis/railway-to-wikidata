import fetch from "node-fetch";
import { findCountryByUIC } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";

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
        .map<Location>(({ id, keyValues, geometry, name }) => ({
          type: "Feature",
          id,
          geometry: {
            type: "MultiPoint",
            coordinates: geometry.coordinates || [],
          },
          properties: {
            labels: Array.isArray(name) ? name : [name],
            [CodeIssuer.UIC]: keyValues
              .filter(({ key }) => key === "uicCode")
              .map(({ values }) => values)
              .flat()
              .map((value) => ({ value: parseInt(value).toString() })),
            [Property.Country]: keyValues
              .filter(({ key }) => key === "uicCode")
              .map(({ values }) => values)
              .flat()
              .filter(Boolean)
              .map((value) => parseInt(value).toString())
              .map((value) => ({
                value: findCountryByUIC(parseInt(value[0] + value[1]))
                  ?.wikidata,
              })),
            [Property.StationCode]: keyValues
              .filter(({ key }) => key === "jbvCode")
              .map(({ values }) => values)
              .flat()
              .map((value) => ({ value })),
          },
        }))
    );
