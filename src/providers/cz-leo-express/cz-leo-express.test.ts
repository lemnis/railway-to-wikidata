import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { ScoreForeign, ScoreLeoExpress } from "./cz-leo-express.contstants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LocationV5 } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const leoExpressLocations: LocationV5[] = JSON.parse(
  fs.readFileSync(path + "cz-leo-express.geojson", "utf-8")
).features;
const trainline: LocationV5[] = JSON.parse(
  fs.readFileSync(path + "trainline-stations.geojson", "utf-8")
).features;

test("Locations in the Czech should match expected score", async (t) => {
  const locations = leoExpressLocations.filter(
    (feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }) => value === Country.Czech.wikidata
      )
  );

  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [CodeIssuer.UIC]: uic
  } = await getFullMatchScore(locations, trainline);

  closeTo(t, country.matches / country.total, 1);
  t.is(location.matches / location.total, 1);

  t.assert(uic?.total > LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, ScoreLeoExpress[CodeIssuer.UIC]);
});

test("Foreign locations should match expected score", async (t) => {
  const foreignLocations = leoExpressLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }) => value !== Country.Czech.wikidata
    )
  );

  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [CodeIssuer.UIC]: uic
  } = await getFullMatchScore(foreignLocations, trainline);

  t.is(country.matches / country.total, 1);
  t.is(location.matches / location.total, 1);

  t.assert(uic?.total > LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, ScoreForeign[CodeIssuer.UIC]);
});
