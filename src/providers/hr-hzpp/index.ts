import { Country } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { Property } from "../../types/wikidata";
import { Stations } from "./hr-hzpp.data";

export const getLocations = async () => {
  return (await Stations).map<LocationV4>(({ name, longitude, latitude }) => {
    return {
      labels: [{ value: name }],
      claims: {
        [Property.CoordinateLocation]: [{ value: [latitude, longitude] }],
        [Property.Country]: [{ value: Country.Croatia.wikidata }],
      },
      info: { enabled: true },
    };
  });
};
