import test from "ava";
import fs from "fs";
import { Property } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { LocationV5 } from "../../types/location";
const path = __dirname + "/../../../geojson/";

const hzppLocations: LocationV5[] = JSON.parse(
  fs.readFileSync(path + "hr-hzpp.geojson", "utf-8")
).features;

test.todo('Croatia locations should be enabled');

test("Should not have Foreign locations", async (t) => {
  const foreignLocations = hzppLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value !== Country.Croatia.wikidata
    )
  );
  t.is(foreignLocations.length, 0);
});