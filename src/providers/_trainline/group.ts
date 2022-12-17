import ProgressBar from "progress";
import { logger } from "../../utils/logger";
import { TrainlineStation } from "./trainline.types";

let c = 0;

export const mergeAlias = (stations: TrainlineStation[]) => {
  const bar = new ProgressBar(
    "Combine aliases [:bar] :current/:total :percent :elapseds",
    { total: stations.length }
  );
  const aliased = stations.reduce((map, station) => {
    bar.tick();

    let id = station.properties.same_as || station.properties.id;

    let aliasList: TrainlineStation[] | undefined = [];

    if (station.properties.same_as) {
      // get alias
      aliasList = map.get(station.properties.same_as);
      if (!aliasList) {
        const alias = stations.find(({ id: currentId }) => currentId === id);
        if (alias) aliasList = [alias];
        if (alias?.properties.same_as) {
          logger.warn(
            `Found a alias who as another alias from: ${station.id} alias: ${alias?.properties.same_as}`
          );
        }
      }

      if (!aliasList || aliasList.length === 0) {
        logger.warn(`Found empty alias list, from: ${station.id}`);
      }
      console.log(station.id);
    }

    const db_id =
      station.properties.db_id ||
      station.properties.obb_id ||
      station.properties.cff_id;

    // Some obb locations are connecting to a db location as parent
    if (
      station.properties.parent_station_id &&
      db_id &&
      // Only combine locations with a single db id
      !Object.keys(station.properties).filter(
        (key) =>
          key.endsWith("_id") &&
          !["parent_station_id", "obb_id", "db_id", "cff_id"].includes(key)
      )?.length
    ) {
      const parent = stations.find(
        ({ id: currentId }) =>
          currentId === station.properties.parent_station_id
      );
      const parent_db_id =
        parent?.properties.db_id ||
        parent?.properties.obb_id ||
        parent?.properties.cff_id;

      if (parent_db_id === db_id) {
        id = parent?.properties.id;
      }
    }

    if (id) map.set(id, [...(map.get(id) || []), station]);

    if (
      station.properties.same_as &&
      station.properties.id &&
      map.has(station.properties.id)
    ) {
      logger.warn(`Found alias who has own instance, id: ${station.id}`);
    }

    return map;
  }, new Map<string, TrainlineStation[]>());

  return Array.from(aliased.values());
};
