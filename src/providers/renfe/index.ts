import { parse } from "csv-parse/sync";
import { CodeIssuer, Country, Property } from "../../types/wikidata";
import fetch from "node-fetch";
import { RenfeStation } from "./renfe.types";
import { LocationV4 } from "../../types/location";

const StringToCountry = {
  Francia: Country.France,
  España: Country.Spain,
  Portugal: Country.Portugal,
}

enum StringToIso {
  Francia = "87",
  España = "74",
  Portugal = "94",
}

/**
 * @license CC BY 4.0
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

  return csv.map<LocationV4>((station: RenfeStation) => ({
    id: station.code,
    labels: [{ value: station.description }],
    claims: {
      ...(station.code
        ? {
            [CodeIssuer.UIC]: [
              { value: StringToIso[station.country] + station.code },
            ],
            [Property.StationCode]: [{ value: station.code }],
          }
        : {}),
      [Property.Country]: [{ value: StringToCountry[station.country] }],
      [Property.CoordinateLocation]: [
        {
          value: [
            parseFloat(station.latitud.replace(",", ".")),
            parseFloat(station.longitud.replace(",", ".")),
          ],
        },
      ],
      [Property.PostalCode]: [{ value: station.postalCode }],
      [Property.Location]: [{ value: station.direccion }],
      //   [Property.InAdministrativeTerritory]
      // province
      // operated by -> feve, cercanias
    },
  }));
};
