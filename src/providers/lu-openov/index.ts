import { Country } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { Property } from "../../types/wikidata";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";

const country = {
  30: Country.Belgium.wikidata,
  40: Country.France.wikidata,
  50: Country.Germany.wikidata,
};

export const getLocations = async (): Promise<LocationV4[]> => {
  const data = await getGtfsStationsByRailRoute(
    `http://openov.lu/data/gtfs/gtfs-openov-lu.zip`,
    "open-ov"
  );

  return data
    .map<LocationV4>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      return {
        id: stop_id.toString(),
        labels: [{ value: stop_name }],
        claims: {
          [Property.Country]: [
            {
              value:
                (country as any)[stop_id.toString().slice(0, 2)] ||
                Country.Luxembourg.wikidata,
            },
          ],
          [Property.CoordinateLocation]: [{ value: [stop_lat, stop_lon] }],
        },
      };
    })
    .sort((a, b) => a.id?.localeCompare(b.id!) ?? 0);
};
