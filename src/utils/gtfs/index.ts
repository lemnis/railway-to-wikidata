import { Options } from "csv-parse";
import { progressBar } from "../logger";
import {
  Route,
  Shapes,
  Stop,
  StopTime,
  Trip,
  VehicleType,
} from "../../types/gtfs";
import {
  Feature,
  featureCollection,
  lineString,
  LineString,
  simplify,
} from "@turf/turf";
import { getGtfsFolder, loadFile } from "./utils";
import { isEqual } from "lodash";

export const getGtfsStations = async <T extends Stop>(
  url: string,
  name: string,
  cache = true,
  options: Options = {}
): Promise<T[]> => {
  const { stops } = await getGtfsFolder(url, name, cache);
  return await loadFile(stops, options);
};

export const getGtfsPaths = async (
  url: string,
  name: string,
  {
    cache = true,
    routeType = [
      VehicleType.TRAIN,
      ...Array.from({ length: 18 }, (_, i) => i + 100),
    ],
  }: {
    cache?: boolean;
    routeType?: number[];
  } = {}
): Promise<any[]> => {
  const {
    shapes: shapePath,
    trips: tripsPath,
    routes: routePath,
  } = await getGtfsFolder(url, name, cache);
  const shapes: Shapes[] = shapePath ? await loadFile(shapePath) : [];
  const routes: Route[] = await loadFile(routePath);
  const trips: Trip[] = await loadFile(tripsPath);

  const routeIds = routes
    .filter(({ route_type }) => routeType.includes(route_type))
    .map(({ route_id }) => route_id);
  const tripIds = trips.filter(({ route_id }) => routeIds.includes(route_id));

  const usedShapeIds = tripIds.map(({ shape_id }) => shape_id);

  const res = Object.values(
    shapes.reduce<{
      [key: string]: Feature<LineString>;
    }>((acc, { shape_id, shape_pt_lat, shape_pt_lon }) => {
      if (routeType.length && !usedShapeIds.includes(shape_id)) return acc;

      acc[shape_id] ||= {
        type: "Feature",
        id: shape_id,
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      };
      acc[shape_id].geometry.coordinates.push([shape_pt_lon, shape_pt_lat]);
      acc[shape_id];
      return acc;
    }, {})
  );

  return simplify(
    featureCollection(
      res
        .reduce<Feature<LineString>[]>((acc, a) => {
          const b = res.find((b) =>
            isEqual(a.geometry.coordinates, b.geometry.coordinates)
          );
          if (a === b) {
            acc.push(a);
          }
          return acc;
        }, [])
        .filter((i) => i.geometry.coordinates.length > 1)
    ),
    { tolerance: 0.001 }
  ).features;
};

export const getGtfsRoutes = async <
  R extends Route,
  T extends Trip,
  S extends StopTime
>(
  url: string,
  name: string,
  cache = true,
  { stopOptions = {} }: { stopOptions?: Options } = {}
): Promise<{
  routes: R[];
  stops: Stop[];
  trips: T[];
  stopTimes: S[];
}> => {
  const {
    routes: routesPath,
    stops: stopsPath,
    trips: tripsPath,
    stopTimes: stopTimesPath,
  } = await getGtfsFolder(url, name, cache);

  const routes = await loadFile(routesPath);
  const trips = await loadFile(tripsPath);
  const stopTimes = await loadFile(stopTimesPath);
  const stops = await loadFile(stopsPath, stopOptions);

  return { stops, trips, stopTimes, routes };
};

export const getGtfsStationsByRailRoute = (
  url: string,
  name: string,
  {
    cache = true,
    routeType = [
      VehicleType.TRAIN,
      ...Array.from({ length: 18 }, (_, i) => i + 100),
    ],
    stopOptions = {},
  }: {
    cache?: boolean;
    routeType?: number | number[];
    stopOptions?: Options;
  } = {}
) =>
  getGtfsRoutes(url, name, cache, { stopOptions }).then(
    ({ stops, stopTimes, routes, trips }) => {
      const routeTypes =
        typeof routeType === "number" ? [routeType] : routeType;
      const size = trips.length + routes.length + stopTimes.length;

      const stopProgressBar =
        size > 10
          ? progressBar(`Finding railway stops served by ${name}`, size)
          : undefined;

      const routeIds = routes
        .filter(({ route_type }) => {
          stopProgressBar?.tick();
          return routeTypes.includes(route_type);
        })
        .map(({ route_id }) => route_id);

      if (!routeIds.length) {
        throw new Error(
          `${name} does not have route of type(s) ${routeTypes.join(",")}`
        );
      }

      const tripIds = trips
        .filter(({ route_id }) => {
          stopProgressBar?.tick();
          return routeIds.includes(route_id);
        })
        .map(({ trip_id }) => trip_id);

      const stopIds = stopTimes
        .filter(({ trip_id }) => {
          stopProgressBar?.tick();
          return tripIds.includes(trip_id);
        })
        .map(({ stop_id }) => stop_id);

      const filteredStops = stops.filter(({ stop_id }) =>
        stopIds.includes(stop_id)
      );

      console.log(
        name,
        {
          routes: routes.length,
          filteredRoutes: routeIds.length,
          trips: tripIds.length,
          stopTimes: stopIds.length,
          stops: stops.length,
          filteredStops: filteredStops.length,
        },
        new Set(routes.map(({ route_type }) => route_type)),
        routeType
      );

      return filteredStops;
    }
  );
