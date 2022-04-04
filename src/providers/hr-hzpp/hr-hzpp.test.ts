import test from "ava";
import fs from "fs";
import { Property } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { Location } from "../../types/location";
import { noForeignLocations } from "../../utils/test/noForeignLocation";
const path = __dirname + "/../../../geojson/";

const hzppLocations: Location[] = JSON.parse(
  fs.readFileSync(path + "hr-hzpp.geojson", "utf-8")
).features;

test.todo('Croatia locations should be enabled');

test(noForeignLocations, hzppLocations, Country.Croatia);
