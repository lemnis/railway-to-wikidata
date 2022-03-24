import { findCountryByAlpha2 } from "../../transform/country";
import { getTimeZonesByName } from "../../transform/locatedInTimeZone/utils/collection";
import { Location } from "../../types/location";
import { Property, CodeIssuer } from "../../types/wikidata";
import { TrainlineStation } from "./trainline.types";

export const trainlineArrayToLocation = async (
  stations: TrainlineStation[]
): Promise<Location> => {
  const url = `https://trainline-eu.github.io/stations-studio/#/station/${station.id?.[0]}`;
  const references = { [Property.ReferenceURL]: url };

  const timeZones = await Promise.all(
    stations?.map(async ({ time_zone }) => ({
      value: (await getTimeZonesByName(time_zone))?.[0]?.id,
      references,
    }))
  );

  return {
    type: "Feature",
    id: url,
    geometry: {
      type: "MultiPoint",
      coordinates:
        stations?.map(({ coordinates }) => [coordinates[1], coordinates[0]]) ||
        [],
    },
    properties: {
      labels: [
        ...stations
          .map((station) =>
            Object.entries(station)
              .filter(([key]) => key.startsWith("info:"))
              .map(([key, values]) =>
                values.map((value: string) => ({
                  value,
                  lang: key.slice(key.indexOf(":") + 1),
                }))
              )
          )
          .flat(2),
        ...(stations.map(({ name }) => name)?.length
          ? stations
              ?.map((station) => ({
                value: station.name,
                lang: findCountryByAlpha2(station.country)?.language,
              }))
              .flat()
          : []),
      ],
      [CodeIssuer.UIC]: stations?.map(({ uic }) => ({
        value: uic,
        references,
      })),
      [Property.Country]: stations
        .map(({ country }) => findCountryByAlpha2(country)?.wikidata)
        ?.map((value) => ({ value })),
      [CodeIssuer.Benerail]: stations?.map(({ benerail_id }) => ({
        value: benerail_id,
        references,
      })),
      [CodeIssuer.ATOC]: stations?.map(({ atoc_id }) => ({
        value: atoc_id,
        references,
      })),
      [CodeIssuer.SNCF]: stations?.map(({ sncf_id }) => ({
        value: sncf_id,
        references,
      })),
      [CodeIssuer.Trainline]: stations?.map(({ id }) => ({
        value: id,
        references,
      })),
      [Property.LocatedInTimeZone]: timeZones,
      [CodeIssuer.IATA]: stations?.map(({ iata_airport_code }) => ({
        value: iata_airport_code,
      })),
      [CodeIssuer.IBNR]: Array.from(
        new Set(
          stations
            .map(({ cff_id, db_id, obb_id }) => [cff_id, db_id, obb_id])
            .flat(2)
            .filter(Boolean)
        )
      )?.map((value) => ({ value, references })),
    },
  };
};
