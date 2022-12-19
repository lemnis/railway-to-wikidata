import fetch from "node-fetch";
import { CodeIssuer, Property } from "../../types/wikidata";
import { Basic, Claims, Location } from "../../types/location";
import { feature, FeatureCollection, point, Point } from "@turf/turf";
import { Country, findCountryByAlpha2 } from "../../transform/country";
import { feature as c } from "@ideditor/country-coder";

/**
 * @see https://github.com/vasile/data.gov.ro-gtfs-exporter
 */
export const getLocations = async () => {
  const data: FeatureCollection<Point, { name: string; station_id: string }> =
    await fetch(
      "https://raw.githubusercontent.com/vasile/data.gov.ro-gtfs-exporter/master/cfr.webgis.ro/stops.geojson"
    ).then((response) => response.json());

  return data.features.map<Location>(({ properties, geometry }) => {
    const country = c(geometry.coordinates as any)?.properties;

    return feature<Point, Claims & Basic>(
      geometry,
      {
        labels: properties.name ? [{ value: properties.name }] : [],
        [Property.Country]: [{ value: country?.wikidata }],
        ...(country?.iso1A2 === Country.Romania.alpha2
          ? {
              [CodeIssuer.UIC]: [
                {
                  value:
                    findCountryByAlpha2(country?.iso1A2)?.UIC?.[0] +
                    properties.station_id,
                },
              ],
            }
          : {}),
      },
      { id: properties.station_id }
    );
  });
};
