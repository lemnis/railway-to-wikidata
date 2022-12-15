import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { NORWAY_UIC_SCORE, FOREIGN_UIC_SCORE } from "./entur.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { Location } from "../../types/location";

const path = __dirname + "/../../../geojson/";

const entur: Location[] = JSON.parse(
  fs.readFileSync(path + "no-entur.geojson", "utf-8")
).features;
const wikipedia: Location[] = JSON.parse(
  fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
).features;

test("Norway locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [CodeIssuer.UIC]: uic,
    notFound
  } = await getFullMatchScore(
    entur.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value === Country.Norway.wikidata
      )
    ),
    wikipedia,
    [CodeIssuer.UIC, Property.Country],
    // 1.5
  );

  t.is(country.matches / country.total, 1);
  closeTo(t, uic?.matches / uic?.total, NORWAY_UIC_SCORE);
  t.assert(uic?.total > LARGE_DATA_SIZE);
});

test("Foreign locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [CodeIssuer.UIC]: uic,
    notFound
  } = await getFullMatchScore(
    entur.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value !== Country.Norway.wikidata
      )
    ),
    wikipedia,
    [CodeIssuer.UIC],
    // 1.5
  );

  t.is(country?.matches / country?.total, 1);

  t.is(uic?.matches / uic?.total, FOREIGN_UIC_SCORE);
  t.assert(uic?.total < LARGE_DATA_SIZE);
});
