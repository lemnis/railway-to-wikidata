import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { Location } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { labelLanguage } from "../../utils/test/labelLanguage";

const path = __dirname + "/../../../geojson/";

const trafiklabLocations: Location[] = JSON.parse(
  fs.readFileSync(path + "se-trafiklab.geojson", "utf-8")
).features;
const trainline: Location[] = JSON.parse(
  fs.readFileSync(path + "wikidata-railway-stations.geojson", "utf-8")
).features;

test("Locations in Sweden should match expected score", async (t) => {
  const { [Property.Country]: country, [CodeIssuer.UIC]: uic } =
    await getFullMatchScore(
      trafiklabLocations.filter((feature) =>
        feature.properties?.[Property.Country]?.every(
          ({ value }) => value === Country.Sweden.wikidata
        )
      ),
      trainline,
      [CodeIssuer.UIC, CodeIssuer.IBNR, Property.Country],
      // 1
    );

  closeTo(t, uic?.matches / uic?.total, 1);
  t.assert(uic?.total > LARGE_DATA_SIZE);
  t.is(country.matches / country.total, 1);
});

test("Foreign locations should match expected score", async (t) => {
  const { [Property.Country]: country, [CodeIssuer.UIC]: uic } =
    await getFullMatchScore(
      trafiklabLocations.filter((feature) =>
        feature.properties?.[Property.Country]?.every(
          ({ value }) => value !== Country.Sweden.wikidata
        )
      ),
      trainline,
      [CodeIssuer.UIC, Property.Country],
      // 1.5
    );

  closeTo(t, uic?.matches / uic?.total, 0.95);
  t.assert(uic?.total < LARGE_DATA_SIZE);
  t.is(country.matches / country.total, 1);
});

test(labelLanguage, trafiklabLocations, trainline, { percentageMatch: 0.8 });
