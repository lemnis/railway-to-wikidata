import anyTest, { TestFn } from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { Location } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const test = anyTest as TestFn<Awaited<ReturnType<typeof getFullMatchScore>>>;

const SIZE_LIMIT = 500;

const trainline: Location[] = JSON.parse(
  fs.readFileSync(path + "trainline-stations.geojson", "utf-8")
).features;
const nsInternational: Location[] = JSON.parse(
  fs.readFileSync(path + "nl-ns-international.geojson", "utf-8")
).features;

const byCountry: Record<string, Location[]> = {};
const CountryEntries = Object.entries(Country);
nsInternational.forEach((location) => {
  location.properties?.[Property.Country]?.forEach(({ value }) => {
    const l = CountryEntries.find(([, c]) => c.wikidata === value);
    if (l) {
      const [key] = l;
      if (!byCountry[key] || byCountry[key].length < SIZE_LIMIT) {
        byCountry[key] ||= [];
        byCountry[key].push(location);
      }
    }
  });
});

test.before(async (t) => {
  t.context = await getFullMatchScore(
    Object.values(byCountry).flat(),
    trainline
  );
});

test("Country should be corrct", (t) => {
  closeTo(
    t,
    t.context[Property.Country]?.matches / t.context[Property.Country]?.total,
    1
  );
});

test("Benerail score shoulg be met", (t) => {
  t.truthy(t.context[CodeIssuer.Benerail]?.total > LARGE_DATA_SIZE);
  closeTo(
    t,
    t.context[CodeIssuer.Benerail]?.matches /
      t.context[CodeIssuer.Benerail]?.total,
    1
  );
});

test("IBNR score shoulg be met", (t) => {
  t.truthy(t.context[CodeIssuer.IBNR]?.total > LARGE_DATA_SIZE);
  closeTo(
    t,
    t.context[CodeIssuer.IBNR]?.matches / t.context[CodeIssuer.IBNR]?.total,
    1
  );
});
