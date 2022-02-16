import test from "ava";
import fs from "fs";
import { Feature, Point } from "geojson";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import {
  NETHERLANDS_UIC_SCORE,
  NETHERLANDS_IBNR_SCORE,
  FOREIGN_UIC_SCORE,
  FOREIGN_IBNR_SCORE,
  LARGE_DATA_SIZE,
  FOREIGN_COUNTRY_SCORE,
  NETHERLANDS_TRACKS_SCORE,
  NETHERLANDS_FACES_SCORE,
} from "./ns.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";

const path = __dirname + "/../../../geojson/";

const ns: Feature<Point, { labels: any[]; [key: string]: any }>[] = JSON.parse(
  fs.readFileSync(path + "ns.geojson", "utf-8")
).features;
const wikipedia: Feature<Point, { labels: any[]; [key: string]: any }>[] =
  JSON.parse(
    fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
  ).features;

const EXPECTED_AMOUNT_OF_LOCATIONS = 579;

test(`Should have ${EXPECTED_AMOUNT_OF_LOCATIONS} locations`, ({
  deepEqual,
}) => {
  deepEqual(ns.length, EXPECTED_AMOUNT_OF_LOCATIONS);
});

test("NL locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [Property.NumberOfPlatformTracks]: tracks,
    [Property.NumberOfPlatformFaces]: faces,
    [CodeIssuer.UIC]: uic,
    [CodeIssuer.IBNR]: ibnr,
    notFound
  } = await getFullMatchScore(
    ns.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value === Country.Netherlands.wikidata
      )
    ),
    wikipedia
  );

  t.is(notFound.length, 0);
  t.is(country.matches / country.total, 1);
  t.is(location.matches / location.total, 1);

  closeTo(t, uic?.matches / uic?.total, NETHERLANDS_UIC_SCORE);
  t.assert(uic?.total > LARGE_DATA_SIZE);

  closeTo(t, ibnr?.matches / ibnr?.total, NETHERLANDS_IBNR_SCORE);
  t.assert(ibnr?.total > LARGE_DATA_SIZE);
  
  closeTo(t, tracks?.matches / tracks?.total, NETHERLANDS_TRACKS_SCORE);
  t.assert(tracks?.total > LARGE_DATA_SIZE);

  closeTo(t, faces?.matches / faces?.total, NETHERLANDS_FACES_SCORE);
  t.assert(faces?.total < LARGE_DATA_SIZE);
});

test(`NL locations, should ${CodeIssuer.IBNR} & ${CodeIssuer.UIC} often match`, async (t) => {
  const ALLOWED_FAIL_RATE = 0.15;

  const locations = ns.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value === Country.Netherlands.wikidata
    )
  );
  let fails = 0;
  await Promise.all(
    locations.map(async (location) => {
      const tried = await t.try(
        (tt, uic, ibnr) => {
          tt.deepEqual(uic, ibnr);
        },
        location.properties[CodeIssuer.UIC],
        location.properties[CodeIssuer.IBNR]
      );

      if (tried.passed) {
        tried.commit();
      } else {
        // t.log(tried.errors);
        tried.discard();
        fails++;
      }
    })
  );
  if (fails / locations.length < ALLOWED_FAIL_RATE) {
    t.pass();
  } else {
    t.fail(
      `More than ${
        ALLOWED_FAIL_RATE * 100
      }% of the locations didn't meet the expectation, actual ${Math.round(
        (fails / locations.length) * 100
      )}%`
    );
  }
});

test("Foreign locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [Property.NumberOfPlatformTracks]: tracks,
    [Property.NumberOfPlatformFaces]: faces,
    [CodeIssuer.UIC]: uic,
    [CodeIssuer.IBNR]: ibnr,
    notFound
  } = await getFullMatchScore(
    ns.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value !== Country.Netherlands.wikidata
      )
    ),
    wikipedia
  );

  t.is(notFound.length, 13);
  t.is(location?.matches / location?.total, 1);
  t.is(tracks?.total, 0);
  t.is(faces?.total, 0);

  closeTo(t, country?.matches / country?.total, FOREIGN_COUNTRY_SCORE);
  t.assert(country?.total > LARGE_DATA_SIZE);

  closeTo(t, uic?.matches / uic?.total, FOREIGN_UIC_SCORE);
  t.assert(uic?.total > LARGE_DATA_SIZE);

  closeTo(t, ibnr?.matches / ibnr?.total, FOREIGN_IBNR_SCORE);
  t.assert(ibnr?.total > LARGE_DATA_SIZE);
});
