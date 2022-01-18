import extract from "extract-zip";
import { promises as fs, constants } from "fs";
import fetch from "node-fetch";
// import tempy from "tempy";
import { parse } from "csv-parse/sync";

const dir = __dirname + "/../../.cache";

export const getGtfsStations = async <
  T extends {
    stop_id: string;
    stop_name: string;
    stop_lat: string;
    stop_lon: string;
    location_type?: string;
    wheelchair_boarding?: '0' | '1' | '2'
  }
>(
  url: string,
  name: string,
  cache = true
): Promise<T[]> => {
  const cachePath = dir + "/" + name;
  if (
    !cache ||
    !(await fs.access(cachePath + ".zip", constants.F_OK).then(
      () => true,
      () => false
    ))
  ) {
    const response = await fetch(url);
    const zip = await response.arrayBuffer();
    await fs.writeFile(cachePath + ".zip", Buffer.from(zip));
    await extract(cachePath + ".zip", { dir: cachePath });
  }

  const stops = await fs.readFile(cachePath + "/stops.txt");
  return parse(stops, {
    columns: true,
    skipEmptyLines: true,
    trim: true,
    cast: false,
  });
};
