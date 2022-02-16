import test from "ava";
import fs from "fs";
import { Feature, Point } from "geojson";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { FinlandScore, ForeignScore, LARGE_DATA_SIZE } from "./digitraffic.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";

const path = __dirname + "/../../../geojson/";

const digitrafficLocations: Feature<
  Point,
  { labels: any[]; [key: string]: any }
>[] = JSON.parse(
  fs.readFileSync(path + "digitraffic.geojson", "utf-8")
).features;
const wikipedia: Feature<Point, { labels: any[]; [key: string]: any }>[] =
  JSON.parse(
    fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
  ).features;

test("Finnish locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [Property.StationCode]: stationCode,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    digitrafficLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value === Country.Finland.wikidata
      )
    ),
    wikipedia
  );

  t.is(country.matches / country.total, 1);
  t.is(location.matches / location.total, 1);

  closeTo(t, uic?.matches / uic?.total, FinlandScore[CodeIssuer.UIC]);
  t.assert(uic?.total > LARGE_DATA_SIZE);

  closeTo(
    t,
    stationCode?.matches / stationCode?.total,
    FinlandScore[Property.StationCode]
  );
  t.assert(stationCode?.total > LARGE_DATA_SIZE);
});

test("Foreign locations should match expected score", async (t) => {
  const foreignLocations = digitrafficLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value !== Country.Finland.wikidata
    )
  );
  t.is(foreignLocations.length, 5);
  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(foreignLocations, wikipedia);

  t.is(country.matches / country.total, 1);
  t.is(location.matches / location.total, 1);

  closeTo(t, uic?.matches / uic?.total, ForeignScore[CodeIssuer.UIC]);
  t.assert(uic?.total < LARGE_DATA_SIZE);
});