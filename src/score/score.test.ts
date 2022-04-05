import test from "ava";
import { score } from ".";
import { Property } from "../types/wikidata";

test("Percentage should be 1 if only coordinates where given", async ({
  like,
}) => {
  like(
    await score(
      {
        type: "Feature",
        geometry: { coordinates: [0, 0], type: "Point" },
        properties: { id: "1", labels: [] },
      },
      {
        type: "Feature",
        geometry: { coordinates: [0, 0], type: "Point" },
        properties: { id: "2", labels: [] },
      }
    ),
    { percentage: 1 }
  );
});

test("Percentage should be 2 if coordinates & claims match", async ({
  like,
}) => {
  like(
    await score(
      {
        type: "Feature",
        geometry: { coordinates: [0, 0], type: "Point" },
        properties: {
          id: "1",
          labels: [],
          [Property.Country]: [{ value: "h" }],
        },
      },
      {
        type: "Feature",
        geometry: { coordinates: [0, 0], type: "Point" },
        properties: {
          id: "2",
          labels: [],
          [Property.Country]: [{ value: "h" }],
        },
      }
    ),
    { percentage: 2 }
  );
});

test("Percentage should be 3 if coordinates, claims & labels match", async ({
  like,
}) => {
  like(
    await score(
      {
        type: "Feature",
        geometry: { coordinates: [0, 0], type: "Point" },
        properties: {
          id: "1",
          labels: [{ value: "label" }],
          [Property.Country]: [{ value: "h" }],
        },
      },
      {
        type: "Feature",
        geometry: { coordinates: [0, 0], type: "Point" },
        properties: {
          id: "2",
          labels: [{ value: "label" }],
          [Property.Country]: [{ value: "h" }],
        },
      }
    ),
    { percentage: 3 }
  );
});

test("Percentage should be 2 if all claims are excluded", async ({ like }) => {
  like(
    await score(
      {
        type: "Feature",
        geometry: { coordinates: [0, 0], type: "Point" },
        properties: {
          id: "1",
          labels: [{ value: "label" }],
          [Property.Country]: [{ value: "h" }],
        },
      },
      {
        type: "Feature",
        geometry: { coordinates: [0, 0], type: "Point" },
        properties: {
          id: "2",
          labels: [{ value: "label" }],
          [Property.Country]: [{ value: "h" }],
        },
      },
      [Property.Country]
    ),
    { percentage: 2 }
  );
});

test("Leiden centraal", async ({ like }) => {
  like(
    await score(
      {
        type: "Feature",
        id: "https://www.ns.nl/en/stationsinformatie/LEDN",
        geometry: {
          type: "Point",
          coordinates: [4.48166656494141, 52.1661109924316],
        },
        properties: {
          labels: [
            {
              value: "Leiden CS",
              lang: "nl",
            },
            {
              value: "Leiden",
              lang: "nl",
            },
            {
              value: "Leiden Centraal",
              lang: "nl",
            },
          ],
          P722: [
            {
              value: "8400390",
              info: {
                reliability: 0.7999999999999999,
              },
            },
          ],
          P954: [
            {
              value: "8400390",
              info: {
                reliability: 0.7999999999999999,
              },
            },
          ],
          P296: [
            {
              value: "LEDN",
              qualifiers: {
                P518: [
                  {
                    value: "Q23076",
                  },
                ],
              },
            },
          ],
          P17: [
            {
              value: "Q55",
            },
          ],
          P5595: [
            {
              value: "14",
            },
          ],
          P1103: [
            {
              value: "14",
            },
          ],
        },
      },
      {
        type: "Feature",
        id: "https://trainline-eu.github.io/stations-studio/#/station/8627",
        geometry: {
          type: "MultiPoint",
          coordinates: [[4.492997, 52.175072]],
        },
        properties: {
          labels: [
            {
              value: "Leyde",
              lang: "fr",
            },
            {
              value: "Leida",
              lang: "it",
            },
            {
              value: "ライデン",
              lang: "ja",
            },
            {
              value: "레이던",
              lang: "ko",
            },
            {
              value: "Lejda",
              lang: "pl",
            },
            {
              value: "Leida",
              lang: "pt",
            },
            {
              value: "Лейден",
              lang: "ru",
            },
            {
              value: "莱顿",
              lang: "zh",
            },
            {
              value: "Leiden Centraal",
            },
          ],
          P722: [
            {
              value: "8400390",
              references: {
                P854: "https://trainline-eu.github.io/stations-studio/#/station/8627",
              },
              info: {
                reliability: 0.7000000000000001,
              },
            },
          ],
          P17: [
            {
              value: "Q55",
            },
          ],
          P8448: [
            {
              value: "NLLDC",
              references: {
                P854: "https://trainline-eu.github.io/stations-studio/#/station/8627",
              },
            },
          ],
          P8181: [
            {
              value: "NLAAU",
              references: {
                P854: "https://trainline-eu.github.io/stations-studio/#/station/8627",
              },
            },
          ],
          P6724: [
            {
              value: "8627",
              references: {
                P854: "https://trainline-eu.github.io/stations-studio/#/station/8627",
              },
            },
          ],
          P421: [
            {
              value: "Q5412088",
              references: {
                P854: "https://trainline-eu.github.io/stations-studio/#/station/8627",
              },
            },
          ],
          P238: [
            {
              value: "8400390",
              references: {
                P854: "https://trainline-eu.github.io/stations-studio/#/station/8627",
              },
              info: {
                reliability: 0.7000000000000001,
              },
            },
          ],
        },
      },
      []
    ),
    { percentage: 2.245888779269201 }
  );
});
