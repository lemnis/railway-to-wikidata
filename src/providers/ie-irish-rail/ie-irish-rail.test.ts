import test from "ava";
import fs from "fs";
import { LocationV5 } from "../../types/location";
import { Property } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { IrelandScore } from "./ie-irish-rail.constants";

const path = __dirname + "/../../../geojson/";

const irishRailLocations: LocationV5[] = JSON.parse(
  fs.readFileSync(path + "ie-irish-rail.geojson", "utf-8")
).features;
const wikipedia: LocationV5[] =
  JSON.parse(
    fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
  ).features;

test("Irish locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [Property.StationCode]: stationCode,
  } = await getFullMatchScore(
    irishRailLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value === Country.Ireland.wikidata
      )
    ),
    wikipedia
  );

  t.is(country.matches / country.total, 1);
  
  t.is(stationCode?.matches / stationCode?.total, IrelandScore[Property.StationCode]);
  t.assert(stationCode?.total > LARGE_DATA_SIZE);
});

test("Foreign locations should match score", async (t) => {
  const {
    [Property.Country]: country,
    [Property.CoordinateLocation]: location,
    [Property.StationCode]: stationCode,
  } = await getFullMatchScore(
    irishRailLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value !== Country.Ireland.wikidata
      )
    ),
    wikipedia,
    [Property.StationCode, Property.Country],
    1.8
  );

  t.is(country.matches / country.total, 1);
  t.is(stationCode?.total, 0);
});