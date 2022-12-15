import test from "ava";
import fs from "fs";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { getFullMatchScore } from "../../utils/test";
import { LARGE_DATA_SIZE } from "../../score/reliability";

const path = __dirname + "/../../../geojson/";

const litrailStations: Location[] = JSON.parse(
  fs.readFileSync(path + "lt-litrail.geojson", "utf-8")
).features;
const wikipedia: Location[] = JSON.parse(
  fs.readFileSync(path + "uic/wikidata.geojson", "utf-8")
).features;

test("Should not have foreign locations", async (t) => {
  t.is(
    litrailStations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value !== Country.Lithuania.wikidata
      )
    ).length,
    0
  );
});

test("Locations should match expected score", async (t) => {
  const { [Property.Country]: country, [CodeIssuer.ESR]: esr } =
    await getFullMatchScore(
      litrailStations,
      wikipedia,
      [],
      // 2
    );

  t.is(country.matches / country.total, 1);
  t.is(esr?.matches / esr?.total, 1);
  t.assert(esr?.total < LARGE_DATA_SIZE);
});
