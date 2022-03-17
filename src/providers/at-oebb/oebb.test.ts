import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { Location } from "../../types/location";
import { IBNR_SCORE } from "./oebb.constants";

const path = __dirname + "/../../../geojson/";

const oebbLocations: Location[] = JSON.parse(
  fs.readFileSync(path + "at-oebb.geojson", "utf-8")
).features;
const wikipedia: Location[] = JSON.parse(
  fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
).features;

test("Austrian locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [CodeIssuer.IBNR]: ibnr,
  } = await getFullMatchScore(
    oebbLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value === Country.Austria.wikidata
      )
    ),
    wikipedia,
    [CodeIssuer.IBNR, Property.Country],
    1.5
  );

  t.is(country.matches / country.total, 1);
  closeTo(t, ibnr?.matches / ibnr?.total, IBNR_SCORE);
  t.assert(ibnr?.total > LARGE_DATA_SIZE);
});

test("Foreign locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [CodeIssuer.IBNR]: ibnr
  } = await getFullMatchScore(
    oebbLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value !== Country.Austria.wikidata
      )
    ),
    wikipedia,
    [CodeIssuer.IBNR],
    1.5
  );

  t.is(country?.matches / country?.total, 1);
  closeTo(t, ibnr?.matches / ibnr?.total, IBNR_SCORE);
  t.assert(ibnr?.total > LARGE_DATA_SIZE);
});
