import { Country } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";

const GTFS_URL =
  "https://opentransportdata.swiss/de/dataset/timetable-2021-gtfs2020/permalink";

/**
 * @license ?
 * @see https://opentransportdata.swiss/de/dataset/timetable-2020-gtfs
 * @see {@link  https://transitfeeds.com/p/sbb-cff-ffs/793}
 * for 3th party websites giving a prettified view of th GTFS file
 */
export const getLocations = (): Promise<LocationV4[]> =>
  getGtfsStations(GTFS_URL, "sbb").then((data) =>
    data.map(({ stop_lat, stop_lon, stop_id, stop_name }) => {
      const stopUrl = `https://transitfeeds.com/p/sbb-cff-ffs/793/latest/stop/${stop_id}`;

      return {
        id: stopUrl,
        labels: [{ value: stop_name }],
        claims: {
          [CodeIssuer.UIC]: [
            {
              value: stop_id,
              references: {
                [Property.ReferenceURL]: stopUrl,
              },
            },
          ],
          [Property.CoordinateLocation]: [
            { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
          ],
          [Property.Country]: [{ value: Country.Switzerland.wikidata }],
        },
      };
    })
  );
