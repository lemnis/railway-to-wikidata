import { parse } from "csv-parse";
import {
  TrainlineStation,
  TrainlineStationProperties,
  RawTrainlineStation,
} from "./trainline.types";
import fetch from "node-fetch";
import { multiPoint, point } from "@turf/turf";

type KeysOfType<O, T> = {
  [K in keyof O]: O[K] extends T ? K : never;
}[keyof O];

const isStringifiedBoolean = (
  station: RawTrainlineStation,
  key: keyof RawTrainlineStation
): key is Exclude<
  KeysOfType<TrainlineStationProperties, boolean>,
  undefined
> => {
  return station[key] === "f" || station[key] === "t";
};

export const getStations = async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/trainline-eu/stations/master/stations.csv"
  );
  const rawCsv = await response.text();

  return new Promise<TrainlineStation[]>((resolve, reject) =>
    parse(
      rawCsv,
      {
        delimiter: ";",
        columns: true,
      },
      (error, data) => {
        if (error) reject(error);

        resolve(
          data.map((station: RawTrainlineStation) => {
            let latitude: number, longitude: number;
            const properties: Partial<TrainlineStationProperties> = {};
            let key: keyof TrainlineStationProperties;

            for (key in station) {
              if (Object.prototype.hasOwnProperty.call(station, key)) {
                if (station[key] && key === "longitude") {
                  longitude = parseFloat(station[key]);
                } else if (station[key] && key === "latitude") {
                  latitude = parseFloat(station[key]);
                }

                if (isStringifiedBoolean(station, key)) {
                  properties[key] = station[key] === "f" ? false : true;
                } else if (station[key]) {
                  properties[key] = station[key];
                }
              }
            }

            if (latitude! && longitude!) {
              return point([longitude, latitude], properties, {
                id: station.id,
              });
            } else {
              return multiPoint([], properties, { id: station.id });
            }
          })
        );
      }
    )
  );
};
