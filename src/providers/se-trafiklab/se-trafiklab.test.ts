import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { Location } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { labelLanguage } from "../../utils/test/labelLanguage";
import { ScoreForeignTrafikLab, ScoreTrafiklab } from "./se-trafiklab.constants";
import { join } from "path";

const path = join(__dirname, "/../../../geojson/");

const trafiklabLocations: Location[] = JSON.parse(
  fs.readFileSync(join(path, "se-trafiklab.geojson"), "utf-8")
).features;
const wikidata: Location[] = JSON.parse(
  fs.readFileSync(
    join(path, "trainline-stations.geojson"),
    "utf-8"
  )
).features;

test("Locations in Sweden should match expected score", async (t) => {
  const { [Property.Country]: country, [CodeIssuer.IBNR]: uic } =
    await getFullMatchScore(
      trafiklabLocations.filter((feature) =>
        feature.properties?.[Property.Country]?.every(
          ({ value }) => value === Country.Sweden.wikidata
        )
      ),
      wikidata,
      [CodeIssuer.UIC, CodeIssuer.IBNR, Property.Country]
      // 1
    );

  closeTo(t, uic?.matches / uic?.total, ScoreTrafiklab[CodeIssuer.UIC]);
  t.assert(uic?.total > LARGE_DATA_SIZE);
  t.is(country.matches / country.total, 1);
});

test("Foreign locations should match expected score", async (t) => {
  const { [Property.Country]: country, [CodeIssuer.IBNR]: uic, ...others } =
    await getFullMatchScore(
      trafiklabLocations.filter((feature) =>
        feature.properties?.[Property.Country]?.every(
          ({ value }) => value !== Country.Sweden.wikidata
        )
      ),
      wikidata,
      [CodeIssuer.UIC, Property.Country]
      // 1.5
    );

  closeTo(t, uic?.matches / uic?.total, ScoreForeignTrafikLab[CodeIssuer.UIC]);
  t.assert(uic?.total > LARGE_DATA_SIZE);
  t.is(country.matches / country.total, 1);
});

test(labelLanguage, trafiklabLocations, wikidata, { percentageMatch: 1 });
