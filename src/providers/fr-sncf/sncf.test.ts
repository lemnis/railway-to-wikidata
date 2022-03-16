import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { ReliabilitySncf, ScoreSncf } from "./sncf.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { Location } from "../../types/location";

const path = __dirname + "/../../../geojson/";

const sncfLocations: Location[] = JSON.parse(
  fs.readFileSync(path + "sncf.geojson", "utf-8")
).features;
const wikipedia: Location[] = JSON.parse(
  fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
).features;

test("French locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.PostalCode]: postalCode,
    [Property.InAdministrativeTerritory]: inAdministrativeTerritory,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    sncfLocations
      .filter((feature) =>
        feature.properties?.[Property.Country]?.every(
          ({ value }: any) => value === Country.France.wikidata
        )
      )
      .slice(0, 1000),
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

test("Should not have Foreign locations", async (t) => {
  const foreignLocations = sncfLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value !== Country.France.wikidata
    )
  );
  t.is(foreignLocations.length, 0);
});

test("Calculated reliability score should match", (t) => {
  t.is(ReliabilitySncf.France[Property.PostalCode].toFixed(1), "0.8");
  t.is(ReliabilitySncf.France[CodeIssuer.UIC].toFixed(1), "0.8");
});
