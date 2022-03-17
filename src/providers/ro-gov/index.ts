import fetch from "node-fetch";
import { CodeIssuer, Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { FeatureCollection, Point } from "geojson";
import { Country } from "../../transform/country";

/**
 * @see https://github.com/vasile/data.gov.ro-gtfs-exporter
 */
export const getLocations = async () => {
  const data: FeatureCollection<Point, { name: string; station_id: string }> =
    await fetch(
      "https://raw.githubusercontent.com/vasile/data.gov.ro-gtfs-exporter/master/cfr.webgis.ro/stops.geojson"
    ).then((response) => response.json());

  return data.features.map<Location>(({ properties, geometry }) => {
    const country = ["09422", "09461"].includes(properties.station_id)
      ? Country.Hungary
      : Country.Romania;

    return {
      type: "Feature",
      geometry,
      properties: {
        id: properties.station_id,
        labels: [{ value: properties.name }],
        [Property.Country]: [{ value: country.wikidata }],
        ...(country === Country.Romania
          ? {
              [CodeIssuer.UIC]: [
                { value: country.UIC?.[0] + properties.station_id },
              ],
            }
          : {}),
      },
    };
  });
};
