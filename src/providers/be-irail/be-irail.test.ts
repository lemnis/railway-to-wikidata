import test from "ava";
import fs from "fs";
import { Feature, Point } from "geojson";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LocationV4 } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const nmbsLocations: Feature<Point, LocationV4["claims"]>[] = JSON.parse(
  fs.readFileSync(path + "be-irail.geojson", "utf-8")
).features;
const trainline: Feature<Point, LocationV4["claims"]>[] = JSON.parse(
  fs.readFileSync(path + "trainline-stations.geojson", "utf-8")
).features;

test("Locations in the Belgium should match expected score", async (t) => {
  const locations = nmbsLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }) => value === Country.Belgium.wikidata
    )
  );

  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(locations, trainline);

  closeTo(t, country.matches / country.total, 1);
  t.is(location.matches / location.total, 1);

  t.assert(uic?.total > LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, 0.6);
});

test("Should not have foreign locations", async (t) => {
  t.is(
    nmbsLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }) => value !== Country.Belgium.wikidata
      )
    ).length,
    0
  );
});
