import { Country, findCountryByUIC } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";

/**
 * Combios de Portugal
 * @license ?
 * @see http://dados.cm-lisboa.pt/dataset/informacao-sobre-transportes-publicos-da-cidade-de-lisboa-cp-comboios-de-portugal
 * @see https://www.transit.land/operators/o-eyc-cp
 * @see https://transitfeeds.com/p/comboios-de-portugal
 */
export const getLocations = (): Promise<LocationV4[]> =>
  getGtfsStations(
    "https://navitia.opendatasoft.com/explore/dataset/dk/files/cd101cb21930a2b26531eaa99b48b606/download/",
    "denmark"
  ).then((data) =>
    data
      .filter(({ stop_id }) =>
        [...Country.Denmark.UIC, ...Country.Germany.UIC, ...Country.Sweden.UIC]
          .map((uic) => `ODK:Navitia:00000${uic}`)
          .some((i) => stop_id.startsWith(i))
      )
      .map(({ stop_lat, stop_lon, stop_name, stop_id }) => {
        const uic = stop_id.slice(-7);

        return {
          labels: [{ value: stop_name }],
          claims: {
            [CodeIssuer.UIC]: [{ value: uic }],
            [Property.Country]: [
              { value: findCountryByUIC(parseInt(uic[0] + uic[1]))?.wikidata },
            ],
            [Property.CoordinateLocation]: [
              { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
            ],
          },
        };
      })
  );
