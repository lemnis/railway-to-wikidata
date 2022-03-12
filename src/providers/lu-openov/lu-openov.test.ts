import test from "ava";
import fs from "fs";
import { Feature, Point } from "geojson";
import { CodeIssuer, Property } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const OpenOvLocations: Feature<Point, { labels: any[]; [key: string]: any }>[] =
  JSON.parse(fs.readFileSync(path + "lu-openov.geojson", "utf-8")).features;
const wikipedia: Feature<Point, { labels: any[]; [key: string]: any }>[] =
  JSON.parse(
    fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
  ).features;

test("Luxembourg locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    OpenOvLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value === Country.Luxembourg.wikidata
      )
    ),
    wikipedia
  );

  t.is(country.matches / country.total, 1);
  t.is(location.matches / location.total, 1);
  t.is(uic?.total, 0);
});

test("Should not have Foreign locations", async (t) => {
  const ForeignLocation = OpenOvLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value !== Country.Luxembourg.wikidata
    )
  );

  t.is(ForeignLocation.length, 0);
});
