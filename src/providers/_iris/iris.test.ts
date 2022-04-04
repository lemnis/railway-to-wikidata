import anyTest, { TestFn } from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { Location } from "../../types/location";
import { labelLanguage } from "../../utils/test/labelLanguage";
import { coordinateDistance } from "../../utils/test/coordinateDistance";

const path = __dirname + "/../../../geojson/";
const test = anyTest as TestFn<Awaited<ReturnType<typeof getFullMatchScore>>>;

const locations: Location[] = JSON.parse(
  fs.readFileSync(path + "_iris.geojson", "utf-8")
).features;
const wikipedia: Location[] = JSON.parse(
  fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
).features;

test.before(async (t) => {
  const ByCountry = locations.reduce<Record<string, Location[]>>((acc, curr) => {
    const c = curr.properties[Property.Country]?.[0].value;
    if(c) {
      acc[c] ||= [];
      acc[c].push(curr);
    } else {
      acc.noCountry ||= [];
      acc.noCountry.push(curr)
    }
    return acc;
  }, {});
  const reduced = Object.values(ByCountry).map(i => i.slice(0, 200)).flat();

  t.context = await getFullMatchScore(
    reduced,
    wikipedia,
    [CodeIssuer.IBNR, Property.Country, CodeIssuer.DB],
    1.5
  );
});

test("Locations' country should match", (t) => {
  const country = t.context[Property.Country];
  t.is(country.matches / country.total, 1);
});

test("Locations' IBNR code should match", (t) => {
  const ibnr = t.context[CodeIssuer.IBNR];
  closeTo(t, ibnr?.matches / ibnr?.total, 1);
  t.assert(ibnr?.total > LARGE_DATA_SIZE);
});

test("Locations' DB code should match", (t) => {
  const db = t.context[CodeIssuer.DB];
  closeTo(t, db?.matches / db?.total, 1);
  t.assert(db?.total >= LARGE_DATA_SIZE);
});

test(coordinateDistance, locations, wikipedia);
