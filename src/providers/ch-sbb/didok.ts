import fetch from "node-fetch";
import { DidokRawLocation } from "./didok.types";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { Country, findCountryByAlpha2 } from "../../transform/country";
import { RELIABILITY_UIC_SBB } from "./ch-sbb.constants";
import { groupByScore } from "../../group/score";
import { merge } from "../../actions/merge";
import { point } from "@turf/turf";

/**
 * @license Open use. Must provide source. https://opendata.swiss/de/dataset/haltestellen-des-offentlichen-verkehrs
 * @see https://data.sbb.ch/explore/dataset/dienststellen-gemass-opentransportdataswiss/information/
 */
export const getLocations = async () => {
  const locations: DidokRawLocation[] = await fetch(
    "https://data.sbb.ch/explore/dataset/dienststellen-gemass-opentransportdataswiss/download/?format=json&timezone=Europe/Berlin&lang=en"
  ).then((response) => response.json() as any);

  const ungroupedStations = locations
    .filter(({ fields }) => fields.bpvh_verkehrsmittel_text_de?.includes("Zug"))
    .map<Location>(({ fields, recordid: id }) => {
      const country = findCountryByAlpha2(fields.land_iso2_geo);

      return point(
        [fields.geopos[1], fields.geopos[0]],
        {
          labels: [{ value: fields.bezeichnung_offiziell }],
          [Property.Country]: [{ value: country?.wikidata }],
          [CodeIssuer.UIC]: [
            {
              value: fields.bpuic.toString(),
              ...(country === Country.Austria
                ? { info: { reliability: RELIABILITY_UIC_SBB } }
                : {}),
            },
          ],
          ...(fields.z_wgs84
            ? {
                [Property.ElevationAboveSeaLevel]: [
                  { value: fields.z_wgs84.toString() },
                ],
              }
            : {}),
        },
        { id }
      );
    })
    .sort((a, b) => a.id!.toString().localeCompare(b.id!.toString()));
    
  const groupedStations = await groupByScore(
    ungroupedStations,
    (score) => score?.percentage >= 2.2
  );

  return await Promise.all(
    groupedStations.map((stations) =>
      stations.length > 1 ? merge(stations, false, false) : stations[0]
    )
  );
};
