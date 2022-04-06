import { Country, CountryInfo } from "../../transform/country";
import { Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { promises as fs } from "fs";
import { matchAndMerge, merge as mergeMultipleEntities } from ".";
import { createFeatureCollection } from "../cache/geojson";

async function importLocations(file: string) {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data).features as Location[];
}

const filter = (country: CountryInfo) => (feature: Location) =>
  feature.properties?.[Property.Country]?.every(
    ({ value }) => value === country.wikidata
  );

const generate = async (
  base: Location[],
  others: Location[][],
  country: CountryInfo
) => {
  const k = base.filter(filter(country));
  const result = k;
  const mergeLocation = async (item: Location, i: Location) => {
    result[result.indexOf(item)] = (await mergeMultipleEntities(
      [item, i],
      true
    )) as Location;
  };

  for await (const iterator of others) {
    await matchAndMerge(k, iterator.filter(filter(country)), mergeLocation);
  }

  await fs.writeFile(
    `docs/_data/${country.alpha2}.json`,
    JSON.stringify(createFeatureCollection(result), null, 2)
  );
  console.log(country.alpha2, result.length);
};

const GeoJSONPath = __dirname + "/../../../geojson";

(async () => {
  const nsInternational = await importLocations(
    `${GeoJSONPath}/nl-ns-international.geojson`
  );
  const euafr = await importLocations(`${GeoJSONPath}/_euafr.geojson`);
  const trainline = await importLocations(
    `${GeoJSONPath}/trainline-stations.geojson`
  );
  const wikidata = await importLocations(
    `${GeoJSONPath}/wikidata-railway-stations.geojson`
  );
  const irail = await importLocations(`${GeoJSONPath}/be-irail.geojson`);
  const ns = await importLocations(`${GeoJSONPath}/nl-ns.geojson`);
  const openov = await importLocations(`${GeoJSONPath}/lu-openov.geojson`);
  const iris = await importLocations(`${GeoJSONPath}/_iris.geojson`);
  const golemio = await importLocations(`${GeoJSONPath}/cz-golemio.geojson`);
  const leoExpress = await importLocations(
    `${GeoJSONPath}/cz-leo-express.geojson`
  );
  const cp = await importLocations(`${GeoJSONPath}/pt-cp.geojson`);
  const oebb = await importLocations(`${GeoJSONPath}/at-oebb.geojson`);
  const peatus = await importLocations(`${GeoJSONPath}/ee-peatus.geojson`);
  const pkp = await importLocations(`${GeoJSONPath}/pl-pkp.geojson`);
  const renfe = await importLocations(`${GeoJSONPath}/es-renfe.geojson`);
  const sbb = await importLocations(`${GeoJSONPath}/ch-sbb.geojson`);
  const trainOse = await importLocations(`${GeoJSONPath}/gr-train-ose.geojson`);
  const mav = await importLocations(`${GeoJSONPath}/hu-mav.geojson`);
  const regiojet = await importLocations(`${GeoJSONPath}/cz-regiojet.geojson`);
  const zsr = await importLocations(`${GeoJSONPath}/sk-zsr.geojson`);
  const atoc = await importLocations(`${GeoJSONPath}/uk-atoc.geojson`);
  const irishRail = await importLocations(
    `${GeoJSONPath}/ie-irish-rail.geojson`
  );
  const hzpp = await importLocations(`${GeoJSONPath}/hr-hzpp.geojson`);
  const digitraffic = await importLocations(
    `${GeoJSONPath}/fi-digitraffic.geojson`
  );
  const trenitalia = await importLocations(
    `${GeoJSONPath}/it-trenitalia.geojson`
  );
  const trafiklab = await importLocations(
    `${GeoJSONPath}/se-trafiklab.geojson`
  );
  const db = await importLocations(`${GeoJSONPath}/de-db.geojson`);
  const litrail = await importLocations(`${GeoJSONPath}/lt-litrail.geojson`);
  const gov = await importLocations(`${GeoJSONPath}/ro-gov.geojson`);
  const entur = await importLocations(`${GeoJSONPath}/no-entur.geojson`);
  const sncf = await importLocations(`${GeoJSONPath}/fr-sncf.geojson`);

  await generate(
    irail,
    [euafr, regiojet, openov, ns, nsInternational, trainline, wikidata],
    Country.Belgium
  );
  await generate(
    euafr,
    [nsInternational, trainline, wikidata],
    Country.Bulgaria
  );
  await generate(peatus, [nsInternational, euafr, wikidata], Country.Estonia);
  await generate(renfe, [euafr, cp, trainline, nsInternational], Country.Spain);
  await generate(
    trainOse,
    [trainline, nsInternational, wikidata],
    Country.Greece
  );
  await generate(
    zsr,
    [nsInternational, oebb, euafr, iris, trainline, wikidata],
    Country.Slovakia
  );

  await generate(
    trenitalia,
    [nsInternational, sbb, oebb, euafr, iris, trainline],
    Country.Italy
  );
  await generate(
    litrail,
    [nsInternational, euafr, trainline, wikidata],
    Country.Lithuania
  );
  // TODO: has wikidata currently
  await generate(
    ns,
    [nsInternational, euafr, iris, trainline],
    Country.Netherlands
  );
  await generate(cp, [euafr, renfe, trainline], Country.Portugal);
  await generate(
    gov,
    [nsInternational, euafr, oebb, iris, trainline, wikidata],
    Country.Romania
  );
  await generate(
    trafiklab,
    [entur, euafr, iris, nsInternational, trainline, wikidata],
    Country.Sweden
  );
  await generate(
    euafr,
    [trainline, oebb, leoExpress, nsInternational, pkp, zsr, iris, regiojet],
    Country.Czech
  );
  await generate(hzpp, [euafr, iris, oebb, trainline], Country.Croatia);
  await generate(
    euafr,
    [iris, nsInternational, trafiklab, trainline, wikidata],
    Country.Denmark
  );
  await generate(digitraffic, [nsInternational, euafr], Country.Finland);
  await generate(
    sncf,
    [euafr, iris, renfe, openov, nsInternational, ns, trainline],
    Country.France
  );
  await generate(irishRail, [trainline], Country.Ireland);
  await generate(
    sbb,
    [euafr, iris, oebb, nsInternational, ns, zsr, trainline],
    Country.Switzerland
  );
  await generate(
    atoc,
    [ns, nsInternational, irishRail, trainline, euafr],
    Country.UnitedKingdom
  );
  await generate(
    euafr,
    [iris, oebb, regiojet, nsInternational, zsr, trainline],
    Country.Slovenia
  );
  await generate(
    pkp,
    [euafr, iris, oebb, leoExpress, regiojet, nsInternational, zsr, trainline],
    Country.Poland
  );
  await generate(
    entur,
    [euafr, nsInternational, trafiklab, trainline],
    Country.Norway
  );
  await generate(
    openov,
    [euafr, iris, regiojet, nsInternational, trainline, wikidata],
    Country.Luxembourg
  );
  await generate(euafr, [nsInternational, trainline, wikidata], Country.Latvia);
  await generate(
    mav,
    [
      euafr,
      iris,
      oebb,
      regiojet,
      nsInternational,
      gov,
      zsr,
      trainline,
      wikidata,
    ],
    Country.Hungary
  );
  await generate(
    db,
    [
      euafr,
      iris,
      oebb,
      sbb,
      leoExpress,
      trainline,
      openov,
      ns,
      nsInternational,
      pkp,
      trafiklab,
      zsr,
    ],
    Country.Germany
  );
  await generate(
    oebb,
    [
      euafr,
      iris,
      sbb,
      leoExpress,
      ns,
      nsInternational,
      trafiklab,
      zsr,
      trainline,
    ],
    Country.Austria
  );
})();
