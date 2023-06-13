import { Country, CountryInfo } from "../../transform/country";
import { CodeIssuer, Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { promises as fs } from "fs";
import { matchAndMerge, merge } from ".";
import { createFeatureCollection } from "../cache/geojson";
import sortJson from "sort-json";
import { FeatureCollection, Point, point } from "@turf/turf";
import { feature } from "@ideditor/country-coder";
import path from "path";
import { logger } from "../../utils/logger";

const projectRoot = path.join(__dirname, "../../../");

console.log("Starting...", projectRoot);

async function importLocations(file: string) {
  const data = await fs.readFile(file, "utf8");
  logger.debug(`Import ${path.relative(projectRoot, file)}`);
  return JSON.parse(data).features as Location[];
}

const filter = (country: CountryInfo) => (feature: Location) =>
  feature.properties?.[Property.Country]?.some(
    ({ value }) => value === country.wikidata
  ) &&
  (Array.isArray(feature.properties.info?.enabled) ||
    [undefined, true].includes(feature.properties.info?.enabled as any));

const GeoJSONPath = projectRoot + "/geojson";

const folder = projectRoot + "/hafas-full";
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
          [CodeIssuer.IBNR]: [
            { value: i.properties?.id, info: { enabled: ["hafas"] } },
          ],
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

  const wikidata = await Promise.all(
    (
      await fs.readdir(`${GeoJSONPath}/wikidata`)
    ).map((file) => {
      if (!file.endsWith(".geojson")) return [];
      return importLocations(`${GeoJSONPath}/wikidata/${file}`);
    })
  ).then((items) => items.flat());
  console.log(wikidata.length);

  const cache: Record<string, Promise<Location[]>> = {};
  const load = (name: string) => {
    if ((cache as any)[name]) return cache[name];
    const loc = importLocations(`${GeoJSONPath}/${name}.geojson`);
    cache[name] = loc;
    return loc;
  };

  const generate = async (
    base: Location[],
    others: Location[][],
    country: CountryInfo
  ) => {
    const k = base.filter(filter(country));
    const result = k;
    const mergeLocation = async (a: Location, b: Location) => {
      result[result.indexOf(a)] = (await merge([a, b], false)) as Location;
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
    const euafrSize = (await load("_euafr")).filter(filter(country))?.length;
    const irisSize = (await load("_iris")).filter(filter(country))?.length;
    const hafasSize = fullHafas.filter(filter(country))?.length;
    const trainlineSize = (await load("trainline-stations")).filter(
      filter(country)
    )?.length;
    console.log(`Original size ${orignalSize}`);
    // if (others.includes(euafr) && euafrSize > orignalSize)
    console.log(`Euafr size ${euafrSize}`);
    if (others.includes(await load("_iris")) && irisSize > orignalSize)
      console.log(`iris size ${irisSize}`);
    if (others.includes(fullHafas) && hafasSize > orignalSize)
      console.log(`Hafas size ${hafasSize}`);
    if (
      others.includes(await load("trainline-stations")) &&
      trainlineSize > orignalSize
    )
      console.log(`Trainline size ${trainlineSize}`);

    console.log();
  };

  await generate(
    await load("be-irail"),
    [
      fullHafas,
      await load("_euafr"),
      await load("cz-regiojet"),
      await load("lu-openov"),
      await load("nl-ns"),
      await load("nl-ns-international"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Belgium
  );
  await generate(
    await load("_euafr"),
    [
      await load("bg-bdz"),
      fullHafas,
      await load("nl-ns-international"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Bulgaria
  );
  await generate(
    await load("ee-peatus"),
    [
      fullHafas,
      await load("nl-ns-international"),
      await load("_euafr"),
      wikidata,
    ],
    Country.Estonia
  );
  await generate(
    await load("es-renfe"),
    [
      fullHafas,
      await load("_euafr"),
      await load("pt-cp"),
      await load("trainline-stations"),
      await load("nl-ns-international"),
      wikidata,
    ],
    Country.Spain
  );
  await generate(
    await load("gr-train-ose"),
    [
      fullHafas,
      await load("trainline-stations"),
      await load("nl-ns-international"),
      wikidata,
    ],
    Country.Greece
  );
  await generate(
    await load("sk-zsr"),
    [
      await load("nl-ns-international"),
      await load("at-oebb"),
      await load("_euafr"),
      fullHafas,
      await load("_iris"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Slovakia
  );

  await generate(
    await load("it-trenitalia"),
    [
      await load("nl-ns-international"),
      await load("ch-sbb"),
      await load("at-oebb"),
      await load("_euafr"),
      fullHafas,
      await load("_iris"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Italy
  );
  await generate(
    await load("lt-litrail"),
    [
      fullHafas,
      await load("nl-ns-international"),
      await load("_euafr"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Lithuania
  );
  await generate(
    await load("nl-ns"),
    [
      await load("nl-ns-international"),
      await load("_euafr"),
      fullHafas,
      await load("_iris"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Netherlands
  );
  await generate(
    await load("pt-cp"),
    [
      await load("_euafr"),
      await load("es-renfe"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Portugal
  );
  await generate(
    await load("ro-gov"),
    [
      await load("nl-ns-international"),
      await load("at-oebb"),
      fullHafas,
      await load("_iris"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Romania
  );
  await generate(
    await load("se-trafiklab"),
    [
      await load("se-sj"),
      await load("no-entur"),
      await load("_euafr"),
      fullHafas,
      await load("_iris"),
      await load("nl-ns-international"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Sweden
  );
  await generate(
    await load("_euafr"),
    [
      await load("trainline-stations"),
      await load("at-oebb"),
      await load("cz-leo-express"),
      await load("nl-ns-international"),
      await load("pl-pkp"),
      await load("sk-zsr"),
      fullHafas,
      await load("_iris"),
      await load("cz-regiojet"),
      wikidata,
    ],
    Country.Czech
  );
  await generate(
    await load("hr-hzpp"),
    [
      await load("_euafr"),
      fullHafas,
      await load("_iris"),
      await load("at-oebb"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Croatia
  );
  await generate(
    await load("_euafr"),
    [
      await load("dk-rejseplanen"),
      fullHafas,
      await load("_iris"),
      await load("nl-ns-international"),
      await load("se-trafiklab"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Denmark
  );
  await generate(
    await load("fi-digitraffic"),
    [
      fullHafas,
      await load("nl-ns-international"),
      await load("_euafr"),
      wikidata,
    ],
    Country.Finland
  );
  await generate(
    await load("fr-sncf"),
    [
      await load("_euafr"),
      fullHafas,
      await load("_iris"),
      await load("es-renfe"),
      await load("lu-openov"),
      await load("nl-ns-international"),
      await load("nl-ns"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.France
  );
  await generate(
    await load("ie-irish-rail"),
    [fullHafas, await load("trainline-stations"), wikidata],
    Country.Ireland
  );
  await generate(
    await load("ch-sbb"),
    [
      await load("_euafr"),
      fullHafas,
      await load("_iris"),
      await load("at-oebb"),
      await load("nl-ns-international"),
      await load("nl-ns"),
      await load("sk-zsr"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Switzerland
  );
  await generate(
    [...(await load("gb-atoc")), ...(await load("ie-irish-rail"))],
    [
      fullHafas,
      await load("nl-ns"),
      await load("nl-ns-international"),
      await load("trainline-stations"),
      await load("_euafr"),
      wikidata,
    ],
    Country.UnitedKingdom
  );
  await generate(
    await load("_euafr"),
    [
      fullHafas,
      await load("_iris"),
      await load("at-oebb"),
      await load("cz-regiojet"),
      await load("nl-ns-international"),
      await load("sk-zsr"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Slovenia
  );
  await generate(
    await load("pl-pkp"),
    [
      await load("_euafr"),
      fullHafas,
      await load("_iris"),
      await load("at-oebb"),
      await load("cz-leo-express"),
      await load("cz-regiojet"),
      await load("nl-ns-international"),
      await load("sk-zsr"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Poland
  );
  await generate(
    await load("no-entur"),
    [
      fullHafas,
      await load("_euafr"),
      await load("nl-ns-international"),
      await load("se-trafiklab"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Norway
  );
  await generate(
    await load("lu-openov"),
    [
      await load("_euafr"),
      fullHafas,
      await load("_iris"),
      await load("cz-regiojet"),
      await load("nl-ns-international"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Luxembourg
  );
  await generate(
    await load("_euafr"),
    [
      fullHafas,
      await load("nl-ns-international"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Latvia
  );
  await generate(
    await load("hu-mav"),
    [
      await load("_euafr"),
      fullHafas,
      await load("_iris"),
      await load("at-oebb"),
      await load("cz-regiojet"),
      await load("nl-ns-international"),
      await load("ro-gov"),
      await load("sk-zsr"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Hungary
  );
  await generate(
    await load("de-db"),
    [
      await load("_euafr"),
      fullHafas,
      await load("_iris"),
      await load("at-oebb"),
      await load("ch-sbb"),
      await load("cz-leo-express"),
      await load("trainline-stations"),
      await load("lu-openov"),
      await load("nl-ns"),
      await load("nl-ns-international"),
      await load("pl-pkp"),
      await load("se-trafiklab"),
      await load("sk-zsr"),
      wikidata,
    ],
    Country.Germany
  );
  await generate(
    await load("at-oebb"),
    [
      await load("_euafr"),
      fullHafas,
      await load("_iris"),
      await load("ch-sbb"),
      await load("cz-leo-express"),
      await load("nl-ns"),
      await load("nl-ns-international"),
      await load("se-trafiklab"),
      await load("sk-zsr"),
      await load("trainline-stations"),
      wikidata,
    ],
    Country.Austria
  );
})();
