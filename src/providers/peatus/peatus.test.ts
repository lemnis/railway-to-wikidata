import test from "ava";
import fs from "fs";
import { Feature, Point } from "geojson";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { LARGE_DATA_SIZE } from "./peatus.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";

const path = __dirname + "/../../../geojson/";

const peatus: Feature<Point, { labels: any[]; [key: string]: any }>[] =
  JSON.parse(fs.readFileSync(path + "peatus.geojson", "utf-8")).features;
const wikipedia: Feature<Point, { labels: any[]; [key: string]: any }>[] =
  JSON.parse(
    fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
  ).features;

test("Estonian locations should match expected score", (t) => {
  const EstonianLocations = peatus.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value === Country.Estonia.wikidata
    )
  );
  t.is(EstonianLocations.length, 238);
  const {
    [Property.Country]: country,
    [CodeIssuer.UIC]: uic,
    notFound,
  } = getFullMatchScore(EstonianLocations, wikipedia);

  t.is(notFound.length, 14);
  t.is(country.matches / country.total, 1);

  closeTo(t, uic?.matches / uic?.total, 0);
  t.assert(uic?.total > LARGE_DATA_SIZE);
});

test("Should not have any foreign locations", (t) => {
  t.is(
    peatus.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value !== Country.Estonia.wikidata
      )
    ).length,
    0
  );
});

test.todo('Should include UIC code');