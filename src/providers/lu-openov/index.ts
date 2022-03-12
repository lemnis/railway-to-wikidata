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
      .map<LocationV4>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
        return {
          id: stop_id.toString(),
          labels: [{ value: stop_name }],
          claims: {
            [Property.Country]: [{ value: Country.Luxembourg.wikidata }],
            [Property.CoordinateLocation]: [{ value: [stop_lat, stop_lon] }],
          },
        };
      })
      .sort((a, b) => a.id?.localeCompare(b.id!) ?? 0)
  );
