import test from "ava";
import fs from "fs";
import { Location } from "../../types/location";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { RELIABILITY_RENFE_UIC, SCORE_UIC } from "./renfe.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { labelLanguage } from "../../utils/test/labelLanguage";

const path = __dirname + "/../../../geojson/";

const renfeLocations: Location[] = JSON.parse(
  fs.readFileSync(path + "es-renfe.geojson", "utf-8")
).features;
const wikipedia: Location[] = JSON.parse(
  fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
).features;

test("Spanish locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.PostalCode]: postalCode,
    [Property.Location]: location,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    renfeLocations
      .filter((feature) =>
        feature.properties?.[Property.Country]?.every(
          ({ value }: any) => value === Country.Spain.wikidata
        )
      )
      .slice(0, 1000),
    wikipedia,
    [CodeIssuer.UIC]
  );

  t.is(country.matches / country.total, 1);
  closeTo(t, postalCode.matches / postalCode.total, 1);
  t.is(location.matches / location.total, 0);

  t.assert(uic?.total > LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, SCORE_UIC);
});

test("Foreign locations should match score", async (t) => {
  const foreignLocations = renfeLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value !== Country.Spain.wikidata
    )
  );
  t.is(foreignLocations.length, 42);

  const {
    [Property.Country]: country,
    [Property.PostalCode]: postalCode,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    foreignLocations,
    wikipedia,
    [
      CodeIssuer.UIC,
      Property.Country,
      Property.StationCode,
      Property.PostalCode,
    ],
    1.4
  );

  t.is(country.matches / country.total, 1);
  t.is(postalCode.matches / postalCode.total, 0);
  t.assert(uic?.total < LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, 0);
});

test("Calculated reliability score should match", (t) => {
  t.is(RELIABILITY_RENFE_UIC.toFixed(1), "0.7");
});

test(labelLanguage, renfeLocations, wikipedia);
