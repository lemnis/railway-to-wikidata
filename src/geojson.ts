import { LocationV4 } from "./types/location";
import { promises as fs } from "fs";
import { createFeatureCollection, createGeoFeature } from "./actions/geojson";
import { Feature } from "geojson";

const exportGeoJSON = (locations: LocationV4[], path: string) => {
  const features = locations
    .map((location) => createGeoFeature(location))
    .filter((x): x is Feature => !!x);
  const collection = createFeatureCollection(features);
  return fs.writeFile(path, JSON.stringify(collection, null, 2));
};

Promise.all([
  import("./providers/renfe")
    .then((i) => i.getLocations())
    .then((locations) =>
      exportGeoJSON(locations, __dirname + "/../geojson/renfe.geojson")
    ),
  import("./providers/cp")
    .then((i) => i.getLocations())
    .then((locations) =>
      exportGeoJSON(locations, __dirname + "/../geojson/cp.geojson")
    ),
  import("./providers/ns")
    .then((i) => i.getLocations())
    .then((locations) =>
      exportGeoJSON(locations, __dirname + "/../geojson/ns.geojson")
    ),
  import("./providers/db")
    .then((i) => i.getLocations())
    .then((locations) =>
      exportGeoJSON(locations, __dirname + "/../geojson/db.geojson")
    ),
  import("./providers/digitraffic")
    .then((i) => i.getLocations())
    .then((locations) =>
      exportGeoJSON(locations, __dirname + "/../geojson/digitraffic.geojson")
    ),
  import("./providers/sbb")
    .then((i) => i.getLocations())
    .then((locations) =>
      exportGeoJSON(locations, __dirname + "/../geojson/sbb.geojson")
    ),
  import("./providers/sncf")
    .then((i) => i.getGaresVoyageurs())
    .then((locations) =>
      exportGeoJSON(locations, __dirname + "/../geojson/sncf.geojson")
    ),
]);
