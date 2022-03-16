import test from "ava";
import { promises as fs } from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { ScoreCp } from "./pt-cp.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LocationV5 } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const combiosLocations = fs
  .readFile(path + "pt-cp.geojson", "utf-8")
  .then((data) => JSON.parse(data).features as LocationV5[]);
const wikidata = fs
  .readFile(path + "wikidata-railway-stations.geojson", "utf-8")
  .then((data) => JSON.parse(data).features as LocationV5[]);

test("locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.LocatedInTimeZone]: locatedInTimeZone,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(await combiosLocations, await wikidata, [
    CodeIssuer.UIC,
    Property.LocatedInTimeZone,
    Property.Country,
  ], 1.5);

  t.is(country.matches / country.total, 1);
  t.is(locatedInTimeZone.total, 0);
  closeTo(t, uic?.matches / uic?.total, ScoreCp[CodeIssuer.UIC]);
  t.assert(uic?.total < LARGE_DATA_SIZE);
});

test("Should have 2 foreign locations", async (t) => {
  const foreignLocations = (await combiosLocations).filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }) => value !== Country.Portugal.wikidata
    )
  );
  t.is(foreignLocations.length, 2);
});
