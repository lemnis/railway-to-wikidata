import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { ReliabilitySncf, ScoreSncf } from "./sncf.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { Location } from "../../types/location";
import { labelLanguage } from "../../utils/test/labelLanguage";
import { noForeignLocations } from "../../utils/test/noForeignLocation";

const path = __dirname + "/../../../geojson/";

const sncfLocations: Location[] = JSON.parse(
  fs.readFileSync(path + "fr-sncf.geojson", "utf-8")
).features;
const wikipedia: Location[] = JSON.parse(
  fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
).features;

test(noForeignLocations, sncfLocations, Country.France);

test("French locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.PostalCode]: postalCode,
    [Property.InAdministrativeTerritory]: inAdministrativeTerritory,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    sncfLocations.slice(0, 1000),
    wikipedia,
    [
      Property.Country,
      Property.PostalCode,
      Property.InAdministrativeTerritory,
      CodeIssuer.UIC,
    ],
    1.8
  );

  t.is(country.matches / country.total, 1);

  closeTo(t, uic?.matches / uic?.total, ScoreSncf[CodeIssuer.UIC]);
  t.assert(uic?.total > LARGE_DATA_SIZE);

  closeTo(
    t,
    postalCode?.matches / postalCode?.total,
    ScoreSncf[Property.PostalCode]
  );
  t.assert(postalCode?.total > LARGE_DATA_SIZE);
});

test("Calculated reliability score should match", (t) => {
  t.is(ReliabilitySncf.France[Property.PostalCode].toFixed(1), "0.8");
  t.is(ReliabilitySncf.France[CodeIssuer.UIC].toFixed(1), "0.8");
});

test(labelLanguage, sncfLocations, wikipedia);
