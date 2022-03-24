import test from "ava";
import { promises as fs } from "fs";
import { Location } from "../../types/location";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import {
  NETHERLANDS_UIC_SCORE,
  NETHERLANDS_IBNR_SCORE,
  FOREIGN_UIC_SCORE,
  FOREIGN_IBNR_SCORE,
  FOREIGN_COUNTRY_SCORE,
  NETHERLANDS_TRACKS_SCORE,
  NETHERLANDS_FACES_SCORE,
} from "./ns.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { labelLanguage } from "../../utils/test/labelLanguage";

const path = __dirname + "/../../../geojson/";

const ns = fs
  .readFile(path + "nl-ns.geojson", "utf-8")
  .then((data) => JSON.parse(data).features as Location[]);
const wikidata = fs
  .readFile(path + "wikidata-railway-stations.geojson", "utf-8")
  .then((data) => JSON.parse(data).features as Location[]);

const EXPECTED_AMOUNT_OF_LOCATIONS = 579;

test(`Should have ${EXPECTED_AMOUNT_OF_LOCATIONS} locations`, async ({
  deepEqual,
}) => {
  deepEqual((await ns).length, EXPECTED_AMOUNT_OF_LOCATIONS);
});

test("Netherlands locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.NumberOfPlatformTracks]: tracks,
    [Property.NumberOfPlatformFaces]: faces,
    [CodeIssuer.UIC]: uic,
    [CodeIssuer.IBNR]: ibnr,
    notFound,
  } = await getFullMatchScore(
    (
      await ns
    ).filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value === Country.Netherlands.wikidata
      )
    ),
    await wikidata,
    [
      Property.Country,
      Property.NumberOfPlatformTracks,
      Property.NumberOfPlatformFaces,
      CodeIssuer.UIC,
      CodeIssuer.IBNR,
    ],
    1
  );

  t.is(notFound.length, 2);
  t.is(country.matches / country.total, 1);

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

  const locations = (await ns).filter((feature) =>
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
    [Property.NumberOfPlatformTracks]: tracks,
    [Property.NumberOfPlatformFaces]: faces,
    [CodeIssuer.UIC]: uic,
    [CodeIssuer.IBNR]: ibnr,
    notFound,
  } = await getFullMatchScore(
    (
      await ns
    ).filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value !== Country.Netherlands.wikidata
      )
    ),
    await wikidata
  );

  t.is(tracks?.total, 0);
  t.is(faces?.total, 0);

  closeTo(t, country?.matches / country?.total, FOREIGN_COUNTRY_SCORE);
  t.assert(country?.total > LARGE_DATA_SIZE);

  closeTo(t, uic?.matches / uic?.total, FOREIGN_UIC_SCORE);
  t.assert(uic?.total > LARGE_DATA_SIZE);

  closeTo(t, ibnr?.matches / ibnr?.total, FOREIGN_IBNR_SCORE);
  t.assert(ibnr?.total > LARGE_DATA_SIZE);
});

test("Netherlands", labelLanguage, ns, wikidata)
