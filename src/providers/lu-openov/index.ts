import { Country } from "../../transform/country";
import { Language } from "../../transform/language";
import { Location } from "../../types/location";
import { Property } from "../../types/wikidata";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";

const country = {
  30: Country.Belgium.wikidata,
  40: Country.France.wikidata,
  50: Country.Germany.wikidata,
};

export const getLocations = async () => {
  const data = await getGtfsStationsByRailRoute(
    `http://openov.lu/data/gtfs/gtfs-openov-lu.zip`,
    "open-ov"
  );

  return data
    .map<Location>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      return {
        type: "Feature",
        id: stop_id.toString(),
        geometry: { type: "Point", coordinates: [stop_lon, stop_lat] },
        properties: {
          labels: [{ value: stop_name, lang: Language.Luxembourgish[1] }],
          [Property.Country]: [
            {
              value:
                (country as any)[stop_id.toString().slice(0, 2)] ||
                Country.Luxembourg.wikidata,
            },
          ],
        },
      };
    })
    .sort((a, b) => a.id?.toString().localeCompare(b.id!.toString()) ?? 0);
};
