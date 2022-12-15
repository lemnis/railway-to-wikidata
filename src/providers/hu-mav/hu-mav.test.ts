import test from "ava";
import fs from "fs";
import { Property } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { Location } from "../../types/location";

const path = __dirname + "/../../../geojson/";

const mavLocations: Location[] = JSON.parse(
  fs.readFileSync(path + "hu-mav.geojson", "utf-8")
).features;
const wikipedia: Location[] = JSON.parse(
  fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
).features;

test("Hungarian locations should match expected score", async (t) => {
  const { [Property.Country]: country } = await getFullMatchScore(
    mavLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value === Country.Hungary.wikidata
      )
    ),
    wikipedia,
    [Property.Country, Property.StationCode],
    // 1.4
  );

  closeTo(t, country.matches / country.total, 1);
});

test("Should not have Foreign locations", async (t) => {
  const foreignLocations = mavLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value !== Country.Hungary.wikidata
    )
  );
  t.is(foreignLocations.length, 0);
});
