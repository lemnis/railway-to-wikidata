import { Country } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";

export const getLocations = (): Promise<LocationV4[]> =>
  getGtfsStationsByRailRoute(
    `http://openov.lu/data/gtfs/gtfs-openov-lu.zip`,
    "open-ov"
  ).then((data) =>
    data
      .map(({ stop_lat, stop_lon, stop_name, stop_id }) => {
        return {
          labels: [{ value: stop_name }],
          claims: {
            [CodeIssuer.UIC]: [{ value: stop_id }],
            [Property.Country]: [{ value: Country.Luxembourg.wikidata }],
            [Property.CoordinateLocation]: [
              { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
            ],
          },
        };
      })
  );
