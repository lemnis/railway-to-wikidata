import ProgressBar from "progress";
import { TrainlineStation } from "./trainline.types";
import { getAirportIds, getBusIds, getTrainIds } from "./trainline.utils";
import { getStations } from "./getStations";
import { trainlineArrayToLocation } from "./trainlineArrayToLocation";
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
export const getGroupedLocations = async () => {
  const stations = await getStations();
  const aliased = mergeAlias(stations);

  const groupProgressBar = new ProgressBar(
    "Group by cities, bus stops, airports & train stations [:bar] :current/:total :percent :elapseds",
    { total: aliased.length }
  );

  // Group by cities, bus stops & train stations
  // (Cities are only classified if they have multiple children)
  const result = aliased.reduce<{
    cities: Set<TrainlineStation[]>;
    busStops: Set<TrainlineStation[]>;
    trainStations: Set<TrainlineStation[]>;
    airports: Set<TrainlineStation[]>;
    others: Set<TrainlineStation[]>;
  }>(
    (groupResult, stationGroup, index, stationList) => {
      groupProgressBar.tick();

      if (
        stationGroup.map(({ properties }) => properties.is_city)?.every(Boolean)
      ) {
        const children = stationList.filter((child) =>
          child
            .map(({ properties }) => properties.parent_station_id)
            ?.some((id) => id && stationGroup.map((i) => i.id).includes(id))
        );
        const hasMainStation = children.some((child) =>
          child.map(({ properties }) => properties.is_main_station)
        );

        if (children.length > 0 && hasMainStation) {
          if (
            !children.some((i) => i.some((j) => j.properties.uic)) &&
            stationGroup.some((i) => i.properties.uic)
          ) {
            // console.log(stationGroup)
          }
          groupResult.cities.add(stationGroup);
          return groupResult;
        }
      }

      const trainIds = getTrainIds(stationGroup);
      const busIds = getBusIds(stationGroup);
      const airportIds = getAirportIds(stationGroup);

      if (trainIds.size > 0) {
        groupResult.trainStations.add(stationGroup);
      } else if (airportIds.size > 0) {
        groupResult.airports.add(stationGroup);
      } else if (busIds.size > 0) {
        groupResult.busStops.add(stationGroup);
      } else {
        groupResult.others.add(stationGroup);
      }

      return groupResult;
    },
    {
      cities: new Set(),
      busStops: new Set(),
      trainStations: new Set(),
      airports: new Set(),
      others: new Set(),
    }
  );

  return {
    cities: Array.from(result.cities.values()),
    busStops: Array.from(result.busStops.values()),
    trainStations: Array.from(result.trainStations.values()),
    airports: Array.from(result.airports.values()),
    others: Array.from(result.airports.values()),
  };
};

export { trainlineArrayToLocation };
