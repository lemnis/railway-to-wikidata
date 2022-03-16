import test from "ava";
import { promises as fs } from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { ScoreForeign, ScoreLeoExpress } from "./cz-leo-express.contstants";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { Location } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const leoExpressLocations = fs
  .readFile(path + "cz-leo-express.geojson", "utf-8")
  .then((data) => JSON.parse(data).features as Location[]);
const trainline = fs
  .readFile(path + "trainline-stations.geojson", "utf-8")
  .then((data) => JSON.parse(data).features as Location[]);
const wikidata = fs
  .readFile(path + "wikidata-railway-stations.geojson", "utf-8")
  .then((data) => JSON.parse(data).features as Location[]);

test("Locations in the Czech should match expected score", async (t) => {
  const locations = (await leoExpressLocations).filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }) => value === Country.Czech.wikidata
    )
  );

  const {
    [Property.Country]: country,
    [CodeIssuer.UIC]: uic,
  } = await getFullMatchScore(
    locations,
    await wikidata,
    [CodeIssuer.UIC, Property.Country],
    1.6
  );

  closeTo(t, country.matches / country.total, 1);

  t.assert(uic?.total > LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, ScoreLeoExpress[CodeIssuer.UIC]);
});

test("Foreign locations should match expected score", async (t) => {
  const foreignLocations = (await leoExpressLocations).filter((feature) =>
    feature.properties?.[Property.Country]?.every(
      ({ value }) => value !== Country.Czech.wikidata
    )
  );

  const { [Property.Country]: country, [CodeIssuer.UIC]: uic } =
    await getFullMatchScore(
      foreignLocations,
      await trainline,
      [Property.Country, CodeIssuer.UIC],
      1.6
    );

  t.is(country.matches / country.total, 1);

  t.assert(uic?.total > LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, ScoreForeign[CodeIssuer.UIC]);
});
