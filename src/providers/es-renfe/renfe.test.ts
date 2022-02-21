import test from "ava";
import fs from "fs";
import { Feature, Point } from "geojson";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { ReliabilityRenfe, ScoreRenfe } from "./renfe.constants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const renfeLocations: Feature<Point, { labels: any[]; [key: string]: any }>[] =
  JSON.parse(fs.readFileSync(path + "renfe.geojson", "utf-8")).features;
const wikipedia: Feature<Point, { labels: any[]; [key: string]: any }>[] =
  JSON.parse(
    fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
  ).features;

test("Spanish locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: coordinateLocation,
    [Property.PostalCode]: postalCode,
    [Property.Location]: location,
    [Property.StationCode]: stationCode,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    renfeLocations
      .filter((feature) =>
        feature.properties?.[Property.Country]?.every(
          ({ value }: any) => value === Country.Spain.wikidata
        )
      )
      .slice(0, 1000),
    wikipedia
  );

  t.is(country.matches / country.total, 1);
  t.is(coordinateLocation.matches / coordinateLocation.total, 1);
  t.is(postalCode.matches / postalCode.total, 0);
  t.is(location.matches / location.total, 0);

  t.assert(uic?.total > LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, ScoreRenfe[CodeIssuer.UIC]);

  t.assert(stationCode?.total > LARGE_DATA_SIZE);
  closeTo(
    t,
    stationCode?.matches / stationCode?.total,
    ScoreRenfe[Property.StationCode]
  );
});

test("Should not have Foreign locations", async (t) => {
  const foreignLocations = renfeLocations.filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }: any) => value !== Country.Spain.wikidata
    )
  );
  t.is(foreignLocations.length, 42);

  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: coordinateLocation,
    [Property.PostalCode]: postalCode,
    [Property.Location]: location,
    [Property.StationCode]: stationCode,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(foreignLocations, wikipedia);

  t.is(country.matches / country.total, 1);
  t.is(coordinateLocation.matches / coordinateLocation.total, 1);
  t.is(postalCode.matches / postalCode.total, 0);
  t.is(location.total, 0);

  t.assert(uic?.total < LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, ScoreRenfe[CodeIssuer.UIC]);

  t.assert(stationCode?.total < LARGE_DATA_SIZE);
  closeTo(
    t,
    stationCode?.matches / stationCode?.total,
    ScoreRenfe[Property.StationCode]
  );
});

test("Calculated reliability score should match", (t) => {
  t.is(ReliabilityRenfe.Spain[Property.StationCode].toFixed(1), "0.8");
  t.is(ReliabilityRenfe.Spain[CodeIssuer.UIC].toFixed(1), "0.6");
  t.is(ReliabilityRenfe.Foreign[Property.StationCode].toFixed(1), "0.5");
  t.is(ReliabilityRenfe.Foreign[CodeIssuer.UIC].toFixed(1), "0.3");
});