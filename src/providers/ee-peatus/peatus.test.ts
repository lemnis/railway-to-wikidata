import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { LocationV5 } from "../../types/location";

const path = __dirname + "/../../../geojson/";

const peatus: LocationV5[] =
  JSON.parse(fs.readFileSync(path + "peatus.geojson", "utf-8")).features;
const wikipedia: LocationV5[] =
  JSON.parse(
    fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
  ).features;

test("Estonian locations should match expected score", async (t) => {
  const EstonianLocations = peatus.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value === Country.Estonia.wikidata
    )
  );
  t.is(EstonianLocations.length, 238);
  const {
    [Property.Country]: country,
    [CodeIssuer.UIC]: uic,
    notFound,
  } = await getFullMatchScore(EstonianLocations, wikipedia);

  t.is(notFound.length, 14);
  t.is(country.matches / country.total, 1);

  closeTo(t, uic?.matches / uic?.total, 0);
  t.assert(uic?.total > LARGE_DATA_SIZE);
});

test("Should not have any foreign locations", (t) => {
  t.is(
    peatus.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value !== Country.Estonia.wikidata
      )
    ).length,
    0
  );
});

test.todo('Should include UIC code');