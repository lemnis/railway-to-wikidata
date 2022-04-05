import { findCountryByAlpha2 } from "../../transform/country";
import { Location } from "../../types/location";
import { Property } from "../../types/wikidata";

interface RegiojetLocation {
  stationImportants: number;
  aliases: string[];
  latitude: number;
  name: string;
  id: number;
  fullname: string;
  longitude: number;
}

/**
 * @todo Add support for multiple languages / labels
 */
export const getLocations = async () => {
  const {
    destinations,
  }: {
    destinations: {
      country: string;
      code: string;
      cities: {
        partnerCity: boolean;
        name: string;
        id: number;
        icons: boolean;
        stations: RegiojetLocation[];
      }[];
    }[];
  } = await fetch(
    "https://www.studentagency.cz/shared/wc/ybus-form/destinations-en.json"
  ).then((result) => result.json());

  return destinations.map((country) => {
    return country.cities
      .map(({ stations }) => stations)
      .flat()
      .map<Location>(({ id, longitude, latitude, fullname }) => ({
        type: "Feature",
        id,
        geometry: { type: "Point", coordinates: [longitude, latitude] },
        properties: {
          labels: [{ value: fullname }],
          [Property.StationCode]: [{ value: id.toString() }],
          [Property.Country]: [
            { value: findCountryByAlpha2(country.code)?.wikidata },
          ],
        },
      }));
  });
};
