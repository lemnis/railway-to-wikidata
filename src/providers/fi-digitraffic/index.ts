import fetch from "node-fetch";
import { CodeIssuer, Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { findCountryByAlpha2 } from "../../transform/country";
import { Language } from "../../transform/language";

/**
 *
 * @see https://rata.digitraffic.fi/swagger/#/metadata/getStationsUsingGET
 */
export const getLocations = async () => {
  const data: {
    passengerTraffic: boolean;
    type: "STATION" | "STOPPING_POINT";
    stationName: string;
    stationShortCode: string;
    stationUICCode: number;
    countryCode: string;
    longitude: number;
    latitude: number;
  }[] = await fetch("http://rata.digitraffic.fi/api/v1/metadata/stations").then(
    (response) => response.json()
  );

  return data
    .filter((item) => item.passengerTraffic)
    .map<Location>(
      ({
        longitude,
        latitude,
        countryCode,
        stationShortCode,
        stationName,
        stationUICCode,
      }) => ({
        type: "Feature",
        id: stationShortCode,
        geometry: { type: "Point", coordinates: [longitude, latitude] },
        properties: {
          labels: [{ value: stationName, lang: Language.Finnish[1] }],
          [CodeIssuer.UIC]: [
            {
              value: (
                findCountryByAlpha2(countryCode)!.UIC![0] * 100000 +
                stationUICCode
              ).toString(),
            },
          ],
          [Property.StationCode]: [{ value: stationShortCode }],
          [Property.Country]: [
            { value: findCountryByAlpha2(countryCode)!.wikidata },
          ],
        },
      })
    );
};
