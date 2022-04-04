import fetch from "node-fetch";
import { Location } from "../../types/location";
import { CodeIssuer } from "../../types/wikidata";

export const getLocations = async () => {
  const response = await fetch(
    "https://www.nsinternational.com/api/v2/stations/"
  );
  const data: {
    beneCode: string;
    name: string;
    type: string;
    aliases?: string[];
    hafasCodes?: number[];
    location: {
      type: "Point";
      coordinates: [number, number];
    };
  }[] = await response.json();

  return data.map<Location>(
    ({ beneCode, name, aliases, hafasCodes, location }) => ({
      type: "Feature",
      id: beneCode,
      geometry: location.coordinates[0]
        ? location
        : { type: "MultiPoint", coordinates: [] },
      properties: {
        labels: [
          { value: name },
          ...(aliases ? aliases.map((value) => ({ value })) : []),
        ],
        [CodeIssuer.Benerail]: [{ value: beneCode }],
        [CodeIssuer.IBNR]: hafasCodes?.map((value) => ({
          value: value.toString(),
        })),
      },
    })
  );
};
