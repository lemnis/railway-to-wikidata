import { Country } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";

/**
 * Currently a 3th party generated source is used,
 * but as the original format would be used.
 * @todo Create method to use 1st party source
 * @todo Map ALL values that are included in the stops.txt file
 * @todo Add logic to optionally match to station code instead of atoc code
 */
export const getLocations = (): Promise<LocationV4[]> =>
  getGtfsStations(
    "https://transitfeeds.com/p/association-of-train-operating-companies/284/latest/download",
    "atoc"
  ).then((data) =>
    data.map(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      return {
        labels: [{ value: stop_name }],
        claims: {
          [CodeIssuer.ATOC]: [{ value: stop_id }],
          [Property.Country]: [{ value: Country.UnitedKingdom.wikidata }],
          [Property.CoordinateLocation]: [
            { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
          ],
        },
      };
    })
  );
