import fetch from "node-fetch";
import { DidokRawLocation } from "./didok.types";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { findCountryByAlpha2 } from "../../transform/country";

/**
 * @license Open use. Must provide source. https://opendata.swiss/de/dataset/haltestellen-des-offentlichen-verkehrs
 * @see https://data.sbb.ch/explore/dataset/dienststellen-gemass-opentransportdataswiss/information/
 */
export const getLocations = () =>
  fetch(
    "https://data.sbb.ch/explore/dataset/dienststellen-gemass-opentransportdataswiss/download/?format=json&timezone=Europe/Berlin&lang=en"
  )
    .then((response) => response.json())
    .then((locations: DidokRawLocation[]) =>
      locations
        .filter(({ fields }) =>
          fields.bpvh_verkehrsmittel_text_de?.includes("Zug")
        )
        .map<Location>(({ fields }) => {
          return {
            type: "Feature",
            id: fields.lod,
            geometry: {
              type: "Point",
              coordinates: [fields.geopos[1], fields.geopos[0]],
            },
            properties: {
              labels: [{ value: fields.bezeichnung_offiziell }],
              [Property.Country]: [
                { value: findCountryByAlpha2(fields.land_iso2_geo)?.wikidata },
              ],
              [CodeIssuer.UIC]: [{ value: fields.bpuic.toString() }],
              ...(fields.z_wgs84
                ? {
                    [Property.ElevationAboveSeaLevel]: [
                      { value: fields.z_wgs84.toString() },
                    ],
                  }
                : {}),
            },
          };
        })
    );
