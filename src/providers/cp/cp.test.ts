import test from "ava";
import fs from "fs";
import { Feature, Point } from "geojson";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { ScoreCp } from "./cp.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LocationV4 } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const atocLocations: Feature<Point, LocationV4["claims"]>[] = JSON.parse(
  fs.readFileSync(path + "cp.geojson", "utf-8")
).features;
const wikipedia: Feature<Point, LocationV4["claims"]>[] = JSON.parse(
  fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
).features;

test("locations in the Portugal should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [Property.LocatedInTimeZone]: locatedInTimeZone,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    atocLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }) => value === Country.Portugal.wikidata
      )
    ),
    wikipedia
  );

  t.is(country.matches / country.total, 1);
  t.is(location.matches / location.total, 1);
  t.is(locatedInTimeZone.total, 0);

  closeTo(t, uic?.matches / uic?.total, ScoreCp[CodeIssuer.UIC]);
  t.assert(uic?.total > LARGE_DATA_SIZE);
});

test("Should not have 2 foreign locations", async (t) => {
  const foreignLocations = atocLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }) => value !== Country.Portugal.wikidata
    )
  );
  t.is(foreignLocations.length, 2);

  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [Property.LocatedInTimeZone]: locatedInTimeZone,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    foreignLocations,
    wikipedia
  );

  t.is(country.matches / country.total, 1);
  t.is(location.matches / location.total, 1);
  t.is(locatedInTimeZone, undefined);

  closeTo(t, uic?.matches / uic?.total, ScoreCp[CodeIssuer.UIC]);
  t.assert(uic?.total < LARGE_DATA_SIZE);
});
