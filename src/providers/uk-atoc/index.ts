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
export const getLocations = async () => {
  const data = await getGtfsStations(
    "https://transitfeeds.com/p/association-of-train-operating-companies/284/latest/download",
    "atoc"
  );

  return data
    .map<Location>(({ stop_lat, stop_lon, stop_name, stop_id }) => ({
      type: "Feature",
      id: stop_id,
      geometry:
        stop_lat === "0" && stop_lon === "0"
          ? { type: "MultiPoint", coordinates: [] }
          : {
              type: "Point",
              coordinates: [parseFloat(stop_lon), parseFloat(stop_lat)],
            },
      properties: {
        labels: [{ value: stop_name, lang: Language.English[1] }],
        [CodeIssuer.ATOC]: [{ value: stop_id }],
        [Property.Country]: [
          {
            value: stop_name.match(/\(CIE\)?$/)
              ? Country.Ireland.wikidata
              : Country.UnitedKingdom.wikidata,
          },
        ],
      },
    }))
    .sort((a, b) => a.id!.toString().localeCompare(b.id!.toString()));
};
