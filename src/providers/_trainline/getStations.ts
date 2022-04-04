import { parse } from "csv-parse/sync";
import { TrainlineStation } from "./trainline.types";
import fetch from "node-fetch";

export const getStations = async (): Promise<TrainlineStation[]> => {
  const rawCsv = await fetch(
    "https://raw.githubusercontent.com/trainline-eu/stations/master/stations.csv"
  ).then((response) => response.text());
  return parse(rawCsv, {
    delimiter: ";",
    columns: true,
  }).map((station: any) => {
    let latitude: number, longitude: number;
    for (const key in station) {
      if (Object.prototype.hasOwnProperty.call(station, key)) {
        const value = station[key];
        if (key.endsWith("_is_enabled") && value === "f") {
          delete station[key];
          continue;
        } else if (value && key === "longitude") {
          longitude = parseFloat(value);
        } else if (value && key === "latitude") {
          latitude = parseFloat(value);
        }
        switch (value) {
          case "":
            delete station[key];
            break;
          case "f":
            station[key] = false;
            break;
          case "t":
            station[key] = true;
            break;
        }
      }
    }
    if (latitude! && longitude!) station.coordinates = [latitude!, longitude!];
    return station;
  });
};
