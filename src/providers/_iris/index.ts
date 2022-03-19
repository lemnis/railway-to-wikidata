import fetch from "node-fetch";
import { CodeIssuer, Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { findCountryByIBNR } from "../../transform/country";

const WEBSITE =
  "https://github.com/derf/Travel-Status-DE-IRIS/blob/master/share/stations.json";

export const getLocations = async () => {
  const data: {
    name: string;
    ds100: string;
    eva: number;
    latlong: [number, number];
  }[] = await fetch(
    "https://raw.githubusercontent.com/derf/Travel-Status-DE-IRIS/master/share/stations.json"
  ).then((response) => response.json());

  const references = {
    [Property.ReferenceURL]: WEBSITE,
  };

  return data.map<Location>(({ name: value, ds100, eva, latlong }) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [latlong[1], latlong[0]],
    },
    properties: {
      id: ds100 || eva.toString(),
      labels: [{ value }],
      [CodeIssuer.IBNR]: [{ value: eva.toString(), references }],
      [CodeIssuer.DB]: [{ value: ds100, references }],
      [Property.Country]: [
        {
          value: findCountryByIBNR(parseInt(eva.toString().slice(0, 2)))
            ?.wikidata,
        },
      ],
    },
  }));
};
