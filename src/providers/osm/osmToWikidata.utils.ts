import { FeatureCollection, Point } from "geojson";
import { Location } from "../../types/location";
import { ClaimObject, CodeIssuer, Items, Property } from "../../types/wikidata";

const keyMap = {
  uic_ref: CodeIssuer.UIC,
  "ref:ibnr": CodeIssuer.IBNR,
  "ref:IBNR": CodeIssuer.IBNR,
  "railway:ref:DB": CodeIssuer.DB,
  "railway:ref:DBAG": CodeIssuer.DB,
  "ref": Property.StationCode,
  "railway:ref": Property.StationCode,
  "local_ref": Property.StationCode,
  "esr:user": CodeIssuer.ESR,
  "wikidata": Property.Wikidata,
  "platforms": Property.NumberOfPlatformTracks,
  iata: CodeIssuer.IATA,
};

const map = [
  {
    osmKey: "wheelchair",
    osmValue: "yes",
    wikidataKey: Property.WheelchairAccessibility,
    wikidataValue: Items.WheelchairAccessible,
  },
  {
    osmKey: "railway",
    osmValue: "stop",
    wikidataKey: Property.InstanceOf,
    wikidataValue: Items.RailwayStop,
  },
]

export function osmToWikidata(
  data: FeatureCollection<Point, Record<string, string>>
) {
  const features = data.features.map<Location>((feature) => {
    const { name, uic_name, ...extra } = Object.assign({}, feature.properties);

    const properties: Record<CodeIssuer | Property, ClaimObject<string>[]> =
      {} as any;

    const labels = [];

    Object.entries(extra).map(([key, value]) => {
      // todo old_name
      if (key.startsWith("name:")) {
        let lang: string | undefined = key.split(":")?.[1];
        if (lang === "offical") lang = undefined;
        labels.push({ value, lang });
        delete extra[key];
      }
      if (key in keyMap) {
        properties[keyMap[key as keyof typeof keyMap]] ||= [];
        properties[keyMap[key as keyof typeof keyMap]]!.push({ value });
        delete extra[key];
      }
    });

    if (name) labels.push({ value: name });
    if (uic_name) labels.push({ value: uic_name });

    return {
      ...feature,
      properties: {
        labels,
        ...extra,
        ...properties,
      },
    };
  });

  return { ...data, features };
}
