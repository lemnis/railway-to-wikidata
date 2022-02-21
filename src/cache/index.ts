import { LocationV4 } from "../types/location";
import { promises as fs } from "fs";
import { createFeatureCollection, createGeoFeature } from "../actions/geojson";
import { Feature } from "geojson";
import { refreshDatabase } from "./properties";

const exportGeoJSON = (locations: LocationV4[], path: string) => {
  const features = locations
    .map((location) => createGeoFeature(location))
    .filter((x): x is Feature => !!x);
  const collection = createFeatureCollection(features);
  return fs.writeFile(path, JSON.stringify(collection, null, 2));
};

const standardProviders: string[] = [
  "cp",
  "es-renfe",
  "fs-sncf",
  "lt-litrail",
//   "pkp",
//   "cp",
//   "golemio",
//   "digitraffic",
//   "trenitalia",
//   "atoc",
//   "romania",
//   "entur",
//   "ns",
//   "trafiklab",
//   "db",
//   "travel-status-de-iris",
//   "sk",
//   "irish-rail",
//   "mav",
//   "visimarsrutai",
//   "rigassatiksme",
//   "sbb/didok",
//   "irail",
//   "obb",
//   "train-ose",
//   "openov",
//   "peatus",
];

standardProviders.forEach((name) => {
  import(`../providers/${name}`)
    .then(({ getLocations }) => getLocations())
    .then((locations) =>
      exportGeoJSON(locations, `${__dirname}/../../geojson/${name}.geojson`)
    );
});

refreshDatabase();
