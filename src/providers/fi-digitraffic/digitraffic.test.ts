import test from "ava";
import fs from "fs";
import { Location } from "../../types/location";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { FinlandScore } from "./digitraffic.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { labelLanguage } from "../../utils/test/labelLanguage";

const path = __dirname + "/../../../geojson/";

const digitrafficLocations: Location[] = JSON.parse(
  fs.readFileSync(path + "fi-digitraffic.geojson", "utf-8")
).features;
const wikipedia: Location[] = JSON.parse(
  fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
).features;

test("Finnish locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.StationCode]: stationCode,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    digitrafficLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value === Country.Finland.wikidata
      )
    ),
    wikipedia,
    [CodeIssuer.UIC, Property.StationCode, Property.Country],
    1.8
  );

  t.is(country.matches / country.total, 1);

  closeTo(t, uic?.matches / uic?.total, FinlandScore[CodeIssuer.UIC]);
  t.assert(uic?.total > LARGE_DATA_SIZE);

  closeTo(
    t,
    stationCode?.matches / stationCode?.total,
    FinlandScore[Property.StationCode]
  );
  t.assert(stationCode?.total > LARGE_DATA_SIZE);
});

test("Foreign locations should match expected score", async (t) => {
  const foreignLocations = digitrafficLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value !== Country.Finland.wikidata
    )
  );
  t.is(foreignLocations.length, 5);

  const {
    [Property.Country]: country,
    [Property.StationCode]: stationCode,
    [CodeIssuer.UIC]: uic,
    notFound,
  } = await getFullMatchScore(
    foreignLocations,
    wikipedia,
    [Property.Country, Property.StationCode, CodeIssuer.UIC],
    1
  );

  t.is(country.total, 1);
  t.is(stationCode.total, 0);
  t.is(uic.total, 1);
  t.assert(uic?.total < LARGE_DATA_SIZE);
});

test(labelLanguage, digitrafficLocations, wikipedia);
