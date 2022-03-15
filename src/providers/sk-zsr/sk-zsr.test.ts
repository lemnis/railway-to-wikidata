import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { ForeignScore, ScoreZsk } from "./sk-zsr.contstants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LocationV5 } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { inspect } from "util";

const path = __dirname + "/../../../geojson/";

const zsrLocations: LocationV5[] = JSON.parse(
  fs.readFileSync(path + "sk-zsr.geojson", "utf-8")
).features;
const wikidata: LocationV5[] = JSON.parse(
  fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
).features;

test("Locations in the Slovakia should match expected score", async (t) => {
  const locations = zsrLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }) => value === Country.Slovakia.wikidata
    )
  );

  const { [Property.Country]: country, [CodeIssuer.UIC]: uic } =
    await getFullMatchScore(locations, wikidata, [CodeIssuer.UIC]);

  closeTo(t, country.matches / country.total, 1);
  t.assert(uic?.total > LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, ScoreZsk[CodeIssuer.UIC]);
});

test("Foreign locations should match expected score", async (t) => {
  const foreignLocations = zsrLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }) => value !== Country.Slovakia.wikidata
    )
  );

  const { [Property.Country]: country, [CodeIssuer.UIC]: uic } =
    await getFullMatchScore(foreignLocations, wikidata);

  closeTo(t, country.matches / country.total, 1);
  t.assert(uic?.total > LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, ForeignScore[CodeIssuer.UIC]);
});
