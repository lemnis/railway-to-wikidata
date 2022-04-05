import { promises as fs } from "fs";
import { createFeatureCollection } from "./geojson";
import { refreshDatabase } from "./properties";
import inquirer from "inquirer";
import {
  getAllRailwayStations,
  getUICRailwayStations,
} from "../../providers/wikidata";
import { db } from "../../utils/database";
import { getUicLocations } from "../../providers/osm/uic";
import { filter, mergeMap, of, tap } from "rxjs";

const srcPath = `${__dirname}/../..`;
const geoJSONPath = `${srcPath}/../geojson`;

const questions = [
  {
    type: "confirm",
    name: "database",
    message: "Do you want to refresh the database?",
    default: false,
  },
  {
    type: "confirm",
    name: "wikidata",
    message: "Do you want to update the wikidata geojson?",
    default: false,
  },
  {
    type: "confirm",
    name: "osmUic",
    message: "Do you want to update the OSM UIC geojson?",
    default: false,
  },
  {
    type: "confirm",
    name: "osm",
    message: "Do you want to update all OSM stations & tracks geojson?",
    default: false,
  },
  {
    type: "checkbox",
    name: "geojson",
    message:
      "For which providers do you want to generate a geoJSON? (Slow ones are disabled by default)",
    choices: [
      { value: "_euafr", checked: true },
      { value: "_iris", checked: true },
      { value: "at-oebb", checked: true },
      { value: "be-irail", checked: true },
      { value: "ch-sbb", checked: true },
      { value: "cz-golemio", checked: true },
      { value: "cz-leo-express", checked: true },
      { value: "cz-regiojet", checked: true },
      { value: "de-db", checked: true },
      { value: "ee-peatus", checked: true },
      { value: "es-renfe", checked: true },
      { value: "fi-digitraffic", checked: true },
      { value: "fr-sncf", checked: true },
      { value: "gr-train-ose", checked: true },
      { value: "hr-hzpp", checked: true },
      { value: "hu-mav", checked: true },
      { value: "ie-irish-rail", checked: true },
      { value: "it-trenitalia", checked: true },
      { value: "lt-litrail", checked: true },
      { value: "lv-ldz", checked: true },
      { value: "lu-openov", checked: true },
      { value: "nl-ns", checked: true },
      { value: "nl-ns-international", checked: true },
      { value: "no-entur", checked: true },
      { value: "pl-pkp", checked: true },
      { value: "pt-cp", checked: true },
      { value: "ro-gov", checked: true },
      { value: "sk-zsr", checked: true },
      { value: "uk-atoc", checked: true },
      {
        value: "_trainline",
        short: "trainline",
        name: "_trainline (slow)",
        checke: false,
      },
      {
        value: "se-trafiklab",
        short: "se-trafiklab",
        name: "se-trafilab (slow)",
        checked: false,
      },
    ],
  },
];

const prompt = inquirer.createPromptModule();
(async () => {
  const {
    database,
    wikidata,
    osmUic,
    osm,
    geojson = [],
  }: {
    database: boolean;
    osmUic: boolean;
    osm: boolean;
    geojson: string[];
    wikidata: boolean;
  } = process.argv.includes("--config")
    ? JSON.parse(process.argv[process.argv.indexOf("--config") + 1])
    : await prompt(questions);

  if (database) await refreshDatabase();
  if (wikidata) {
    let d: any[] = [];
    (await getAllRailwayStations()).subscribe((i) => {
      d = [...d, ...i];
      console.log(d.length);
      fs.writeFile(
        `${geoJSONPath}/wikidata-railway-stations.geojson`,
        JSON.stringify(createFeatureCollection(d), null, 2)
      );
      console.log("Updated wikidata");
    });
    const { data: uic } = await getUICRailwayStations();
    fs.writeFile(
      `${geoJSONPath}/uic/wikidata.geojson`,
      JSON.stringify(createFeatureCollection(uic), null, 2)
    );
  }

  if (osmUic) {
    const { data: uic, query } = await getUICRailwayStations();
    fs.writeFile(
      `${geoJSONPath}/uic/wikidata.geojson`,
      JSON.stringify(createFeatureCollection(uic), null, 2)
    );

    getUicLocations().subscribe(([countries, data]) => {
      return fs.writeFile(
        `${geoJSONPath}/uic/osm-${countries.join("-")}.geojson`,
        JSON.stringify(data, null, 2)
      );
    });
  }

  if (osm) {
    await import("../../providers/osm")
      .then(({ getTracks }) => getTracks())
      .then((tracks) => {
        tracks
          .pipe(
            tap((i) => console.log("writing", i[0])),
            mergeMap((geojson: any[]) => {
              return of(
                fs.writeFile(
                  `${geoJSONPath}/tracks/${geojson[0]}.geojson`,
                  JSON.stringify(geojson[1], null, 2)
                )
              );
            })
          )
          .subscribe(() => {});
      });
    await import("../../providers/osm")
      .then(({ getStations }) => getStations())
      .then((stations) => {
        stations
          .pipe(
            // Filter out empty geojson files
            // as result failing api request or country without locations
            filter((i) => i[1].features),
            tap((i) => console.log("writing", i[0])),
            mergeMap((geojson: any[]) => {
              return of(
                fs.writeFile(
                  `${geoJSONPath}/stations/${geojson[0]}.geojson`,
                  JSON.stringify(geojson[1], null, 2)
                )
              );
            })
          )
          .subscribe(() => {});
      });
  }

  await Promise.all(
    geojson.map(async (name) => {
      if (name === "_trainline") {
        await import("../../providers/_trainline").then(
          async ({
            getGroupedTrainlineLocations,
            trainlineArrayToLocation,
          }) => {
            const { trainStations, cities } =
              await getGroupedTrainlineLocations();

            fs.writeFile(
              `${geoJSONPath}/trainline-stations.geojson`,
              JSON.stringify(
                createFeatureCollection(
                  await Promise.all(trainStations.map(trainlineArrayToLocation))
                ),
                null,
                2
              )
            );
            fs.writeFile(
              `${geoJSONPath}/trainline-cities.geojson`,
              JSON.stringify(
                createFeatureCollection(
                  await Promise.all(cities.map(trainlineArrayToLocation))
                ),
                null,
                2
              )
            );
          }
        );
      } else {
        await import(`../../providers/${name}`).then(
          async ({ getLocations }) => {
            fs.writeFile(
              `${geoJSONPath}/${name}.geojson`,
              JSON.stringify(
                createFeatureCollection(await getLocations()),
                null,
                2
              )
            );
          }
        );
      }
      console.log("Updated " + name);
    })
  );

  db.close();

  console.log(
    "Config used:",
    JSON.stringify({
      database,
      wikidata,
      geojson,
      osm,
    })
  );
})();
