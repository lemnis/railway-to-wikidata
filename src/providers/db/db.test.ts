import test from "ava";
import fs from "fs";
import { Feature, Point } from "geojson";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import {
  GERMANY_DB_SCORE,
  GERMANY_IBNR_SCORE,
  GERMANY_IN_ADMINISTRATIVE_TERRITORY_SCORE,
  GERMANY_POSTAL_CODE_SCORE,
  GERMANY_STATION_CATEGORY_SCORE,
  LARGE_DATA_SIZE,
} from "./db.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";

const path = __dirname + "/../../../geojson/";

const dbLocations: Feature<Point, { labels: any[]; [key: string]: any }>[] =
  JSON.parse(fs.readFileSync(path + "db.geojson", "utf-8")).features;
const wikipedia: Feature<Point, { labels: any[]; [key: string]: any }>[] =
  JSON.parse(
    fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
  ).features;

test("German locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [Property.PostalCode]: postalCode,
    [Property.InAdministrativeTerritory]: inAdministrativeTerritory,
    [Property.DBStationCategory]: stationCategory,
    [CodeIssuer.IBNR]: ibnr,
    [CodeIssuer.DB]: db,
  } = await getFullMatchScore(
    dbLocations
      .filter((feature) =>
        feature.properties?.[Property.Country]?.every(
          ({ value }: any) => value === Country.Germany.wikidata
        )
      )
      .slice(0, 500),
    wikipedia
  );

  t.is(country.matches / country.total, 1);
  t.is(location.matches / location.total, 1);

  closeTo(t, ibnr?.matches / ibnr?.total, GERMANY_IBNR_SCORE);
  t.assert(ibnr?.total > LARGE_DATA_SIZE);

  closeTo(t, db?.matches / db?.total, GERMANY_DB_SCORE);
  t.assert(db?.total > LARGE_DATA_SIZE);

  closeTo(
    t,
    postalCode?.matches / postalCode?.total,
    GERMANY_POSTAL_CODE_SCORE
  );
  t.assert(postalCode?.total > LARGE_DATA_SIZE);

  closeTo(
    t,
    inAdministrativeTerritory?.matches / inAdministrativeTerritory?.total,
    GERMANY_IN_ADMINISTRATIVE_TERRITORY_SCORE
  );
  t.assert(inAdministrativeTerritory?.total > LARGE_DATA_SIZE);

  closeTo(
    t,
    stationCategory?.matches / stationCategory?.total,
    GERMANY_STATION_CATEGORY_SCORE
  );
  t.assert(stationCategory?.total > LARGE_DATA_SIZE);
});

test("Should not have any foreign locations", async (t) => {
  const foreignLocations = dbLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value !== Country.Germany.wikidata
    )
  );
  t.is(foreignLocations.length, 0);
});

test.todo('Should be able to cache administrative territory');
test.todo('Should be able to get cached administrative territory');