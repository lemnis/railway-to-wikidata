import { featureCollection, multiPoint } from "@turf/turf";
import { findCountryByAlpha2 } from "../../transform/country";
import { Location } from "../../types/location";
import { Property, CodeIssuer } from "../../types/wikidata";
import { getCoords } from "../../utils/turf";
import { ReliabilityTrainline } from "./trainline.constants";
import { TrainlineStation } from "./trainline.types";

export const trainlineArrayToLocation = async (
  stations: TrainlineStation[]
): Promise<Location> => {
  const url = `https://trainline-eu.github.io/stations-studio/#/station/${stations[0].id}`;
  const references: any = [{ [Property.ReferenceURL]: url }];

  const labels = stations
    .map((station) => {
      const result = [];

      if (station.properties.name) {
        result.push({ value: station.properties.name });
      }

      Object.entries(station.properties)
        .filter(([key]) => key.startsWith("info:"))
        ?.forEach(([key, value]) =>
          result.push({
            value: value as string,
            lang: key.slice(key.indexOf(":") + 1),
          })
        );

      return result;
    })
    .flat();

  const properties: Location["properties"] = { labels };

  if (stations?.filter(({ properties }) => properties.uic).length) {
    properties[CodeIssuer.UIC] = stations
      ?.filter(({ properties }) => properties.uic)
      .map(({ properties }) => {
        const enabled = [];
        if (properties.sncf_is_enabled) enabled.push("trainline-sncf");
        if (
          properties.trenitalia_is_enabled &&
          properties.uic === properties.trenitalia_id
        )
          enabled.push("trainline-trenitalia");

        return {
          value: properties.uic,
          references,
          info: {
            reliability: ReliabilityTrainline[CodeIssuer.UIC],
            enabled: properties.sncf_is_enabled ? ["trainline-sncf"] : [],
          },
        };
      });
  }

  const countries = stations
    .map(({ properties }) => findCountryByAlpha2(properties.country!)?.wikidata)
    ?.map((value) => ({ value }));
  if (countries.length) properties[Property.Country] = countries;

  stations.forEach((station) => {
    if (station.properties.benerail_id) {
      properties[CodeIssuer.Benerail] ||= [];
      properties[CodeIssuer.Benerail]?.push({
        value: station.properties.benerail_id,
        references,
        info: {
          reliability: ReliabilityTrainline[CodeIssuer.Benerail],
          enabled: station.properties.benerail_is_enabled
            ? ["trainline-benerail"]
            : [],
        },
      });
    }

    if (station.properties.atoc_id) {
      properties[CodeIssuer.ATOC] ||= [];
      properties[CodeIssuer.ATOC]?.push({
        value: station.properties.atoc_id,
        references,
        info: {
          reliability: ReliabilityTrainline[CodeIssuer.ATOC],
          enabled: station.properties.atoc_is_enabled ? ["trainline-atoc"] : [],
        },
      });
    }

    if (station.properties.sncf_id) {
      properties[CodeIssuer.SNCF] ||= [];
      properties[CodeIssuer.SNCF]?.push({
        value: station.properties.sncf_id,
        references,
        info: {
          reliability: ReliabilityTrainline[CodeIssuer.SNCF],
          enabled: station.properties.sncf_is_enabled ? ["trainline-sncf"] : [],
        },
      });
    }

    if (station.id) {
      properties[CodeIssuer.Trainline] ||= [];
      properties[CodeIssuer.Trainline]?.push({
        value: station.id.toString(),
        references,
        info: {
          reliability: ReliabilityTrainline[CodeIssuer.Trainline],
          enabled: station.properties.is_suggestable ? ["trainline"] : [],
          slug: station.properties.slug,
        },
      });
    }

    [
      station.properties.cff_id,
      station.properties.db_id,
      station.properties.obb_id,
    ].forEach((id) => {
      if (!id || properties[CodeIssuer.IBNR]?.find(({ value }) => value === id))
        return;

      const enabled: string[] | false =
        station.properties.db_is_enabled ||
        station.properties.cff_is_enabled ||
        station.properties.obb_is_enabled
          ? []
          : false;
      if (station.properties.db_is_enabled)
        (enabled as any).push("trainline-db");
      if (station.properties.cff_is_enabled)
        (enabled as any).push("trainline-cff");
      if (station.properties.obb_is_enabled)
        (enabled as any).push("trainline-oebb");

      properties[CodeIssuer.IBNR] ||= [];
      properties[CodeIssuer.IBNR]?.push({
        value: id,
        references,
        info: { reliability: ReliabilityTrainline[CodeIssuer.IBNR] },
        enabled,
      });
    });
  });

  const location: Location = multiPoint(
    getCoords(featureCollection(stations)),
    properties,
    { id: `trainline-${stations.map(({ id }) => id).join("-")}` }
  );

  return location;
};
