import fetch from "node-fetch";
import { CodeIssuer, Country, Property } from '../types/wikidata'
const { toUIC } = require('uic-codes');
import { LocationV3 } from "../types/location";

enum converter {
  FI = 'FIN',
  RU = 'RUS',
}

// https://rata.digitraffic.fi/swagger/#/metadata/getStationsUsingGET

export const getLocations = (): Promise<LocationV3[]> => fetch(
  "http://rata.digitraffic.fi/api/v1/metadata/stations"
)
  .then((response) => response.json())
  .then(
    (
      data: {
        passengerTraffic: boolean;
        type: "STATION" | "STOPPING_POINT";
        stationName: string;
        stationShortCode: string;
        stationUICCode: number;
        countryCode: string;
        longitude: number;
        latitude: number;
      }[]
    ) =>
      data
        .filter((item) => item.passengerTraffic)
        .map(({ longitude, latitude, countryCode, ...item }) => ({
          labels: [{ value: item.stationName}],
          claims: {
            [CodeIssuer.UIC]: [(100000) * parseFloat(toUIC[(converter as any)[countryCode]]) + item.stationUICCode],
            [Property.CoordinateLocation]: [[latitude, longitude]],
            [Property.StationCode]: [item.stationShortCode],
            [Property.Country]: (Country as any)[countryCode],
          }
        }))
  );
