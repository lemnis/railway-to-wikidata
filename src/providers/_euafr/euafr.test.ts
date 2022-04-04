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

test(singleProperty, Country.Austria, 1, {
  data: wiki,
  code: Property.StationCode,
});
test(singleProperty, Country.Belgium, 1, {
  data: wiki,
  code: Property.StationCode,
});
test(singleProperty, Country.Bulgaria, 0.7, { large: false });
test(singleProperty, Country.Croatia, 0.9, { large: false});

test.todo("Cyprus should not have any locations");

test(singleProperty, Country.Czech, .85);
test(noCodeIssuers, Country.Denmark);
test(noCodeIssuers, Country.Estonia);
test(singleProperty, Country.Finland, 1, { data: wiki });
test(noCodeIssuers, Country.France);
test(singleProperty, Country.Germany, 1, {
  data: wiki,
  code: CodeIssuer.DB,
});
test(noCodeIssuers, Country.Greece);
test(noCodeIssuers, Country.Hungary);
test(noLocations, Country.Ireland);
test(singleProperty, Country.Italy, 1);
test(noCodeIssuers, Country.Latvia);
test(noCodeIssuers, Country.Lithuania);
test(noCodeIssuers, Country.Luxembourg);

test.todo("Malta should not have any locations");
test.todo("Northern Ireland should not have any locations");

test(singleProperty, Country.Norway, 1);
test(singleProperty, Country.Poland, 0.9);
test(singleProperty, Country.Portugal, 0.8);
test(singleProperty, Country.Romania, 1, { large: false, data: wiki });
test(singleProperty, Country.Slovakia, 0.7, { large: false });
test(singleProperty, Country.Slovenia, 0.6);
test(singleProperty, Country.Spain, 1);
test(singleProperty, Country.Sweden, 1, {
  data: wiki,
  code: Property.StationCode,
});
test(singleProperty, Country.Switzerland, 0.8);
test(singleProperty, Country.Netherlands, 1, {
  data: wiki,
  code: Property.StationCode,
});
test(singleProperty, Country.UnitedKingdom, 1, { code: CodeIssuer.ATOC });

test(labelLanguage, euafrLocations, wiki)