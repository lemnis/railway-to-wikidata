import { FeatureCollection, Point } from "geojson";
import { findCountryByAlpha2 } from "../../transform/country";
import { Claims, Label, Location } from "../../types/location";
import { ClaimObject, CodeIssuer, Items, Property } from "../../types/wikidata";

const keyMap = {
  website: Property.OfficialWebsite,
  "contact:website": Property.OfficialWebsite,
  uic_ref: CodeIssuer.UIC,
  "ref:ibnr": CodeIssuer.IBNR,
  "ref:IBNR": CodeIssuer.IBNR,
  "railway:ref:DB": CodeIssuer.DB,
  "railway:ref:DBAG": CodeIssuer.DB,
  ref: Property.StationCode,
  "railway:ref": Property.StationCode,
  local_ref: Property.StationCode,
  "esr:user": CodeIssuer.ESR,
  wikidata: Property.Wikidata,
  platforms: Property.NumberOfPlatformTracks,
  iata: CodeIssuer.IATA,
};

const map = {
  wheelchair: [
    {
      osmValue: "yes",
      wikidataKey: Property.WheelchairAccessibility,
      wikidataValue: Items.WheelchairAccessible,
    },
    {
      osmValue: "no",
      wikidataKey: Property.WheelchairAccessibility,
      wikidataValue: Items.WheelchairInaccessible,
    },
    {
      osmValue: "limited",
      wikidataKey: Property.WheelchairAccessibility,
      wikidataValue: Items.WheelchairPartiallyAccessible,
    },
  ],
  railway: [
    {
      osmValue: "stop",
      wikidataKey: Property.InstanceOf,
      wikidataValue: Items.RailwayStop,
    },
    {
      osmValue: "halt",
      wikidataKey: Property.InstanceOf,
      wikidataValue: Items.RailwayStop,
    },
    {
      osmValue: "station",
      wikidataKey: Property.InstanceOf,
      wikidataValue: Items.RailwayStation,
    },
    {
      osmValue: "subway",
      wikidataKey: Property.InstanceOf,
      wikidataValue: Items.RailwayStation,
    },
  ],
  subway: [
    {
      osmValue: "yes",
      wikidataKey: Property.InstanceOf,
      wikidataValue: Items.RailwayStation,
    },
  ],
  internet_access: [
    {
      osmValue: "no",
      wikidataKey: Property.WifiAccess,
      wikidataValue: Items.No,
    },
    {
      osmValue: "wlan",
      wikidataKey: Property.WifiAccess,
      wikidataValue: Items.Yes,
    },
  ],
};

export function osmToWikidata(
  data: FeatureCollection<Point, Record<string, string>>
) {
  const features = data.features.map<Location>((feature) => {
    // skip id
    const {
      id,
      name,
      uic_name,
      official_name,
      old_name,
      alt_name,
      train,
      public_transport,
      "addr:country": country,
      ...extra
    } = Object.assign({}, feature.properties);

    const properties: Claims = {};
    const labels: Label[] = [];

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
      if (key in map) {
        const wiki = map[key as keyof typeof map].find(
          ({ osmValue }) => osmValue === value
        );
        if (wiki) {
          properties[wiki.wikidataKey] ||= [];
          properties[wiki.wikidataKey]!.push({ value: wiki.wikidataValue });
          delete extra[key];
        }
      }
    });

    [
      ...new Set(
        [name, uic_name, official_name, alt_name, old_name].filter(Boolean)
      ),
    ].forEach((value) => labels.push({ value }));

    if (country) {
      properties[Property.Country] ||= [];
      properties[Property.Country]?.push({
        value: findCountryByAlpha2(country)?.wikidata,
      });
    }

    if (train === "yes" && !properties[Property.InstanceOf]?.length) {
      properties[Property.InstanceOf] ||= [];
      properties[Property.InstanceOf]?.push({
        value: Items.RailwayStation,
      });
    }

    if (
      public_transport === "stations" &&
      !properties[Property.InstanceOf]?.length
    ) {
      properties[Property.InstanceOf] ||= [];
      properties[Property.InstanceOf]?.push({
        value: Items.RailwayStation,
      });
    }

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
