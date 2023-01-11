import { Point, getType } from "@turf/turf";
import { Location } from "../types/location";

/**
 * Groups locations by coordinates to a certain decimal
 * @param locations Locations to group
 * @param decimalPrecision
 * Roughly 0 decimals equals to 100 km, every decimal decreases the area by 10 times.
 * So, 1 decimal means a area of 10km by 10 km.
 */
const pregroupByCoordinates = (locations: Location[], decimalPrecision = 1) => {
  const result: Record<string, Record<string, Set<Location>>> = {};
  locations.forEach((location) => {
    if (getType(location) === "MultiPoint") {
      location.geometry.coordinates.forEach((coordinates) => {
        const lon = (location.geometry as Point).coordinates[0].toFixed(1);
        const lat = (location.geometry as Point).coordinates[1].toFixed(1);
        result[lon] ||= {};
        result[lon][lat] ||= new Set();
        result[lon][lat].add(location);
      });
    } else {
      const lon = (location.geometry as Point).coordinates[0].toFixed(1);
      const lat = (location.geometry as Point).coordinates[1].toFixed(1);
      result[lon] ||= {};
      result[lon][lat] ||= new Set();
      result[lon][lat].add(location);
    }
  });
  return result;
};

export const groupByCoordinateRegion = async (
  ungroupedStations: Location[],
  callback: (
    location: Location,
    surroundingLocations: Location[]
  ) => void | Promise<void>,
  decimalPrecision = 1
) => {
  const seen: Set<Location> = new Set();
  const pregroup = pregroupByCoordinates(ungroupedStations, decimalPrecision);

  for await (const [lon, latStations] of Object.entries(pregroup)) {
    for await (const [lat, stations] of Object.entries(latStations)) {
      for await (const station of stations) {
        if (seen.has(station)) continue;
        seen.add(station);

        const northLon = (parseFloat(lon) - 0.1).toFixed(decimalPrecision);
        const southLon = (parseFloat(lon) + 0.1).toFixed(decimalPrecision);
        const eastLat = (parseFloat(lat) + 0.1).toFixed(decimalPrecision);
        const westLat = (parseFloat(lat) + 0.1).toFixed(decimalPrecision);

        const closishStations = Array.from(
          new Set([
            ...(pregroup?.[northLon]?.[eastLat] || []),
            ...(pregroup?.[northLon]?.[lat] || []),
            ...(pregroup?.[northLon]?.[westLat] || []),
            ...(pregroup?.[lon]?.[eastLat] || []),
            ...(pregroup?.[lon]?.[lat] || []),
            ...(pregroup?.[lon]?.[westLat] || []),
            ...(pregroup?.[southLon]?.[eastLat] || []),
            ...(pregroup?.[southLon]?.[lat] || []),
            ...(pregroup?.[southLon]?.[westLat] || []),
          ])
        ).filter((b) => b !== station);

        await callback(station, closishStations);
      }
    }
  }
};
