import { Country, CountryInfo } from "../../transform/country";
import { CodeIssuer, Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { promises as fs } from "fs";
import { matchAndMerge, merge } from ".";
import { createFeatureCollection } from "../cache/geojson";
import sortJson from "sort-json";
import { FeatureCollection, Point, point } from "@turf/turf";
import { feature } from "@ideditor/country-coder";

console.log("Starting...");

async function importLocations(file: string) {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data).features as Location[];
}

const filter = (country: CountryInfo) => (feature: Location) =>
  feature.properties?.[Property.Country]?.every(
    ({ value }) => value === country.wikidata
  ) && [undefined, true].includes(feature.properties.info?.enabled);

const GeoJSONPath = __dirname + "/../../../geojson";

const folder = __dirname + "/../../../hafas-full";
const getStations = (geojson: FeatureCollection<Point>) =>
  geojson.features
    .filter(
      (i) =>
        i.properties?.products.nationalExpress ||
        i.properties?.products.national ||
        i.properties?.products.regionalExp ||
        i.properties?.products.regional ||
        i.properties?.products.suburban
    )
    .map((i) =>
      point(
        i.geometry.coordinates,
        {
          [CodeIssuer.IBNR]: [{ value: i.properties?.id }],
          [Property.Country]: [
            {
              value: feature(i.geometry.coordinates as any)?.properties
                .wikidata,
            },
          ],
          labels: [{ value: i.properties?.name }],
        },
        { id: i.properties?.id }
      )
    );

(async () => {
  const fullHafas = (
    await Promise.all(
      await fs.readdir(folder).then((files) => {
        return files
          .filter((file) => file.endsWith(".geojson"))
          .map((file) =>
            fs
              .readFile(folder + "/" + file, "utf-8")
              .then((i) => getStations(JSON.parse(i)))
          );
      })
    )
  ).flat(2);

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

  const generate = async (
    base: Location[],
    others: Location[][],
    country: CountryInfo
  ) => {
    const k = base.filter(filter(country));
    const result = k;
    const mergeLocation = async (item: Location, i: Location) => {
      result[result.indexOf(item)] = (await merge([item, i], true)) as Location;
    };

    for await (const iterator of others) {
      await matchAndMerge(k, iterator.filter(filter(country)), mergeLocation);
    }

    await fs.writeFile(
      `docs/_data/${country.alpha2}.json`,
      JSON.stringify(sortJson(createFeatureCollection(result)), null, 2)
    );

    console.log(
      `Finished ${
        Object.entries(Country).find((i) => i[1] === country)?.[0]
      }, locations found ${result.length}`
    );

    const orignalSize = base.filter(filter(country))?.length;
    const euafrSize = euafr.filter(filter(country))?.length;
    const irisSize = iris.filter(filter(country))?.length;
    const hafasSize = fullHafas.filter(filter(country))?.length;
    const trainlineSize = trainline.filter(filter(country))?.length;
    console.log(`Original size ${orignalSize}`);
    // if (others.includes(euafr) && euafrSize > orignalSize)
    console.log(`Euafr size ${euafrSize}`);
    if (others.includes(iris) && irisSize > orignalSize)
      console.log(`Iris size ${irisSize}`);
    if (others.includes(fullHafas) && hafasSize > orignalSize)
      console.log(`Hafas size ${hafasSize}`);
    if (others.includes(trainline) && trainlineSize > orignalSize)
      console.log(`Trainline size ${trainlineSize}`);

    console.log();
  };

  await generate(
    irail,
    [
      fullHafas,
      euafr,
      regiojet,
      openov,
      ns,
      nsInternational,
      trainline,
      wikidata,
    ],
    Country.Belgium
  );
  await generate(
    euafr,
    [fullHafas, nsInternational, trainline, wikidata],
    Country.Bulgaria
  );
  await generate(
    peatus,
    [fullHafas, nsInternational, euafr, wikidata],
    Country.Estonia
  );
  await generate(
    renfe,
    [fullHafas, euafr, cp, trainline, nsInternational, wikidata],
    Country.Spain
  );
  await generate(
    trainOse,
    [fullHafas, trainline, nsInternational, wikidata],
    Country.Greece
  );
  await generate(
    zsr,
    [nsInternational, oebb, euafr, fullHafas, iris, trainline, wikidata],
    Country.Slovakia
  );

  await generate(
    trenitalia,
    [nsInternational, sbb, oebb, euafr, fullHafas, iris, trainline, wikidata],
    Country.Italy
  );
  await generate(
    litrail,
    [fullHafas, nsInternational, euafr, trainline, wikidata, wikidata],
    Country.Lithuania
  );
  // TODO: has wikidata currently
  await generate(
    ns,
    [nsInternational, euafr, fullHafas, iris, trainline, wikidata],
    Country.Netherlands
  );
  await generate(cp, [euafr, renfe, trainline, wikidata], Country.Portugal);
  await generate(
    gov,
    [nsInternational, euafr, oebb, fullHafas, iris, trainline, wikidata],
    Country.Romania
  );
  await generate(
    trafiklab,
    [entur, euafr, fullHafas, iris, nsInternational, trainline, wikidata],
    Country.Sweden
  );
  await generate(
    euafr,
    [
      trainline,
      oebb,
      leoExpress,
      nsInternational,
      pkp,
      zsr,
      fullHafas,
      iris,
      regiojet,
      wikidata,
    ],
    Country.Czech
  );
  await generate(
    hzpp,
    [euafr, fullHafas, iris, oebb, trainline, wikidata],
    Country.Croatia
  );
  await generate(
    euafr,
    [fullHafas, iris, nsInternational, trafiklab, trainline, wikidata],
    Country.Denmark
  );
  await generate(
    digitraffic,
    [fullHafas, fullHafas, nsInternational, euafr, wikidata],
    Country.Finland
  );
  await generate(
    sncf,
    [
      euafr,
      fullHafas,
      iris,
      renfe,
      openov,
      nsInternational,
      ns,
      trainline,
      wikidata,
    ],
    Country.France
  );
  await generate(irishRail, [fullHafas, trainline, wikidata], Country.Ireland);
  await generate(
    sbb,
    [
      euafr,
      fullHafas,
      iris,
      oebb,
      nsInternational,
      ns,
      zsr,
      trainline,
      wikidata,
    ],
    Country.Switzerland
  );
  await generate(
    atoc,
    [fullHafas, ns, nsInternational, irishRail, trainline, euafr, wikidata],
    Country.UnitedKingdom
  );
  await generate(
    euafr,
    [
      fullHafas,
      iris,
      oebb,
      regiojet,
      nsInternational,
      zsr,
      trainline,
      wikidata,
    ],
    Country.Slovenia
  );
  await generate(
    pkp,
    [
      euafr,
      fullHafas,
      iris,
      oebb,
      leoExpress,
      regiojet,
      nsInternational,
      zsr,
      trainline,
      wikidata,
    ],
    Country.Poland
  );
  await generate(
    entur,
    [fullHafas, euafr, nsInternational, trafiklab, trainline, wikidata],
    Country.Norway
  );
  await generate(
    openov,
    [euafr, fullHafas, iris, regiojet, nsInternational, trainline, wikidata],
    Country.Luxembourg
  );
  await generate(
    euafr,
    [fullHafas, nsInternational, trainline, wikidata],
    Country.Latvia
  );
  await generate(
    mav,
    [
      euafr,
      fullHafas,
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
      fullHafas,
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
      wikidata,
    ],
    Country.Germany
  );
  await generate(
    oebb,
    [
      euafr,
      fullHafas,
      iris,
      sbb,
      leoExpress,
      ns,
      nsInternational,
      trafiklab,
      zsr,
      trainline,
      wikidata,
    ],
    Country.Austria
  );
})();
