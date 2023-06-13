import { point } from "@turf/turf";
import { findCountryByAlpha2 } from "../../transform/country";
import { Location } from "../../types/location";
import { Items, Property } from "../../types/wikidata";

interface RegiojetLocation {
  aliases: string[];
  latitude: number;
  name: string;
  id: number;
  fullname: string;
  longitude: number;
  stationsTypes: string[];
}

/**
 * @todo Add support for multiple languages / labels
 */
export const getLocations = async () => {
  const countries: {
    country: string;
    code: string;
    cities: {
      partnerCity: boolean;
      name: string;
      id: number;
      icons: boolean;
      stations: RegiojetLocation[];
    }[];
  }[] = await fetch(
    "https://brn-ybus-pubapi.sa.cz/restapi/consts/locations"
  ).then((result) => result.json());

  return countries
    .map((country) => {
      return country.cities
        .map(({ stations }) => stations)
        .flat()
        .filter((item) => item.stationsTypes?.includes("TRAIN_STATION"))
        .map<Location>(({ id, longitude, latitude, fullname }) =>
          point(
            [longitude, latitude],
            {
              labels: [{ value: fullname }],
              [Property.StationCode]: [
                {
                  value: id.toString(),
                  qualifiers: {
                    [Property.AppliesToPart]: [{ value: Items.RegioJet }],
                  },
                },
              ],
              [Property.Country]: [
                { value: findCountryByAlpha2(country.code)?.wikidata },
              ],
            },
            { id }
          )
        );
    })
    .flat();
};
