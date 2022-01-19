import { LocationV4 } from "../../types/location";
import { CodeIssuer, Country, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";

/**
 * Combios de Portugal
 * @license ?
 * @see http://dados.cm-lisboa.pt/dataset/informacao-sobre-transportes-publicos-da-cidade-de-lisboa-cp-comboios-de-portugal
 * @see https://www.transit.land/operators/o-eyc-cp
 * @see https://transitfeeds.com/p/comboios-de-portugal
 */
export const getLocations = (): Promise<LocationV4[]> =>
  getGtfsStations(
    "https://www.transporlis.pt/Portals/0/OpenData/gtfs/zip/3/gtfs_3.zip",
    "comboios-de-portugal"
  ).then((data) =>
    data.map(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      const stopUrl = `https://transitfeeds.com/p/comboios-de-portugal/1004/latest/stop/${stop_id}`;

      return {
        labels: [{ value: stop_name }],
        claims: {
          [CodeIssuer.UIC]: [
            [
              {
                value: "94" + stop_id.slice(3, 8),
                references: {
                  [Property.ReferenceURL]: stopUrl,
                },
              },
            ],
          ],
          [Property.StationCode]: [
            [
              {
                value: stop_id,
                references: {
                  [Property.ReferenceURL]: stopUrl,
                },
              },
            ],
          ],
          [Property.Country]: [[{ value: Country.Portugal }]],
          [Property.CoordinateLocation]: [
            [{ value: [parseFloat(stop_lat), parseFloat(stop_lon)] }],
          ],
        },
      };
    })
  );
