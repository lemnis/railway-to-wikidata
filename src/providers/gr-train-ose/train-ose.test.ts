import test from "ava";
import fs from "fs";
import { Property } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { getFullMatchScore } from "../../utils/test";
import { Location } from "../../types/location";

const path = __dirname + "/../../../geojson/";

const trainOse: Location[] = JSON.parse(
  fs.readFileSync(path + "gr-train-ose.geojson", "utf-8")
).features;
const wikidata: Location[] = JSON.parse(
  fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
).features;

test("Locations in Greece should match expected score", async (t) => {
  const { [Property.Country]: country, [Property.StationCode]: stationCode } =
    await getFullMatchScore(
      trainOse.filter((feature) =>
        feature.properties?.[Property.Country]?.every(
          ({ value }) => value === Country.Greece.wikidata
        )
      ),
      wikidata
    );

  t.is(country.matches / country.total, 1);
  t.is(stationCode.matches / stationCode.total, 1);
});

test("Foreign locations should match expectd score", async (t) => {
  const { [Property.Country]: country } = await getFullMatchScore(
    trainOse.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }) => value !== Country.Greece.wikidata
      )
    ),
    wikidata
  );

  t.is(country.matches / country.total, 1);
});
