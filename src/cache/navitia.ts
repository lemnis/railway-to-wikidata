import { exportGeoJSON } from ".";
import { countries } from "../providers/navitia";
import { logger } from "../utils/logger";

export const generateNavitiaGeoJSON = () =>
  Promise.all(
    Object.entries(countries).map(([country, getLocations]) =>
      getLocations()
        .then(async (locations) => {
          const geoJSON = await exportGeoJSON(
            locations,
            `${__dirname}/../../geojson/navitia/${country}.geojson`
          );
          logger.log(`Updated Navitia GeoJSON file for ${country}`);
          return geoJSON;
        })
        .catch(() => {
          (error: any) => {
            logger.warn(error);
          };
        })
    )
  );
