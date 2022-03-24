import { LocationV4 } from "../../types/location";
import ProgressBar from "progress";
import { TrainlineStation } from "./trainline.types";
import { getBusIds, getTrainIds } from "./trainline.utils";
import { getStations } from "./getStations";
import { trainlineArrayToLocation } from "./trainlineArrayToLocation";
import { logger } from "../../utils/logger";
import { mergeAlias } from "./group";

/**
 * Gets all locations, ungrouped (!).
 * As result locations with are marked as same,
 * will have individual objects.
 */
export const getLocations = async () =>
  getStations().then((stations) =>
    Promise.all(
      stations.map((result) => trainlineArrayToLocation([result])).flat()
    )
  );

/**
 * Gets all locations, with some custom logic to determine
 * if the location is a bus stop, train station or city.
 * @example ```
 * const { trainStations } = await getGroupedTrainlineLocations();
 * const locations = await Promise.all(trainStations.map(trainlineArrayToLocation))
 * ```
 */
export const getGroupedTrainlineLocations = async () => {
  const stations = await getStations();
  const mapped = mergeAlias(stations);

  const groupProgressBar = new ProgressBar(
    "Group by cities, bus stops & train stations [:bar] :current/:total :percent :elapseds",
    { total: mapped.length }
  );

  // Group by cities, bus stops & train stations
  // (Cities are only classified if they have multiple children)
  return mapped.reduce<{
    cities: TrainlineStation[][],
    busStops: TrainlineStation[][],
    trainStations: TrainlineStation[][],
  }>(
    (places, station, index, stationList) => {
      groupProgressBar.tick();
      
      if (station.map((i) => i.is_city)?.every(Boolean)) {
        const children = stationList.filter((child) =>
          child
            .map((i) => i.parent_station_id)
            ?.some((id) => id && station.map((i) => i.id).includes(id))
        );
        const hasMainStation = children.some((child) =>
          child.map((i) => i.is_main_station)
        );

        if (children.length > 0 && hasMainStation) {
          if (!places.cities.includes(station)) places.cities.push(station);
          return places;
        }
      }

      const trainIds = getTrainIds(station);
      const busIds = getBusIds(station);

      if (trainIds.size < 2 && busIds.size > 0) {
        if (!places.busStops.includes(station)) places.busStops.push(station);
      } else if (trainIds.size === 0 && busIds.size === 0) {
        // is empty ignore
      } else if (trainIds.size >= 2) {
        if (!places.trainStations.includes(station))
          places.trainStations.push(station);
      }

      return places;
    },
    {
      cities: [],
      busStops: [],
      trainStations: [],
    }
  );
};
