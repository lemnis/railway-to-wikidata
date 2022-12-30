import fetch from "node-fetch";
import { CodeIssuer, Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { ReliabilityIris } from "./iris.constants";
import { feature } from "@ideditor/country-coder";
import { point } from "@turf/turf";

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

  const references = [{ [Property.ReferenceURL]: WEBSITE }];

  return data.map<Location>(({ name: value, ds100, eva, latlong }) => {
    const coordinates = [latlong[1], latlong[0]] as [number, number];
    const country = feature(coordinates);

    return point(
      coordinates,
      {
        labels: [{ value }],
        [CodeIssuer.IBNR]: [
          {
            value: eva.toString(),
            references,
            info: { reliability: ReliabilityIris[CodeIssuer.IBNR] },
          },
        ],
        [CodeIssuer.DB]: [
          {
            value: ds100,
            references,
            info: { reliability: ReliabilityIris[CodeIssuer.DB] },
          },
        ],
        [Property.Country]: [{ value: country?.properties?.wikidata }],
      },
      { id: ds100 || eva }
    );
  });
};
