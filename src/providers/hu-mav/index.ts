import { Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { Country } from "../../transform/country";
import { getGtfsStationsByRailRoute } from "../../utils/gtfs";

/**
 * @see https://gtfs.menetbrand.com/letoltes/
 */
export const getLocations = () =>
  getGtfsStationsByRailRoute(
    "https://gtfs.menetbrand.com/download/mav",
    "mav"
  ).then((data) =>
    data.map<Location>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      return {
        type: "Feature",
        id: stop_id.toString(),
        geometry: { type: "Point", coordinates: [stop_lon, stop_lat] },
        properties: {
          labels: [{ value: stop_name }],
          [Property.Country]: [{ value: Country.Hungary.wikidata }],
        },
      };
    })
  );
