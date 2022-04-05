import { Country } from "../../transform/country";
import { Location } from "../../types/location";
import { Property } from "../../types/wikidata";
import { Stations } from "./hr-hzpp.data";

export const getLocations = async () => {
  return (await Stations).map<Location>(({ name, longitude, latitude }) => {
    return {
      type: "Feature",
      id: name,
      geometry: { type: "Point", coordinates: [longitude, latitude]},
      properties: {
        labels: [{ value: name }],
        [Property.Country]: [{ value: Country.Croatia.wikidata }],
      },
      info: { enabled: true },
    };
  });
};
