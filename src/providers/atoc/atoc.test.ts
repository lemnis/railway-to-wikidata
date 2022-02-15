import test from "ava";
import fs from "fs";
import { Feature, Point } from "geojson";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { UnitedKingdomScore, LARGE_DATA_SIZE } from "./atoc.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LocationV4 } from "../../types/location";

const path = __dirname + "/../../../geojson/";

const atocLocations: Feature<Point, LocationV4["claims"]>[] = JSON.parse(
  fs.readFileSync(path + "atoc.geojson", "utf-8")
).features;
const wikipedia: Feature<Point, LocationV4["claims"]>[] = JSON.parse(
  fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
).features;

test("locations in the UK should match expected score", (t) => {
  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [CodeIssuer.ATOC]: atoc,
  } = getFullMatchScore(
    atocLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }) => value === Country.UnitedKingdom.wikidata
      )
    ),
    wikipedia
  );

  t.is(country.matches / country.total, 1);
  t.is(location.matches / location.total, 1);

  closeTo(t, atoc?.matches / atoc?.total, UnitedKingdomScore[CodeIssuer.ATOC]);
  t.assert(atoc?.total > LARGE_DATA_SIZE);
});

test("Should not have any foreign locations", (t) => {
  const foreignLocations = atocLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }) => value !== Country.UnitedKingdom.wikidata
    )
  );
  t.is(foreignLocations.length, 0);
});
