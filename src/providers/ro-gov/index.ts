import { CodeIssuer, Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { multiPoint, point } from "@turf/turf";
import { Country, findCountryByAlpha2 } from "../../transform/country";
import { feature } from "@ideditor/country-coder";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";

/**
 * @see https://github.com/vasile/data.gov.ro-gtfs-exporter
 */
export const getLocations = async () => {
  const data = await getGtfsStationsByRailRoute(
    "https://raw.githubusercontent.com/vasile/data.gov.ro-gtfs-exporter/master/cfr.webgis.ro/stops.geojson",
    "ro-gov"
  );

  return data
    .map<Location>(({ stop_id, stop_lat, stop_lon, stop_name }) => {
      const coordinates = [stop_lon, stop_lat] as [number, number];
      const country = feature(coordinates)?.properties;

      return point(
        coordinates,
        {
          labels: stop_name ? [{ value: stop_name }] : [],
          [Property.Country]: [{ value: country?.wikidata }],
          ...(country?.iso1A2 === Country.Romania.alpha2
            ? {
                [CodeIssuer.UIC]: [
                  {
                    value:
                      findCountryByAlpha2(country?.iso1A2)?.UIC?.[0] +
                      stop_id.toString(),
                  },
                ],
              }
            : {}),
        },
        { id: stop_id.toString() }
      );
    })
    .reduce<any[]>((res, a) => {
      const index = res.findIndex((b) => a.id === b.id);
      if (index > -1) {
        res[index] = multiPoint(
          [res[index].geometry.coordinates, a.geometry.coordinates],
          res[index].properties,
          { id: res[index].id }
        );
      } else {
        res.push(a);
      }
      return res;
    }, []);
};
