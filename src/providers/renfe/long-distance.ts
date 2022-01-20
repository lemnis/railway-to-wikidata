import { LocationV4 } from "../../types/location";
import { CodeIssuer, Country, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";

export const options = {
  partOf: "Q2476154",
  reference:
    "https://data.renfe.com/dataset/horarios-de-alta-velocidad-larga-distancia-y-media-distancia",
};

/**
 * @license CC BY 4.0
 * @see https://data.renfe.com/dataset/horarios-de-alta-velocidad-larga-distancia-y-media-distancia
 * @see https://transitfeeds.com/p/renfe/1018
 * @see https://www.transit.land/feeds/f-ez-renfeoperadora
 */
export const getLocations = () =>
  getGtfsStations(
    "https://ssl.renfe.com/gtransit/Fichero_AV_LD/google_transit.zip",
    "renfe-long-distance"
  ).then((data) =>
    data.map<LocationV4>(({ stop_lat, stop_lon, stop_id, stop_name }) => ({
      labels: stop_name.split("/").map((value) => ({ value })), // some names are in spanish & catallan seperated by a slash
      claims: {
        [CodeIssuer.UIC]: [{ value: '71' + stop_id }],
        [Property.StationCode]: [{ value: stop_id }],
        [Property.Country]: [{ value: Country.Spain }],
        [Property.CoordinateLocation]: [
          { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
        ],
      },
    }))
  );
