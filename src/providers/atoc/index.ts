import { Country } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";

export const getLocations = (): Promise<LocationV4[]> =>
  getGtfsStations(
    "https://transitfeeds.com/p/association-of-train-operating-companies/284/latest/download",
    "atoc"
  ).then((data) =>
    data.map(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      return {
        labels: [{ value: stop_name }],
        claims: {
          [Property.StationCode]: [{ value: stop_id }],
          [Property.Country]: [{ value: Country.UnitedKingdom.wikidata }],
          [Property.CoordinateLocation]: [
            { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
          ],
        },
      };
    })
  );
