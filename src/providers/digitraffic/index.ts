import fetch from "node-fetch";
import { CodeIssuer, Country, Property } from "../../types/wikidata";
import { toUIC } from "uic-codes";
import { LocationV4 } from "../../types/location";

enum converter {
  FI = "FIN",
  RU = "RUS",
}

/**
 *
 * @see https://rata.digitraffic.fi/swagger/#/metadata/getStationsUsingGET
 */
export const getLocations = (): Promise<LocationV4[]> =>
  fetch("http://rata.digitraffic.fi/api/v1/metadata/stations")
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
          .map(
            ({
              longitude,
              latitude,
              countryCode,
              stationShortCode,
              stationName,
              stationUICCode,
            }) => ({
              labels: [{ value: stationName }],
              claims: {
                [CodeIssuer.UIC]: [
                  {
                    value:
                      toUIC[converter[countryCode as keyof typeof converter]] +
                      stationUICCode,
                  },
                ],
                [Property.CoordinateLocation]: [
                  { value: [latitude, longitude] },
                ],
                [Property.StationCode]: [{ value: stationShortCode }],
                [Property.Country]: [
                  { value: Country[countryCode as keyof typeof Country] },
                ],
              },
            })
          )
    );
