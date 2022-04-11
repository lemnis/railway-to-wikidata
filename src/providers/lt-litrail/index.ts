import { Country } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getStations } from "./litrail.data";

export const getLocations = () =>
  getStations().translations.map<Location>(
    ([name, latitude, longitude, , id, slug]) => ({
      type: "Feature",
      id,
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      properties: {
        labels: [{ value: name }],
        [Property.Country]: [{ value: Country.Lithuania.wikidata }],
        [CodeIssuer.ESR]: [{ value: id }],
        [Property.OfficialWebsite]: [{ value: `https://cargo.litrail.lt/${slug}`}]
      },
    })
  );
