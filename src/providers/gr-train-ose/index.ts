import { feature } from "@ideditor/country-coder";
import { multiPoint, point } from "@turf/turf";
import fetch from "node-fetch";
import { Country, findCountryByAlpha3 } from "../../transform/country";
import { Language } from "../../transform/language";
import { Location } from "../../types/location";
import { Items, Property } from "../../types/wikidata";
import { inspect } from "util";
import { score } from "../../score";

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
  const result = nodes.map<Location>(
    ({ STAT, LON, LAT, LABEL_EL, LABEL_EN, COUNTRY }) => {
      const hasCoordinates = LON && LAT;
      const coordinates: [number, number] = [LON, LAT];

      let country;
      if (hasCoordinates) country = feature(coordinates)?.properties.wikidata;
      else if (COUNTRY === "SKO") {
        country = Country.NorthMacedonia.wikidata;
      } else country = findCountryByAlpha3(COUNTRY)?.wikidata;

      const greekName = LABEL_EL !== "null" ? LABEL_EL : undefined;
      const englishName = LABEL_EN !== "null" ? LABEL_EN : undefined;

      const properties = {
        labels: [
          ...(englishName
            ? [{ value: englishName, lang: Language.English[1] }]
            : []),
          ...(greekName ? [{ value: greekName, lang: Language.Greek[1] }] : []),
        ],
        ...(country ? { [Property.Country]: [{ value: country }] } : {}),
        [Property.StationCode]: [
          {
            value: STAT,
            qualifiers: {
              [Property.AppliesToPart]: [{ value: Items.HellenicTrain }],
            },
            info: {
              enabled: nodesInUse.includes(STAT),
            },
          },
        ],
        info: { enabled: nodesInUse.includes(STAT) },
      };

      return hasCoordinates
        ? point(coordinates, properties, { id: STAT })
        : multiPoint([], properties, { id: STAT });
    }
  );

  return result;
};
