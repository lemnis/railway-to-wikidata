import { parse } from "csv-parse/sync";
import { CodeIssuer, Property } from "../../types/wikidata";
import fetch from "node-fetch";
import { RenfeStation } from "./renfe.types";
import { Location } from "../../types/location";
import { Country } from "../../transform/country";
import { Language } from "../../transform/language";
import { RELIABILITY_RENFE_UIC } from "./renfe.constants";
import { Reliability } from "../../score/reliability";
import { merge } from "../../actions/merge";
import { score } from "../../score";

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

  const ungroupedStations = csv.map<Location>(
    ({
      direccion,
      code,
      longitud,
      latitud,
      description,
      country,
      postalCode,
    }: RenfeStation) => ({
      type: "Feature",
      id: code,
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(longitud.replace(",", ".")),
          parseFloat(latitud.replace(",", ".")),
        ],
      },
      properties: {
        labels: [{ value: description }],
        ...(code
          ? {
              [CodeIssuer.UIC]: [
                {
                  value: StringToCountry[country].UIC[0] + code,
                  info: {
                    reliability:
                      country === "España"
                        ? RELIABILITY_RENFE_UIC
                        : Reliability.START,
                  },
                },
              ],
              [Property.StationCode]: [{ value: code }],
            }
          : {}),
        [Property.Country]: [{ value: StringToCountry[country].wikidata }],
        ...(postalCode
          ? { [Property.PostalCode]: [{ value: postalCode }] }
          : {}),
        ...(direccion ? { [Property.Location]: [{ value: direccion }] } : {}),
        //   [Property.InAdministrativeTerritory]
        // province
        // operated by -> feve, cercanias
      },
    })
  );

  const groupedStations: Location[][] = [];

  for await (const station of ungroupedStations) {
    const [index, highestMatch] =
      (await Promise.all(
        groupedStations.map((r, index) =>
          Promise.all(r.map((b) => score(station, b)))
            .then((r) => r.sort((a, b) => b.percentage - a.percentage)?.[0])
            .then(
              (r) => [index, r] as [number, Awaited<ReturnType<typeof score>>]
            )
        )
      ).then(
        (r) => r.sort((a, b) => b[1].percentage - a[1].percentage)?.[0]
      )) || [];

    if (highestMatch?.percentage >= 2) {
      groupedStations[index].push(station);
    } else {
      groupedStations.push([station]);
    }
  }

  return await Promise.all(
    groupedStations.map((stations) =>
      stations.length > 1 ? merge(stations, false, false) : stations[0]
    )
  );
};
