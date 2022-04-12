import test from "ava";
import { score } from ".";
import { Location } from "../types/location";
import { Property } from "../types/wikidata";
import { euafr, trainline } from "./score.fixtures";

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
            { value: "Leiden CS", lang: "nl" },
            {
              value: "Leiden",
              lang: "nl",
            },
            {
              value: "Leiden Centraal",
              lang: "nl",
            },
          ],
          P722: [{ value: "8400390" }],
          P954: [{ value: "8400390" }],
          P296: [{ value: "LEDN" }],
          P17: [{ value: "Q55" }],
          P5595: [{ value: "14" }],
          P1103: [{ value: "14" }],
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
            { value: "Leyde", lang: "fr" },
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
          P722: [{ value: "8400390" }],
          P17: [{ value: "Q55" }],
          P8448: [{ value: "NLLDC" }],
          P8181: [{ value: "NLAAU" }],
          P6724: [{ value: "8627" }],
          P421: [{ value: "Q5412088" }],
          P238: [{ value: "8400390" }],
        },
      },
      []
    ),
    { percentage: 2.245888779269201 }
  );
});

test("Should match to closest name and location", async (t) => {
  const origin: Location = {
    type: "Feature",
    id: "---221201014-LURu   -LURML-trainline-23272",
    geometry: {
      type: "MultiPoint",
      coordinates: [[6.032396, 49.460057]],
    },
    properties: {
      labels: [{ value: "Rumelange, Gare" }, { value: "Rumelange" }],
      P17: [{ value: "Q32" }],
      P8448: [{ value: "LURML" }],
      P954: [{ value: "8270910" }],
      P722: [{ value: "8200626" }],
      P6724: [{ value: "23272" }],
      P421: [{ value: "Q28148670" }],
    },
  };
  const wrongStation = await score(origin, {
    type: "Feature",
    id: "Q1905375",
    geometry: {
      type: "MultiPoint",
      coordinates: [[6.02861, 49.45417]],
    },
    properties: {
      labels: [
        {
          lang: "en",
          value: "Rumelange - Ottange train station",
        },
        {
          lang: "fr",
          value: "gare de Rumelange - Ottange",
        },
        {
          lang: "nl",
          value: "Station Rumelange-Ottange",
        },
      ],
      PWIKI: [{ value: "Q1905375" }],
      P17: [{ value: "Q32" }],
      P31: [{ value: "Q55488" }],
      P625: [],
      P722: [{ value: "8200628" }],
    },
  });

  const correctStation = await score(origin, {
    type: "Feature",
    id: "Q2063434",
    geometry: {
      type: "MultiPoint",
      coordinates: [[6.0325, 49.460277777]],
    },
    properties: {
      labels: [
        {
          lang: "ca",
          value: "Estació de trens de Rumelange",
        },
        {
          lang: "en",
          value: "Rumelange railway station",
        },
        {
          lang: "fr",
          value: "gare de Rumelange",
        },
        {
          lang: "hu",
          value: "Rumelange vasútállomás",
        },
        {
          lang: "lb",
          value: "Gare Rëmeleng",
        },
        {
          lang: "nl",
          value: "station Rumelange",
        },
      ],
      PWIKI: [{ value: "Q2063434" }],
      P625: [],
      P421: [{ value: "Q25989" }],
      P17: [{ value: "Q32" }],
      P31: [{ value: "Q55488" }],
      P722: [{ value: "8200626" }],
      P131: [{ value: "Q914847" }],
    },
  });

  t.truthy(wrongStation.percentage < correctStation.percentage);
});

test("Should match all St. Polten stations", async (t) => {
  t.like(await score(euafr as any, trainline as any), {
    percentage: 2.5537668536472102,
    labels: { percentage: 0.5909090909090908 },
    coordinates: { percentage: 0.9628577627381192 },
    claims: { percentage: 1 },
  });
});

test("Should match Sneek station", async (t) => {
  t.like(
    await score(
      {
        type: "Feature",
        id: "trainline-23383",
        geometry: {
          type: "MultiPoint",
          coordinates: [[5.6523969, 53.0328688]],
        },
        properties: {
          labels: [
            { value: "スネーク", lang: "ja" },
            {
              value: "스네이크",
              lang: "ko",
            },
            {
              value: "Снек",
              lang: "ru",
            },
            {
              value: "斯內克",
              lang: "zh",
            },
            {
              value: "Sneek",
              lang: "nl",
            },
          ],
          P722: [{ value: "8400566" }],
          P17: [{ value: "Q55" }],
          P8448: [{ value: "NLSNK" }],
          P6724: [{ value: "23383" }],
          P421: [{ value: "Q5412088" }],
          P954: [{ value: "8400566" }],
        },
      } as any,
      {
        type: "Feature",
        id: "----SK-NLSNK-NLSK-XNSK-Q167148",
        geometry: {
          type: "MultiPoint",
          coordinates: [[5.6523969, 53.0328688]],
        },
        properties: {
          labels: [
            { value: "Snits", lang: "nl" },
            {
              value: "Sneek",
              lang: "nl",
            },
            {
              lang: "de",
              value: "Bahnhof Sneek",
            },
            {
              lang: "en",
              value: "Station sneek",
            },
            {
              lang: "en",
              value: "Sneek railway station",
            },
            {
              lang: "fr",
              value: "gare de Sneek",
            },
            {
              lang: "fy",
              value: "Stasjon Snits",
            },
            {
              lang: "hu",
              value: "Sneek vasútállomás",
            },
            {
              lang: "nl",
              value: "rijksmonumentnummer 514104",
            },
            {
              lang: "nl",
              value: "station Sneek",
            },
            {
              lang: "zh",
              value: "斯內克車站",
            },
          ],
          P722: [{ value: "8400566" }],
          P954: [{ value: "8400566" }],
          P296: [{ value: "Sk" }],
          P17: [{ value: "Q55" }],
          P5595: [{ value: "2" }],
          P1103: [{ value: "2" }],
          P8448: [{ value: "NLSNK" }],
          P8671: [{ value: "XNSK" }],
          PWIKI: [{ value: "Q167148" }],
          P276: [{ value: "Q23070" }],
          P421: [{ value: "Q25989" }],
          P31: [{ value: "Q55488" }],
          P856: [{ value: "https://www.ns.nl/stationsinformatie/sk/sneek" }],
          P6375: [{ value: "Kanaalstraat 16" }],
          P131: [{ value: "Q1473276" }],
          P669: [{ value: "Q19288427" }],
        },
      } as any,

    ),
    {
      percentage: 2.8,
      labels: { percentage: 1 },
      coordinates: { percentage: 1 },
      claims: { percentage: .8 },
    }
  );
});
