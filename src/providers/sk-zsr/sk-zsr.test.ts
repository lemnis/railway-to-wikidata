import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { ForeignScore, ScoreZsk } from "./sk-zsr.contstants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { Location } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { labelLanguage } from "../../utils/test/labelLanguage";

const path = __dirname + "/../../../geojson/";

const zsrLocations: Location[] = JSON.parse(
  fs.readFileSync(path + "sk-zsr.geojson", "utf-8")
).features;
const trainline: Location[] = JSON.parse(
  fs.readFileSync(path + "trainline-stations.geojson", "utf-8")
).features;

test("Locations in the Slovakia should match expected score", async (t) => {
  const locations = zsrLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }) => value === Country.Slovakia.wikidata
    )
  );

  const {
    [Property.Country]: country,
    [CodeIssuer.UIC]: uic,
    [CodeIssuer.IBNR]: ibnr,
  } = await getFullMatchScore(
    locations,
    trainline,
    [CodeIssuer.UIC, CodeIssuer.IBNR, Property.Country],
    // 1
  );

  closeTo(t, uic?.matches / uic?.total, ScoreZsk[CodeIssuer.UIC]);
  t.assert(uic?.total < LARGE_DATA_SIZE);
  t.is(ibnr as any, undefined);
  t.is(country.matches / country.total, 1);
});

test("Foreign locations should match expected score", async (t) => {
  const foreignLocations = zsrLocations.filter((feature) =>
  feature.properties?.[Property.Country]?.every(
    ({ value }) => value !== Country.Slovakia.wikidata
  )
  );

  const {
    [Property.Country]: country,
    [CodeIssuer.UIC]: uic,
    [CodeIssuer.IBNR]: ibnr,
  } = await getFullMatchScore(
    foreignLocations,
    trainline,
    [CodeIssuer.UIC, CodeIssuer.IBNR, Property.Country],
    // 1.5
  );

  closeTo(t, uic?.matches / uic?.total,  ForeignScore[CodeIssuer.UIC]);
  t.assert(uic?.total > LARGE_DATA_SIZE);
  closeTo(t, ibnr?.matches / ibnr?.total, ForeignScore[CodeIssuer.IBNR]);
  t.assert(ibnr?.total > LARGE_DATA_SIZE);
  t.is(country.matches / country.total, 1);
});

test(labelLanguage, zsrLocations, trainline);