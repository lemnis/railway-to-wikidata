import test from "ava";
import fs from "fs";
import { Feature, Point } from "geojson";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { LARGE_DATA_SIZE, POLAND_UIC_SCORE } from "./pkp.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LocationV4 } from "../../types/location";

const path = __dirname + "/../../../geojson/";

const pkp: Feature<Point, LocationV4["claims"]>[] = JSON.parse(
  fs.readFileSync(path + "pkp.geojson", "utf-8")
).features;
const trainline: Feature<Point, LocationV4["claims"]>[] = JSON.parse(
  fs.readFileSync(path + "trainline-stations.geojson", "utf-8")
).features;

test("Polish locations should match expected score with trainline", (t) => {
  const PolandLocations = pkp.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value === Country.Poland.wikidata
    )
  );

  const {
    [Property.Country]: country,
    [CodeIssuer.UIC]: uic,
    notFound,
  } = getFullMatchScore(PolandLocations, trainline);

  t.is(PolandLocations.length, 477);
  t.is(notFound.length, 334);

  closeTo(t, country.matches / country.total, 1);

  closeTo(t, uic?.matches / uic?.total, POLAND_UIC_SCORE);
  t.assert(uic?.total > LARGE_DATA_SIZE);
});

test("Should not a few foreign locations", (t) => {
  t.is(
    pkp.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value !== Country.Poland.wikidata
      )
    ).length,
    3
  );
});
