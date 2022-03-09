import test from "ava";
import { Feature, Point } from "geojson";
import { Property, CodeIssuer } from "../../types/wikidata";
import { CountryInfo, getCountryNameByWikidata } from "../../transform/country";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LocationV4 } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import fs from "fs";

const path = __dirname + "/../../../geojson/";

const euafrLocations: Feature<Point, LocationV4["claims"]>[] = JSON.parse(
  fs.readFileSync(path + "_euafr.geojson", "utf-8")
).features;
const trainline: Feature<Point, LocationV4["claims"]>[] = JSON.parse(
  fs.readFileSync(path + "trainline-stations.geojson", "utf-8")
).features;

export const singleProperty = test.macro({
  async exec(
    t,
    countryId: CountryInfo,
    expected: number,
    {
      code = CodeIssuer.UIC,
      data = trainline,
      large = true,
    }: {
      code?: Property | CodeIssuer;
      data?: Feature<Point, LocationV4["claims"]>[];
      large?: boolean;
      size?: number;
    } = {}
  ) {
    const locations = euafrLocations
      .filter((feature) =>
        feature.properties?.[Property.Country]?.every(
          ({ value }) => value === countryId.wikidata
        )
      )
      .slice(0, 2000);

    const {
      [Property.Country]: country,
      [Property.CoordinateLocation]: location,
      [code]: codeMatch,
    } = await getFullMatchScore(locations, data);

    closeTo(t, country.matches / country.total, 1);
    t.is(location.matches / location.total, 1);
    t.assert(codeMatch?.total > 0);
    t.assert(
      large
        ? codeMatch?.total > LARGE_DATA_SIZE
        : codeMatch?.total < LARGE_DATA_SIZE
    );
    closeTo(t, codeMatch?.matches / codeMatch?.total, expected);
  },
  title(country = "", countryId: CountryInfo) {
    return `${
      country || getCountryNameByWikidata(countryId.wikidata)
    } should match expected score`;
  },
});

export const noLocations = test.macro({
  async exec(t, countryId: CountryInfo) {
    const locations = euafrLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }) => value === countryId.wikidata
      )
    );

    t.is(locations.length, 0);
  },
  title(country = "", countryId: CountryInfo) {
    return `${
      country || getCountryNameByWikidata(countryId.wikidata)
    } should not have any locations`;
  },
});

export const noCodeIssuers = test.macro({
  async exec(t, countryId: CountryInfo) {
    const locations = euafrLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }) => value === countryId.wikidata
      )
    );

    const {
      [Property.Country]: country,
      [Property.CoordinateLocation]: location,
      notFound,
      missing,
      lowScore,
      ...extra
    } = await getFullMatchScore(locations, trainline);

    t.deepEqual(Object.keys(extra), []);
  },
  title(country = "", countryId: CountryInfo) {
    return `${
      country || getCountryNameByWikidata(countryId.wikidata)
    } should not have any code ids`;
  },
});
