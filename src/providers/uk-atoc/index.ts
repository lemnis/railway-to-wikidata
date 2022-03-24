import { Country } from "../../transform/country";
import { Language } from "../../transform/language";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";

/**
 * Currently a 3th party generated source is used,
 * but as the original format would be used.
 * @todo Create method to use 1st party source
 * @todo Map ALL values that are included in the stops.txt file
 * @todo Add logic to optionally match to station code instead of atoc code
 */
export const getLocations = (): Promise<Location[]> =>
  getGtfsStations(
    "https://transitfeeds.com/p/association-of-train-operating-companies/284/latest/download",
    "atoc"
  ).then((data) =>
    data
      .map<Location>(({ stop_lat, stop_lon, stop_name, stop_id }) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(stop_lon), parseFloat(stop_lat)],
        },
        properties: {
          id: stop_id,
          labels: [{ value: stop_name, lang: Language.English[1] }],
          [CodeIssuer.ATOC]: [{ value: stop_id }],
          [Property.Country]: [{ value: Country.UnitedKingdom.wikidata }],
        },
      }))
      .sort((a, b) => a.properties.id.localeCompare(b.properties.id))
  );
