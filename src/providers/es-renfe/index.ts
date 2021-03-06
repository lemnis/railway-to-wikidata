import { parse } from "csv-parse/sync";
import { CodeIssuer, Property } from "../../types/wikidata";
import fetch from "node-fetch";
import { RenfeStation } from "./renfe.types";
import { Location } from "../../types/location";
import { Country } from "../../transform/country";
import { Language } from "../../transform/language";

const StringToCountry = {
  Francia: Country.France,
  España: Country.Spain,
  Portugal: Country.Portugal,
};

/**
 * @license CC-BY-4.0
 * @see https://data.renfe.com/dataset/estaciones-listado-completo
 */
export const getLocations = async () => {
  const rawCsv = await fetch(
    "https://data.renfe.com/dataset/ed3d44e5-1d04-41d6-9aa5-396442bf3e07/resource/783e0626-6fa8-4ac7-a880-fa53144654ff/download/listado-estaciones-completo.csv"
  ).then((response) => response.text());
  const csv: RenfeStation[] = parse(rawCsv, {
    delimiter: ";",
    columns: [
      "code",
      "description",
      "latitud",
      "longitud",
      "direccion",
      "postalCode",
      "adminstartiveArea",
      "province",
      "country",
      "cercanias",
      "feve",
    ],
    from: 2,
  });

  return csv.map<Location>((station: RenfeStation) => ({
    type: "Feature",
    id: station.code,
    geometry: {type: "Point", coordinates: [
      parseFloat(station.longitud.replace(",", ".")),
      parseFloat(station.latitud.replace(",", ".")),
    ]},
    properties: {
      labels: [{ value: station.description, lang: Language.Spanish[1] }],
      ...(station.code
        ? {
            [CodeIssuer.UIC]: [
              { value: StringToCountry[station.country].UIC[0] + station.code },
            ],
            [Property.StationCode]: [{ value: station.code }],
          }
        : {}),
      [Property.Country]: [{ value: StringToCountry[station.country].wikidata }],
      [Property.PostalCode]: [{ value: station.postalCode }],
      [Property.Location]: [{ value: station.direccion }],
      //   [Property.InAdministrativeTerritory]
      // province
      // operated by -> feve, cercanias
    },
  }));
};
