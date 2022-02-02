import { graphql, graphqlSync } from "graphql";
import fetch from "node-fetch";
import { LocationV4 } from "../../types/location";
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
  name: { lang: string; value: string }[];
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
        .map<LocationV4>(({ id, keyValues, geometry, name }) => ({
          id,
          labels: name,
          claims: {
            [CodeIssuer.UIC]: keyValues
              .filter(({ key }) => key === "uicCode")
              .map(({ values }) => values)
              .flat()
              .map((value) => ({ value })),
            [Property.StationCode]: keyValues
              .filter(({ key }) => key === "jbvCode")
              .map(({ values }) => values)
              .flat()
              .map((value) => ({ value })),
            [Property.CoordinateLocation]: geometry.coordinates.map(
              (value) => ({ value: [value[1], value[0]] })
            ),
          },
        }))
    );
