import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { closeTo, getFullMatchScore } from "../../utils/test";
import { Location } from "../../types/location";
import { LARGE_DATA_SIZE } from "../../score/reliability";
import { UIC_SCORE } from "./be-irail.constants";

const path = __dirname + "/../../../geojson/";

const nmbsLocations: Location[] = JSON.parse(
  fs.readFileSync(path + "be-irail.geojson", "utf-8")
).features;
const trainline: Location[] = JSON.parse(
  fs.readFileSync(path + "trainline-stations.geojson", "utf-8")
).features;

test("Locations in the Belgium should match expected score", async (t) => {
  const { [Property.Country]: country, [CodeIssuer.UIC]: uic } =
    await getFullMatchScore(
      nmbsLocations.filter((feature) =>
        feature.properties?.[Property.Country]?.every(
          ({ value }) => value === Country.Belgium.wikidata
        )
      ),
      trainline,
      [CodeIssuer.UIC]
    );

  t.is(country.matches / country.total, 1);
  t.assert(uic?.total > LARGE_DATA_SIZE);
  closeTo(t, uic?.matches / uic?.total, UIC_SCORE);
});

test("Should not have foreign locations", async (t) => {
  t.is(
    nmbsLocations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }) => value !== Country.Belgium.wikidata
      )
    ).length,
    0
  );
});
