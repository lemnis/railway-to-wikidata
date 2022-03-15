import fetch from "node-fetch";
import { LocationV4 } from "../../types/location";
import { CodeIssuer } from "../../types/wikidata";

export const getLocations = async () => {
  const response = await fetch("https://travel.ldz.lv/en/booking/get_stations");
  const json: [name: string, uic: string][] = await response.json();

  return json.map<LocationV4>(([name, uic]) => ({
    id: uic,
    labels: [{ value: name }],
    claims: {
      [CodeIssuer.UIC]: [{ value: uic }]
    },
  }));
};
