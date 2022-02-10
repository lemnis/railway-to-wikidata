import { CodeIssuer, Property } from "../../types/wikidata";
import { LocationV4 } from "../../types/location";
import { Country } from "../../transform/country";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";

export const getLocations = (): Promise<LocationV4[]> =>
  getGtfsStationsByRailRoute(
    "https://www.visimarsrutai.lt/gtfs/gtfs_all.zip",
    "visimarsrutai"
  ).then((data) =>
    data.map(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      return {
        id: stop_id,
        labels: [{ value: stop_name }],
        claims: {
          [CodeIssuer.UIC]: [{ value: (
              parseInt(stop_id)
          ).toString() }],
          [Property.Country]: [{ value: Country.Lithuania.wikidata }],
          [Property.CoordinateLocation]: [
            { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
          ],
        },
      };
    })
  );
