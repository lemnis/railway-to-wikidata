import test from "ava";
import fs from "fs";
import { Feature, Point } from "geojson";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { NORWAY_UIC_SCORE, FOREIGN_UIC_SCORE } from "./entur.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const entur: Feature<Point, { labels: any[]; [key: string]: any }>[] =
  JSON.parse(fs.readFileSync(path + "entur.geojson", "utf-8")).features;
const wikipedia: Feature<Point, { labels: any[]; [key: string]: any }>[] =
  JSON.parse(
    fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
  ).features;

test("Norway locations should match expected score", async (t) => {
  const norwayScore = await getFullMatchScore(
    entur.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value === Country.Norway.wikidata
      )
    ),
    wikipedia
  );

  const country = norwayScore[Property.Country];
  const location = norwayScore[Property.CoordinateLocation];
  const uic = norwayScore[CodeIssuer.UIC];

  t.is(country.matches / country.total, 1);
  t.is(location.matches / location.total, 1);

  closeTo(t, uic?.matches / uic?.total, NORWAY_UIC_SCORE);
  t.assert(uic?.total > LARGE_DATA_SIZE);
});

test("Foreign locations should match expected score", async (t) => {
  const foreignScore = await getFullMatchScore(
    entur.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value !== Country.Norway.wikidata
      )
    ),
    wikipedia
  );

  const country = foreignScore[Property.Country];
  const location = foreignScore[Property.CoordinateLocation];
  const uic = foreignScore[CodeIssuer.UIC];

  t.is(country?.matches / country?.total, 1);
  t.is(location?.matches / location?.total, 1);

  t.is(uic?.matches / uic?.total, FOREIGN_UIC_SCORE);
  t.assert(uic?.total < LARGE_DATA_SIZE);
});
