import test from "ava";
import fs from "fs";
import { Feature, Point } from "geojson";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { HungaryScore } from "./hu-mav.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const digitrafficLocations: Feature<
  Point,
  { labels: any[]; [key: string]: any }
>[] = JSON.parse(
  fs.readFileSync(path + "hu-mav.geojson", "utf-8")
).features;
const wikipedia: Feature<Point, { labels: any[]; [key: string]: any }>[] =
  JSON.parse(
    fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
  ).features;

test("Hungarian locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [Property.StationCode]: stationCode,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    digitrafficLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value === Country.Hungary.wikidata
      )
    ),
    wikipedia
  );

  t.is(country.matches / country.total, 1);
  t.is(location.matches / location.total, 1);

  closeTo(t, uic?.matches / uic?.total, HungaryScore[CodeIssuer.UIC]);
  t.assert(uic?.total > LARGE_DATA_SIZE);
});

test("Should not have Foreign locations", async (t) => {
  const foreignLocations = digitrafficLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value !== Country.Hungary.wikidata
    )
  );
  t.is(foreignLocations.length, 0);
});