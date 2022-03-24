import test from "ava";
import { promises as fs } from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { SCORE_ATOC } from "./atoc.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { Location } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { labelLanguage } from "../../utils/test/labelLanguage";

const path = __dirname + "/../../../geojson/";

const atocLocations = fs
  .readFile(path + "uk-atoc.geojson", "utf-8")
  .then(
    (data) =>
      JSON.parse(data).features as Location[]
  );
const trainline = fs
  .readFile(path + "trainline-stations.geojson", "utf-8")
  .then(
    (data) =>
      JSON.parse(data).features as Location[]
  );

test("locations in the UK should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [CodeIssuer.ATOC]: atoc,
  } = await getFullMatchScore(
    (await atocLocations).filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }) => value === Country.UnitedKingdom.wikidata
      )
    ),
    await trainline,
    [CodeIssuer.ATOC]
  );

  t.is(country.matches / country.total, 1);
  closeTo(t, atoc?.matches / atoc?.total, SCORE_ATOC);
  t.assert(atoc?.total > LARGE_DATA_SIZE);
});

test("Should not have any foreign locations", async (t) => {
  t.is(
    (await atocLocations).filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }) => value !== Country.UnitedKingdom.wikidata
      )
    ).length,
    0
  );
});

test(labelLanguage, atocLocations, trainline);
