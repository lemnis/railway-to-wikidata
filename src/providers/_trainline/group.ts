import { distanceTo } from "geolocation-utils";
import ProgressBar from "progress";
import { logger } from "../../utils/logger";
import { TrainlineStation } from "./trainline.types";

export const mergeAlias = (stations: TrainlineStation[]) => {
  const bar = new ProgressBar(
    "Combine aliases [:bar] :current/:total :percent :elapseds",
    { total: stations.length }
  );
  const aliased = stations.reduce((map, station) => {
    bar.tick();
    const id = station.same_as || station.id;

    let aliasList: TrainlineStation[] | undefined = [];
    if (station.same_as) {
      // get alias
      aliasList = map.get(station.same_as);
      if (!aliasList) {
        const alias = stations.find(({ id: currentId }) => currentId === id);
        if (alias) aliasList = [alias];
        if (alias?.same_as) {
          logger.warn(
            `Found a alias who as another alias from: ${station.id} alias: ${alias?.same_as}`
          );
        }
      }

      if (!aliasList || aliasList.length === 0) {
        logger.warn(`Found empty alias list, from: ${station.id}`);
      }
    }

    map.set(id, [...(map.get(id) || []), station]);

    if (station.same_as && map.has(station.id)) {
      logger.warn(`Found alias who has own instance, id: ${station.id}`);
    }

    return map;
  }, new Map<string, TrainlineStation[]>());

  return Array.from(aliased.values());
};

export const mergeFuzzyAlias = (
  aliased: Map<string, TrainlineStation[]>,
  stations: TrainlineStation[]
) => {
  const progressBar = new ProgressBar(
    "Removing name aliases [:bar] :current/:total :percent :elapseds",
    { total: aliased.size }
  );

  const iterator = aliased.entries();
  const skip: string[] = [];
  let next = iterator.next();
  while (!next.done) {
    progressBar.tick();
    const [key, aliasList] = next.value;

    if (
      aliasList.some((i) => skip.includes(i.id)) &&
      !aliasList.every((i) => skip.includes(i.id))
    ) {
      console.log(
        ":(",
        aliasList.map((i) => i.id),
        skip
      );
    } else if (aliasList.every((i) => skip.includes(i.id))) {
      aliased.delete(key);
    }

    // Find stations tha has the same name, and if they should be aliases
    const nameMatch = stations.filter((a) =>
      aliasList.every(
        (b) =>
          a !== b &&
          a.id !== b.id &&
          a.name === b.name &&
          a.is_city === b.is_city &&
          a.is_airport === b.is_airport &&
          a.name === b.name &&
          a.same_as !== b.id &&
          a.parent_station_id !== b.id &&
          b.parent_station_id !== a.id
      )
    );
    if (nameMatch.length > 0) {
      const distance = nameMatch
        .map((n) => {
          const closest = aliasList
            .map(
              (station) =>
                n.coordinates &&
                station.coordinates &&
                distanceTo(n.coordinates, station.coordinates)
            )
            .filter(Boolean)
            .sort()?.[0];

          return [closest, n] as [number, TrainlineStation];
        })
        .filter((i) => i[0] !== undefined);

      if (distance.length > 0) {
        if (distance.some((i) => i[0] < 3000)) {
          distance.forEach(([, item]) => {
            skip.push(item.id);
            aliasList.push(item);
          });
        } else {
          progressBar.interrupt(
            [
              "Could be city with the same name or a alias? ",
              aliasList.map((i) => [i.name, i.id]),
              nameMatch.map((i) => i.id),
              distance[0][0],
            ].toString()
          );
        }
      } else {
        progressBar.interrupt(
          [
            "Could be city with the same name or a alias? ",
            aliasList.map((i) => [i.name, i.id]),
            nameMatch.map((i) => i.id),
          ].toString()
        );
      }
    }

    next = iterator.next();
  }
};
