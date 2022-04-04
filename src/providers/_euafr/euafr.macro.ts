import test from "ava";
import { Property, CodeIssuer } from "../../types/wikidata";
import { CountryInfo, findCountryNameByWikidata } from "../../transform/country";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { Location } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import fs from "fs";

const path = __dirname + "/../../../geojson/";

const euafrLocations: Location[] = JSON.parse(
  fs.readFileSync(path + "_euafr.geojson", "utf-8")
).features;
const trainline: Location[] = JSON.parse(
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
      data?: Location[];
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
      .slice(0, 10);

    const {
      [Property.Country]: country,
      [code]: codeMatch,
    } = await getFullMatchScore(locations, data, [code]);

    closeTo(t, country.matches / country.total, 1);
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
      country || findCountryNameByWikidata(countryId.wikidata)
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
      country || findCountryNameByWikidata(countryId.wikidata)
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
      country || findCountryNameByWikidata(countryId.wikidata)
    } should not have any code ids`;
  },
});
