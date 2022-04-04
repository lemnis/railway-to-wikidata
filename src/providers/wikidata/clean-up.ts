import { merge } from "lodash";
import { LocationV4 } from "../../types/location";

export const PREFIXES = {
  wds: "http://www.wikidata.org/entity/statement/",
  wd: "http://www.wikidata.org/entity/",
  wdt: "http://www.wikidata.org/prop/direct/",
  wikibase: "http://wikiba.se/ontology#",
  ps: "http://www.wikidata.org/prop/statement/",
  p: "http://www.wikidata.org/prop/",
  pq: "http://www.wikidata.org/prop/qualifier/",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  bd: "http://www.bigdata.com/rdf#",
  skos: "http://www.w3.org/2004/02/skos/core#",
};

export const removeIds = (entity: LocationV4) => {
  const copy = merge({}, entity);
  Object.values(copy.claims).forEach((claims) => {
    claims.forEach(claim => {
      if('id' in claim) {
        delete claim['id'];
      }
    })
  });
  return copy;
};

export const simplifyUri = (uri: string) => {
  for (const key in PREFIXES) {
    if (Object.prototype.hasOwnProperty.call(PREFIXES, key)) {
      const prefix = (PREFIXES as any)[key];
      if (uri.startsWith(prefix)) {
        return uri.replace(prefix, key ? key + ":" : "");
      }
    }
  }
  return uri;
};

export const removeUri = (uri: string) => {
  for (const key in PREFIXES) {
    if (Object.prototype.hasOwnProperty.call(PREFIXES, key)) {
      const prefix = (PREFIXES as any)[key];
      if (uri.startsWith(prefix)) {
        return uri.replace(prefix, "");
      }
    }
  }
  return uri;
};

export const simplifyByDatatype = (datatype: string, value: string) => {
  if (datatype === "http://www.opengis.net/ont/geosparql#wktLiteral") {
    const [lon, lat] = value
      .replace("Point(", "")
      .replace(")", "")
      .split(" ")
      .map((direction: string) => parseFloat(direction));
    if(!Number.isFinite(lon) || !value.startsWith('Point')) {
      console.log(value, lat,lon);
    }
    return [lat, lon];
  } else {
    return value;
  }
};

export const simplifyValue = (value: string, type: string, datatype: string) =>
  type === "uri"
    ? removeUri(value)!
    : datatype!
    ? simplifyByDatatype(datatype, value)
    : value!;
