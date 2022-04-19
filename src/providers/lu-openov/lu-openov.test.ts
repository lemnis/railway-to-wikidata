import test from "ava";
import { promises as fs } from "fs";
import { Location } from "../../types/location";
import { Property } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { getFullMatchScore } from "../../utils/test";

const path = __dirname + "/../../../geojson/";

const openOvLocations = fs
  .readFile(path + "lu-openov.geojson", "utf-8")
  .then((data) => JSON.parse(data).features as Location[]);
const trainline = fs
  .readFile(path + "trainline-stations.geojson", "utf-8")
  .then((data) => JSON.parse(data).features as Location[]);

test("Luxembourg locations should match expected score", async (t) => {
  const { [Property.Country]: country } =
    await getFullMatchScore(
      (
        await openOvLocations
      ).filter((feature) =>
        feature.properties?.[Property.Country]?.every(
          ({ value }) => value === Country.Luxembourg.wikidata
        )
      ),
      await trainline,
      [Property.Country],
      1.6
    );

    t.is(country.matches / country.total, 1);
});

test("Should not have Foreign locations", async (t) => {
  const { [Property.Country]: country } =
    await getFullMatchScore(
      (
        await openOvLocations
      ).filter((feature) =>
        feature.properties?.[Property.Country]?.every(
          ({ value }) => value !== Country.Luxembourg.wikidata
        )
      ),
      await trainline,
      [Property.Country],
      1.6
    );

    t.is(country.matches / country.total, 1);
});
