import test from "ava";
import { promises as fs } from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { Location } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const locations = fs
  .readFile(path + "ro-gov.geojson", "utf-8")
  .then((data) => JSON.parse(data).features as Location[]);
const trainline = fs
  .readFile(path + "trainline-stations.geojson", "utf-8")
  .then((data) => JSON.parse(data).features as Location[]);

test("locations should match expected score", async (t) => {
  const {
    [Property.Country]: country,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    await locations,
    await trainline,
    [CodeIssuer.UIC, Property.Country, Property.StationCode],
    // 1.5
  );

  t.is(country.matches / country.total, 1);
  closeTo(t, uic?.matches / uic?.total, .4);
  t.assert(uic?.total > LARGE_DATA_SIZE);
});

test("Should have 2 foreign locations", async (t) => {
  const foreignLocations = (await locations).filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }) => value !== Country.Romania.wikidata
    )
  );
  
  t.is(foreignLocations.length, 2);

  const {
    [Property.Country]: country,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    foreignLocations,
    await trainline,
    [CodeIssuer.UIC, Property.Country],
    1.5
  );

  t.is(country.matches / country.total, 1);
  t.is(uic as any, undefined);
});
