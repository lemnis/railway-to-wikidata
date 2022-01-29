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
  import("./providers/sncf")
    .then((i) => i.getGaresVoyageurs())
    .then((locations) =>
      exportGeoJSON(locations, __dirname + "/../geojson/sncf.geojson")
    ),
  import("./providers/sbb/didok")
    .then((i) => i.getLocations())
    .then((locations) =>
      exportGeoJSON(locations, __dirname + "/../geojson/sbb-didok.geojson")
    ),
  import("./providers/trainline")
    .then((i) => i.grouped())
    .then((stations) =>
      import("./providers/trainline")
        .then((i) => i.map)
        .then((map) => [
          stations.trainStations.map(map),
          stations.cities.map(map),
        ])
    )
    .then(([stations, cities]) =>
      Promise.all([
        exportGeoJSON(
          stations,
          __dirname + "/../geojson/trainline-stations.geojson"
        ),
        exportGeoJSON(
          cities,
          __dirname + "/../geojson/trainline-cities.geojson"
        )
      ])
    ),
]);
