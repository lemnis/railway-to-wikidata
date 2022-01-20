// https://transitfeeds.com/p/renfe/1016

import { LocationV4 } from "../../types/location";
import { CodeIssuer, Country, Property } from "../../types/wikidata";
import { getGtfsStations } from "../../utils/gtfs";

export const options = {
  partOf: "Q2476154",
  reference: "https://data.renfe.com/dataset/horarios-cercanias",
};

export const getLocations = () =>
  getGtfsStations(
    "https://ssl.renfe.com/ftransit/Fichero_CER_FOMENTO/fomento_transit.zip",
    "renfe-cercanías"
  ).then((data) =>
    data.map<LocationV4>(({ stop_lat, stop_lon, stop_id, stop_name }) => ({
      labels: stop_name.split("/").map((value) => ({ value })), // some names are in spanish & catallan seperated by a slash
      claims: {
        [CodeIssuer.UIC]: [{ value: "71" + stop_id }],
        [Property.StationCode]: [{ value: stop_id }],
        [Property.Country]: [{ value: Country.Spain }],
        [Property.CoordinateLocation]: [
          { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
        ],
      },
    }))
  );
