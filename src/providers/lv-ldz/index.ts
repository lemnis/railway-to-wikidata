import fetch from "node-fetch";
import { Language } from "../../transform/language";
import { Location } from "../../types/location";
import { CodeIssuer } from "../../types/wikidata";

export const getLocations = async () => {
  const response = await fetch("https://travel.ldz.lv/en/booking/get_stations");
  const json: [name: string, uic: string][] = await response.json();

  return json.map<Location>(([name, uic]) => ({
    type: "Feature",
    id: uic,
    geometry: { type: "MultiPoint", coordinates: [] },
    properties: {
      labels: [{ value: name, lang: Language.Latvian[1] }],
      [CodeIssuer.UIC]: [{ value: uic }]
    },
  }));
};
