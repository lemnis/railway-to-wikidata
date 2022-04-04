import fetch from "node-fetch";
import { Country, findCountryByAlpha3 } from "../../transform/country";
import { Language } from "../../transform/language";
import { Location } from "../../types/location";
import { Property } from "../../types/wikidata";

export const getLocations = async () => {
  const response = await fetch(
    "https://extranet.trainose.gr/epivatikos/public_ticketing/ajax.php?c=dbsync&op=getData&item=diktyo"
  );
  const json = await response.json();
  const nodes: {
    STAT: string;
    COUNTRY: string;
    LABEL_EL?: string;
    LABEL_EN?: string;
    LAT: number;
    LON: number;
  }[] = json.data.nodes;
  const nodesInUse = json.data.nodes_in_use;
  return nodes
    .filter(
      ({ LAT, LON, STAT }) => nodesInUse.includes(STAT) || LAT || LON
    )
    .map<Location>(({ STAT, LON, LAT, LABEL_EL, LABEL_EN, COUNTRY }) => ({
      type: "Feature",
      id: STAT,
      geometry:
        LAT && LON
          ? { type: "Point", coordinates: [LON, LAT] }
          : { type: "MultiPoint", coordinates: [] },
      properties: {
        labels: [
          ...(LABEL_EL && LABEL_EL !== 'null' ? [{ value: LABEL_EL, lang: Language.Greek[1] }] : []),
          ...(LABEL_EN && LABEL_EN !== 'null'  ? [{ value: LABEL_EN, lang: Language.English[1] }] : []),
        ],
        [Property.StationCode]: [{ value: STAT }],
        [Property.Country]: [
          {
            value:
              COUNTRY === "SKO"
                ? Country.NorthMacedonia.wikidata
                : findCountryByAlpha3(COUNTRY)?.wikidata,
          },
        ],
        info: {
          enabled: nodesInUse.includes(STAT),
        },
      },
    }));
};
