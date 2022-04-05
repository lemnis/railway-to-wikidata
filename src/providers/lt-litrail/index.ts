import { Country } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getStations } from "./litrail.data";

export const getLocations = () =>
  getStations().translations.map<Location>(
    ([name, latitude, longitude, , id]) => ({
      type: "Feature",
      id,
      properties: {
        labels: [{ value: name }],
        [Property.Country]: [{ value: Country.Lithuania.wikidata }],
        [CodeIssuer.ESR]: [{ value: id }],
      },
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    })
  );
