import { LocationV4, Location } from "../../types/location";
import { promises as fs } from "fs";
import { createFeatureCollection, createGeoFeature } from "../geojson";
import { refreshDatabase } from "./properties";
import { generateNavitiaGeoJSON } from "./navitia";
import inquirer from "inquirer";
import {
  getAllRailwayStations,
  getUICRailwayStations,
} from "../../providers/wikidata";
import { db } from "../../utils/database";
import { getUicLocations } from "../../providers/osm/uic";
import { filter, mergeMap, of, tap } from "rxjs";

const geoJSONPath = `${__dirname}/../../geojson`;

export const exportGeoJSON = (locations: LocationV4[], path: string) => {
  const features = locations
    .map((location) => createGeoFeature(location))
    .filter((x): x is Location => !!x);
  const collection = createFeatureCollection(features);
  return fs.writeFile(path, JSON.stringify(collection, null, 2));
};

const questions = [
  {
    type: "confirm",
    name: "navitia",
    message:
      "Do you want to generate navitia files? (this can take more than 1+ hour)",
    default: false,
  },
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
      { value: "de-db", checked: true },
      { value: "ee-peatus", checked: true },
      { value: "es-renfe", checked: true },
      { value: "fi-digitraffic", checked: true },
      { value: "fr-sncf", checked: true },
      { value: "hr-hzpp", checked: true },
      { value: "hu-mav", checked: true },
      { value: "ie-irish-rail", checked: true },
      { value: "lt-litrail", checked: true },
      { value: "lv-ldz", checked: true },
      { value: "lv-rigassatiksme", checked: true },
      { value: "lu-openov", checked: true },
      { value: "nl-ns", checked: true },
      { value: "no-entur", checked: true },
      { value: "pl-pkp", checked: true },
      { value: "pt-cp", checked: true },
      { value: "ro-gov", checked: true },
      { value: "sk-zsr", checked: true },
      { value: "uk-atoc", checked: true },
      // "it-trenitalia",
      // "lt-visimarsrutai",
      //   "train-ose",
      {
        value: "trainline",
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
      {
        value: "gr-train-ose",
        short: "gr-train-ose",
        name: "gr-train-ose (API out of use)",
        checked: false,
      },
    ],
  },
];

const prompt = inquirer.createPromptModule();
(async () => {
  const {
    navitia,
    database,
    wikidata,
    osmUic,
    osm,
    geojson = [],
  }: {
    navitia: boolean;
    database: boolean;
    osmUic: boolean;
    osm: boolean;
    geojson: string[];
    wikidata: boolean;
  } = process.argv.includes("--config")
    ? JSON.parse(process.argv[process.argv.indexOf("--config") + 1])
    : await prompt(questions);

  if (database) await refreshDatabase();
  if (navitia) await generateNavitiaGeoJSON();
  if (wikidata) {
    const { data, query } = await getAllRailwayStations();
    const { data: uic } = await getUICRailwayStations();
    console.log(query);
    await exportGeoJSON(
      data,
      `${geoJSONPath}/wikidata-railway-stations.geojson`
    );
    await exportGeoJSON(uic, `${geoJSONPath}/wikidata-uic-stations.geojson`);
    console.log("Updated wikidata");
  }

  if (osmUic) {
    const { data: uic, query } = await getUICRailwayStations();
    console.log(query);
    await exportGeoJSON(uic, `${geoJSONPath}/uic/wikidata.geojson`);
    getUicLocations().subscribe(([countries, data]) => {
      return fs.writeFile(
        `${geoJSONPath}/uic/osm-${countries.join("-")}.geojson`,
        JSON.stringify(data, null, 2)
      );
    });
  }

  if (osm) {
    import("../../providers/osm")
      .then((i) => i.getTracks())
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
    import("../../providers/osm")
      .then((i) => i.getStations())
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
      if (name === "trainline") {
        import("../../providers/trainline").then(
          async ({
            getGroupedTrainlineLocations,
            trainlineArrayToLocation,
          }) => {
            const { trainStations, cities } =
              await getGroupedTrainlineLocations();
            const stations = await Promise.all(
              trainStations.map(trainlineArrayToLocation)
            );
            const city = await Promise.all(
              cities.map(trainlineArrayToLocation)
            );

            exportGeoJSON(
              stations,
              `${geoJSONPath}/trainline-stations.geojson`
            );
            exportGeoJSON(city, `${geoJSONPath}/trainline-cities.geojson`);
          }
        );
      } else {
        import(`../providers/${name}`).then(async ({ getLocations }) => {
          if (
            [
              "pt-cp",
              "sk-zsr",
              "at-oebb",
              "lt-litrail",
              "ro-gov",
              "ee-peatus",
              "lv-rigassatiksme",
              "_iris",
            ].includes(name)
          ) {
            fs.writeFile(
              `${geoJSONPath}/${name}.geojson`,
              JSON.stringify(
                createFeatureCollection(await getLocations()),
                null,
                2
              )
            );
          } else {
            exportGeoJSON(
              await getLocations(),
              `${geoJSONPath}/${name}.geojson`
            );
          }
        });
      }
      console.log("Updated " + name);
    })
  );

  db.close();

  console.log(
    "Config used:",
    JSON.stringify({
      navitia,
      database,
      wikidata,
      geojson,
      osm,
    })
  );
})();