import extract from "extract-zip";
import { promises as fs, constants } from "fs";
import fetch from "node-fetch";
import { Options } from "csv-parse";
import { parse } from "csv-parse/sync";
import { progressBar } from "./logger";
import { GtfsShape, GtfsStops } from "../types/gtfs";
import { Feature, LineString } from "@turf/turf";

const dir = __dirname + "/../../.cache";

const getGtfsFolder = async (url: string, name: string, cache = true) => {
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

  return {
    stops: cachePath + "/stops.txt",
    routes: cachePath + "/routes.txt",
    trips: cachePath + "/trips.txt",
    stopTimes: cachePath + "/stop_times.txt",
    shapes: cachePath + "/shapes.txt",
  };
};

export const getGtfsStations = async <T extends GtfsStops>(
  url: string,
  name: string,
  cache = true,
  options: Options = {}
): Promise<T[]> => {
  const { stops: stopPath } = await getGtfsFolder(url, name, cache);
  const stops = await fs.readFile(stopPath);
  return parse(stops, {
    columns: true,
    skipEmptyLines: true,
    trim: true,
    cast: false,
    ...options,
  });
};

export const getGtfsPaths = async (
  url: string,
  name: string,
  cache = true
): Promise<any[]> => {
  const { shapes: shapePath } = await getGtfsFolder(url, name, cache);
  const shapes: GtfsShape[] = parse(await fs.readFile(shapePath), {
    columns: true,
    skipEmptyLines: true,
    trim: true,
    cast: true,
  });

  return Object.values(
    shapes.reduce<{
      [key: string]: Feature<LineString, { id: number | string }>;
    }>((acc, item) => {
      acc[item.shape_id] ||= {
        type: "Feature",
        properties: {
          id: item.shape_id,
        },
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      };
      acc[item.shape_id].geometry.coordinates.push([
        item.shape_pt_lon,
        item.shape_pt_lat,
      ]);
      acc[item.shape_id];
      return acc;
    }, {})
  );
};

export const getGtfsRoutes = async <
  R extends {
    route_id: string;
    agency_id?: string;
    route_short_name?: string;
    route_long_name?: string;
    /** 0 - Tram, Streetcar, Light rail. Any light rail or street level system within a metropolitan area.
     *  1 - Subway, Metro. Any underground rail system within a metropolitan area.
     *  2 - Rail. Used for intercity or long-distance travel.
     *  3 - Bus. Used for short- and long-distance bus routes.
     *  4 - Ferry. Used for short- and long-distance boat service.
     *  5 - Cable tram. Used for street-level rail cars where the cable runs beneath the vehicle, e.g., cable car in San Francisco.
     *  6 - Aerial lift, suspended cable car (e.g., gondola lift, aerial tramway). Cable transport where cabins, cars, gondolas or open chairs are suspended by means of one or more cables.
     *  7 - Funicular. Any rail system designed for steep inclines.
     *  11 - Trolleybus. Electric buses that draw power from overhead wires using poles.
     *  12 - Monorail. Railway in which the track consists of a single rail or a beam. */
    route_type: number;
    route_url?: string;
    route_color?: string;
    route_text_color?: string;
    route_sort_order?: string;
    continuous_pickup?: number;
    continuous_drop_off?: number;
    stops?: any[];
    trips?: any[];
  },
  T extends Record<string, any>
>(
  url: string,
  name: string,
  cache = true,
  { stopOptions = {} }: { stopOptions?: Options } = {}
): Promise<{
  routes: R[];
  stops: {
    stop_id: number | string;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
    location_type?: number;
    wheelchair_boarding?: number;
    parent_station?: number;
  }[];
  trips: T[];
  stopTimes: T[];
}> => {
  const {
    routes: routesPath,
    stops: stopsPath,
    trips: tripsPath,
    stopTimes: stopTimesPath,
  } = await getGtfsFolder(url, name, cache);
  const routes = await fs.readFile(routesPath).then((routes) =>
    parse(routes, {
      skipEmptyLines: true,
      trim: true,
      cast: true,
      columns: true,
      // fromLine: 2,
    })
  );
  const stops = await fs.readFile(stopsPath).then((stops) =>
    parse(stops, {
      skipEmptyLines: true,
      trim: true,
      cast: true,
      columns: true,
      ...stopOptions,
    })
  );
  const trips = await fs.readFile(tripsPath).then((trips) =>
    parse(trips, {
      skipEmptyLines: true,
      trim: true,
      cast: true,
      columns: true,
      // fromLine: 2,
    })
  );
  const stopTimes = await fs.readFile(stopTimesPath).then((trips) =>
    parse(trips, {
      columns: true,
      skipEmptyLines: true,
      trim: true,
      cast: true,
      // fromLine: 2,
    })
  );

  return { stops, trips, stopTimes, routes };
};

export const getGtfsStationsByRailRoute = (
  url: string,
  name: string,
  {
    cache = true,
    routeType = 2,
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

      if (
        !routeTypes.some((routeType) =>
          routes.map(({ route_type }) => route_type).includes(routeType)
        )
      ) {
        throw new Error(
          `${name} does not have route of type(s) ${routeTypes.join(",")}`
        );
      }

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
