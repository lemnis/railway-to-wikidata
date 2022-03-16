import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { POLAND_UIC_SCORE } from "./pkp.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { Location } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const pkp: Location[] = JSON.parse(
  fs.readFileSync(path + "pl-pkp.geojson", "utf-8")
).features;
const trainline: Location[] = JSON.parse(
  fs.readFileSync(path + "trainline-stations.geojson", "utf-8")
).features;

test("Polish locations should match expected score with trainline", async (t) => {
  const PolandLocations = pkp.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value === Country.Poland.wikidata
    )
  );

  const {
    [Property.Country]: country,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(PolandLocations, trainline);

  t.is(PolandLocations.length, 2785);
  t.is(country.matches / country.total, 1);
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
