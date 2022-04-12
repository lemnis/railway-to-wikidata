import { FeatureCollection, Point } from "geojson";
import fetch from "node-fetch";
import { GOLEMIO_API_KEY } from "../../../environment";
import { Country } from "../../transform/country";
import { Location } from "../../types/location";
import { Property } from "../../types/wikidata";
import { logger } from "../../utils/logger";

const LIMIT = 10000;

interface GolemioGeoJsonProperties {
  level_id: null;
  location_type: number;
  parent_station: string | null;
  platform_code: string | null;
  stop_id: string;
  stop_name: string;
  wheelchair_boarding: number;
  zone_id: string | null;
}

const getStops = (
  offset = 0
): Promise<FeatureCollection<Point, GolemioGeoJsonProperties>> =>
  fetch(
    `https://api.golemio.cz/v2/gtfs/stops/?limit=${LIMIT}&offset=${
      offset * LIMIT
    }`,
    {
      method: "GET",
      headers: {
        "x-access-token": GOLEMIO_API_KEY,
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  ).then((response) => response.json());

export const getLocations = async () => {
  const features = await Promise.all([getStops(0), getStops(1)]).then(
    (collections) => collections.map((collection) => collection.features).flat()
  );

  if (features.length >= LIMIT * 2) {
    logger.error("More stops than expected for golemio");
  }

  return features
    .filter(({ properties }) => properties.location_type === 1)
    .map<Location>(({ properties, geometry }) => ({
      type: "Feature",
      id: properties.stop_id,
      geometry,
      properties: {
        labels: [{ value: properties.stop_name }],
        [Property.StationCode]: [{ value: properties.stop_id }],
        [Property.Country]: [{ value: Country.Czech.wikidata }],
      },
    }));
};
