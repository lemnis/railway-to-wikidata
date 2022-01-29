import fetch from "node-fetch";
import { DidokRawLocation } from "./didok.types";
import { LocationV4 } from "../../types/location";
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
        .filter(({ fields }) => fields.bpvh_verkehrsmittel_text_de !== "Bus")
        .map<LocationV4>(({ fields }) => {
          return {
            id: fields.lod,
            labels: [{ value: fields.bezeichnung_offiziell }],
            claims: {
              [Property.Country]: [
                { value: findCountryByAlpha2(fields.land_iso2_geo)?.wikidata },
              ],
              [CodeIssuer.UIC]: [{ value: fields.bpuic.toString() }],
              [Property.CoordinateLocation]: [{ value: fields.geopos }],
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
