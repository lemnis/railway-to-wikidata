import extract from "extract-zip";
import { promises as fs, constants } from "fs";
import fetch from "node-fetch";
import { parse } from "csv-parse/sync";
import { progressBar } from "./logger";
import { GtfsStops } from "../types/gtfs";

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
  };
};

export const getGtfsStations = async <T extends GtfsStops>(
  url: string,
  name: string,
  cache = true
): Promise<T[]> => {
  const { stops: stopPath } = await getGtfsFolder(url, name, cache);
  const stops = await fs.readFile(stopPath);
  return parse(stops, {
    columns: true,
    skipEmptyLines: true,
    trim: true,
    cast: false,
  });
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
  cache = true
): Promise<{ routes: R[]; stops: T[]; trips: T[]; stopTimes: T[] }> => {
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
  const stops = await fs.readFile(stopsPath).then((routes) =>
    parse(routes, {
      skipEmptyLines: true,
      trim: true,
      cast: true,
      columns: true,
      // fromLine: 2,
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
  }: {
    cache?: boolean;
    routeType?: number;
  } = {}
) =>
  getGtfsRoutes(url, name, cache).then(
    ({ stops, stopTimes, routes, trips }) => {
      const stopProgressBar = progressBar(
        `Merging stops into stop times for ${name}`,
        stops.length
      );
      stops.forEach((stops) => {
        const stopTime = stopTimes.find(
          ({ stop_id }) => stop_id === stops.stop_id
        );
        if (stopTime) {
          stopTime.stops ||= [];
          stopTime.stops.push(stops);
        }
        stopProgressBar.tick();
      });

      const stopTimesProgressBar = progressBar(
        `Merging stop times into trips for ${name}`,
        stopTimes.length
      );
      stopTimes.forEach((stopTime) => {
        const trip = trips.find(({ trip_id }) => trip_id === stopTime.trip_id);
        if (trip) {
          trip.stopTimes ||= [];
          trip.stopTimes.push(stopTime);
        }
        stopTimesProgressBar.tick();
      });
      const l = progressBar(
        `Merging trips into routes for ${name}`,
        trips.length
      );
      trips.forEach((trip) => {
        const route = routes.find(({ route_id }) => route_id === trip.route_id);
        if (route) {
          route.trips ||= [];
          route.trips.push(trip);
        }
        l.tick();
      });

      return routes
        .filter(({ route_type }) => route_type === routeType)
        .map(({ trips }) => trips)
        .flat()
        .filter(Boolean)
        .map(({ stopTimes }) => stopTimes)
        .flat()
        .filter(Boolean)
        .map(({ stops }) => stops)
        .flat()
        .filter(Boolean);
    }
  );
