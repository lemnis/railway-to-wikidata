import test from "ava";
import fs from "fs";
import { Property, CodeIssuer } from "../../types/wikidata";
import { Country } from "../../transform/country";
import { Location } from "../../types/location";
import { singleProperty, noCodeIssuers, noLocations } from "./euafr.macro";
import { labelLanguage } from "../../utils/test/labelLanguage";

const euafrLocations: Location[] = JSON.parse(
  fs.readFileSync(__dirname + "/../../../geojson/_euafr.geojson", "utf-8")
).features;
const wiki: Location[] = JSON.parse(
  fs.readFileSync(
    __dirname + "/../../../geojson/wikidata-railway-stations.geojson",
    "utf-8"
  )
).features;

test(singleProperty, Country.Austria, {
  data: wiki,
  code: Property.StationCode,
});
test(singleProperty, Country.Belgium, {
  data: wiki,
  code: Property.StationCode,
});

test(singleProperty, Country.Bulgaria);
test(singleProperty, Country.Croatia);
test(singleProperty, Country.Czech);
test(noCodeIssuers, Country.Denmark);
test(noCodeIssuers, Country.Estonia);
test(singleProperty, Country.Finland, { data: wiki });
test(noCodeIssuers, Country.France);
test(singleProperty, Country.Germany, { data: wiki, code: CodeIssuer.DB });
test(noCodeIssuers, Country.Greece);
test(noCodeIssuers, Country.Hungary);
test(noLocations, Country.Ireland);
test(singleProperty, Country.Italy);
test(noCodeIssuers, Country.Latvia);
test(noCodeIssuers, Country.Lithuania);
test(noCodeIssuers, Country.Luxembourg);

test.todo("Cyprus should not have any locations");
test.todo("Malta should not have any locations");
test.todo("Northern Ireland should not have any locations");

test(singleProperty, Country.Norway);
test(singleProperty, Country.Poland);
test(singleProperty, Country.Portugal);
test(singleProperty, Country.Romania, { data: wiki });
test(singleProperty, Country.Slovenia);
test(singleProperty, Country.Spain);
test(singleProperty, Country.Sweden, {
  data: wiki,
  code: Property.StationCode,
});
test(singleProperty, Country.Switzerland);
test(singleProperty, Country.Netherlands, {
  data: wiki,
  code: Property.StationCode,
});
test(singleProperty, Country.UnitedKingdom, { code: CodeIssuer.ATOC });

test.skip(labelLanguage, euafrLocations, wiki);
