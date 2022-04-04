import { findCountryByAlpha2 } from "../../transform/country";
import { getTimeZonesByName } from "../../transform/locatedInTimeZone/utils/collection";
import { Location } from "../../types/location";
import { Property, CodeIssuer } from "../../types/wikidata";
import { ReliabilityTrainline } from "./trainline.constants";
import { TrainlineStation } from "./trainline.types";

export const trainlineArrayToLocation = async (
  stations: TrainlineStation[]
): Promise<Location> => {
  const url = `https://trainline-eu.github.io/stations-studio/#/station/${stations[0].id}`;
  const references = { [Property.ReferenceURL]: url };

  const location: Location = {
    type: "Feature",
    id: `trainline-${stations.map(({ id }) => id).join('-')}`,
    geometry: {
      type: "MultiPoint",
      coordinates:
        stations
          .filter(
            ({ coordinates }) => coordinates?.filter(Boolean).length === 2
          )
          ?.map(({ coordinates }) => [coordinates[1], coordinates[0]]) || [],
    },
    properties: {
      labels: [
        ...stations
          .map((station) =>
            Object.entries(station)
              .filter(([key]) => key.startsWith("info:"))
              ?.map(([key, value]) => ({
                value: value as string,
                lang: key.slice(key.indexOf(":") + 1),
              }))
          )
          .flat(2)
          .filter(Boolean),
        ...(stations.map(({ name }) => name)?.length
          ? stations
              ?.map((station) => ({
                value: station.name,
                lang: findCountryByAlpha2(station.country)?.language?.[1],
              }))
              .flat()
          : []),
      ],
    },
  };

  if (stations?.filter(({ uic }) => uic).length) {
    location.properties[CodeIssuer.UIC] = stations?.map(({ uic }) => ({
      value: uic,
      references,
      info: { reliability: ReliabilityTrainline[CodeIssuer.UIC] },
    }));
  }

  const countries = stations
    .map(({ country }) => findCountryByAlpha2(country)?.wikidata)
    ?.map((value) => ({ value }));
  if (countries.length) location.properties[Property.Country] = countries;

  if (stations?.filter(({ benerail_id }) => benerail_id).length) {
    location.properties[CodeIssuer.Benerail] = stations?.map(
      ({ benerail_id }) => ({
        value: benerail_id,
        references,
      })
    );
  }

  if (stations?.filter(({ atoc_id }) => atoc_id).length) {
    location.properties[CodeIssuer.ATOC] = stations?.map(({ atoc_id }) => ({
      value: atoc_id,
      references,
    }));
  }

  if (stations?.filter(({ sncf_id }) => sncf_id).length) {
    location.properties[CodeIssuer.SNCF] = stations?.map(({ sncf_id }) => ({
      value: sncf_id,
      references,
    }));
  }

  if (stations?.filter(({ id }) => id).length) {
    location.properties[CodeIssuer.Trainline] = stations?.map(({ id }) => ({
      value: id,
      references,
    }));
  }

  const timeZones = await Promise.all(
    [...new Set(stations?.map(({ time_zone }) => time_zone))].map(
      async (time_zone) => ({
        value: (await getTimeZonesByName(time_zone))?.[0]?.id,
        references,
      })
    )
  );
  if (timeZones.length)
    location.properties[Property.LocatedInTimeZone] = timeZones;

  if (stations?.filter(({ iata_airport_code }) => iata_airport_code).length) {
    location.properties[CodeIssuer.IATA] = stations?.map(
      ({ iata_airport_code }) => ({
        value: iata_airport_code,
        references,
      })
    );
  }

  const ibnr = Array.from(
    new Set(
      stations
        .map(({ cff_id, db_id, obb_id }) => [cff_id, db_id, obb_id])
        .flat(2)
        .filter(Boolean)
    )
  );
  if (ibnr.length) {
    location.properties[CodeIssuer.IBNR] = ibnr?.map((value) => ({
      value,
      references,
      info: { reliability: ReliabilityTrainline[CodeIssuer.IBNR] },
    }));
  }

  return location;
};
