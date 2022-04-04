import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { Location } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { GenericScore } from "./trainline.constants";
import { labelLanguage } from "../../utils/test/labelLanguage";

const path = __dirname + "/../../../geojson/";

const SIZE_LIMIT = 3;
type Context = Awaited<ReturnType<typeof getFullMatchScore>>;

const trainlineLocations: Location[] = JSON.parse(
  fs.readFileSync(path + "trainline-stations.geojson", "utf-8")
).features;
const wikipedia: Location[] = JSON.parse(
  fs.readFileSync(path + "_iris.geojson", "utf-8")
).features;

const byCountry: Record<string, Location[]> = {};
const CountryEntries = Object.entries(Country);
trainlineLocations.forEach((location) => {
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
    wikipedia
  );
});

const macro = test.macro({
  exec: async (t, c: any, locations: any[]) => {
    const {
      [Property.Country]: country,
      [Property.CoordinateLocation]: location,
      // [Property.StationCode]: stationCode,
      [CodeIssuer.UIC]: uic,
      [CodeIssuer.ATOC]: atoc,
      [CodeIssuer.Benerail]: benerail,
      [CodeIssuer.DB]: db,
      [CodeIssuer.GaresAndConnexions]: garesAndConnexions,
      [CodeIssuer.IBNR]: ibnr,
      [CodeIssuer.SNCF]: sncf,
      [CodeIssuer.Trainline]: trainline,
    } = t.context as Context;

    // closeTo(t, country.matches / country.total, 1);
    // 

    // t.assert(trainline.total < LARGE_DATA_SIZE);

    atoc?.total > LARGE_DATA_SIZE
      ? closeTo(t, atoc?.matches / atoc?.total, 0.8)
      : t.is(atoc as any, undefined);
    db?.total > LARGE_DATA_SIZE
      ? closeTo(t, db?.matches / db?.total, 1)
      : t.is(db as any, undefined);
    garesAndConnexions?.total > LARGE_DATA_SIZE
      ? closeTo(t, garesAndConnexions?.matches / garesAndConnexions?.total, 1)
      : t.is(garesAndConnexions as any, undefined);
    uic?.total > LARGE_DATA_SIZE
      ? closeTo(t, uic?.matches / uic?.total, 0.7)
      : t.is(uic as any, undefined);
    benerail?.total > LARGE_DATA_SIZE
      ? closeTo(t, benerail?.matches / benerail?.total, 0.9)
      : t.is(benerail as any, undefined);
    ibnr?.total > LARGE_DATA_SIZE
      ? closeTo(t, ibnr?.matches / ibnr?.total, 0.7)
      : t.falsy(ibnr?.total > LARGE_DATA_SIZE);
    sncf?.total > LARGE_DATA_SIZE
      ? closeTo(t, sncf?.matches / sncf?.total, 0.8)
      : t.falsy(sncf?.total > LARGE_DATA_SIZE);
  },
  title(title, country, locations: any[]) {
    return `Locations in the ${country} should meet reliability score`;
  },
});

test("ATOC", (t) => {
  t.truthy((t.context as Context)[CodeIssuer.ATOC]?.total > LARGE_DATA_SIZE);
  closeTo(
    t,
    (t.context as Context)[CodeIssuer.ATOC]?.matches /
      (t.context as Context)[CodeIssuer.ATOC]?.total,
    GenericScore[CodeIssuer.ATOC]
  );
});

// test("DB", (t) => {
//   t.false((t.context as Context)[CodeIssuer.DB]?.total > LARGE_DATA_SIZE);
//   closeTo(
//     t,
//     (t.context as Context)[CodeIssuer.DB]?.matches /
//       (t.context as Context)[CodeIssuer.DB]?.total,
//     GenericScore[CodeIssuer.DB]
//   );
// });

// test("garesAndConnexions", (t) => {
//   t.false(
//     (t.context as Context)[CodeIssuer.GaresAndConnexions]?.total >
//       LARGE_DATA_SIZE
//   );
//   closeTo(
//     t,
//     (t.context as Context)[CodeIssuer.GaresAndConnexions]?.matches /
//       (t.context as Context)[CodeIssuer.GaresAndConnexions]?.total,
//     GenericScore[CodeIssuer.GaresAndConnexions]
//   );
// });

test("UIC", (t) => {
  t.truthy((t.context as Context)[CodeIssuer.UIC]?.total > LARGE_DATA_SIZE);
  closeTo(
    t,
    (t.context as Context)[CodeIssuer.UIC]?.matches /
      (t.context as Context)[CodeIssuer.UIC]?.total,
    GenericScore[CodeIssuer.UIC]
  );
});

test("Benerail", (t) => {
  t.truthy(
    (t.context as Context)[CodeIssuer.Benerail]?.total > LARGE_DATA_SIZE
  );
  closeTo(
    t,
    (t.context as Context)[CodeIssuer.Benerail]?.matches /
      (t.context as Context)[CodeIssuer.Benerail]?.total,
    GenericScore[CodeIssuer.Benerail]
  );
});

test("IBNR", (t) => {
  t.truthy((t.context as Context)[CodeIssuer.IBNR]?.total > LARGE_DATA_SIZE);
  closeTo(
    t,
    (t.context as Context)[CodeIssuer.IBNR]?.matches /
      (t.context as Context)[CodeIssuer.IBNR]?.total,
    GenericScore[CodeIssuer.IBNR]
  );
});

test("SNCF", (t) => {
  t.truthy((t.context as Context)[CodeIssuer.SNCF]?.total > LARGE_DATA_SIZE);
  closeTo(
    t,
    (t.context as Context)[CodeIssuer.SNCF]?.matches /
      (t.context as Context)[CodeIssuer.SNCF]?.total,
    GenericScore[CodeIssuer.SNCF]
  );
});

test("Trainline", (t) => {
  t.truthy(
    (t.context as Context)[CodeIssuer.Trainline]?.total > LARGE_DATA_SIZE
  );
  closeTo(
    t,
    (t.context as Context)[CodeIssuer.Trainline]?.matches /
      (t.context as Context)[CodeIssuer.Trainline]?.total,
    GenericScore[CodeIssuer.Trainline]
  );
});

test.skip(macro, "trainline", Object.values(byCountry).flat());
test.todo("Should compare reliliability of the coordinate locations");

test(labelLanguage, trainlineLocations, wikipedia);