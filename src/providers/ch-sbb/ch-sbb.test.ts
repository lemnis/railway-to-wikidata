import test from "ava";
import {promises as fs} from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LocationV5 } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const sbbLocations = fs
  .readFile(path + "ch-sbb.geojson", "utf-8")
  .then(
    (data) =>
      JSON.parse(data).features as LocationV5[]
  );
const trainline = fs
  .readFile(path + "trainline-stations.geojson", "utf-8")
  .then(
    (data) =>
      JSON.parse(data).features as LocationV5[]
  );

test("Locations in the Switzerland should match expected score", async (t) => {
  const locations = (await sbbLocations)
    .filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }) => value === Country.Switzerland.wikidata
      )
    );

  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(locations, await trainline);

  closeTo(t, country.matches / country.total, 1);

  t.assert(uic?.total > LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, .9);
});

test("Foreign locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    (await sbbLocations).filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }) => value !== Country.Switzerland.wikidata
      )
    ),
    await trainline
  );

  closeTo(t, country.matches / country.total, 1);

  t.assert(uic?.total > LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, .1);
});
