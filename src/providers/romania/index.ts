import fetch from "node-fetch";
import { Property } from "../../types/wikidata";
import { LocationV4 } from "../../types/location";
import { FeatureCollection, Point } from "geojson";
import { Country } from "../../transform/country";

/**
 * @see https://github.com/vasile/data.gov.ro-gtfs-exporter
 */
export const getLocations = () =>
  fetch(
    "https://raw.githubusercontent.com/vasile/data.gov.ro-gtfs-exporter/master/cfr.webgis.ro/stops.geojson"
  )
    .then((response) => response.json())
    .then(
      (data: FeatureCollection<Point, { name: string; station_id: string }>) =>
        data.features.map<LocationV4>(({ properties, geometry }) => ({
          id: properties.station_id,
          labels: [{ value: properties.name }],
          claims: {
            [Property.CoordinateLocation]: [
              { value: [geometry.coordinates[1], geometry.coordinates[0]] },
            ],
            [Property.StationCode]: [{ value: properties.station_id }],
            [Property.Country]: [{ value: Country.Romania.wikidata }],
          },
        }))
    );
