import fetch from "node-fetch";
import { findCountryByUIC } from "../../transform/country";
import { Language } from "../../transform/language";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { merge as mergeMultipleEntities } from "../../actions/merge";
import { logger } from "../../utils/logger";
import { SncfRawLocation } from "./sncf.types";

/**
 * Looks like complete list of (mostly) france stations,
 * generate international code can't be trusted.
 *
 * @license ODbL
 * @see https://data.sncf.com/explore/dataset/referentiel-gares-voyageurs/information/?disjunctive.gare_ug_libelle&sort=gare_alias_libelle_noncontraint
 */
export const getLocations = async () => {
  const data: SncfRawLocation[] = await fetch(
    "https://ressources.data.sncf.com/explore/dataset/referentiel-gares-voyageurs/download/?format=json&timezone=Europe/Berlin&lang=fr"
  ).then((response) => response.json());

  const singleLocations = data
    .map((item) => item.fields)
    .filter(
      (item) =>
        typeof item.wgs_84?.[0] != undefined &&
        typeof item.wgs_84?.[1] != undefined
    )
    .map<Location>(
      ({
        uic_code,
        wgs_84,
        adresse_cp,
        gare_alias_libelle_noncontraint,
        gare_alias_libelle_fronton,
        commune_libellemin,
        longitude_entreeprincipale_wgs84,
        latitude_entreeprincipale_wgs84,
        tvs,
        code,
        ...fields
      }) => {
        const uic = uic_code.slice(2, 9);

        return {
          type: "Feature",
          id: code,
          geometry: { type: "Point", coordinates: [wgs_84[1], wgs_84[0]] },
          properties: {
            labels: [
              ...new Set([
                gare_alias_libelle_fronton,
                gare_alias_libelle_noncontraint,
              ]),
            ]
              .filter(Boolean)
              .map((value) => ({ value, lang: Language.French[1] })),
            ...{
              [CodeIssuer.UIC]: [{ value: uic }],
              [Property.Country]: [
                {
                  value: findCountryByUIC(parseInt(uic[0] + uic[1]))?.wikidata,
                },
              ],
              [Property.PostalCode]: [{ value: adresse_cp }],
              // [Property.InAdministrativeTerritory]: [
              //   { value: commune_libellemin },
              // ],
            },
            // ...(tvs
            //   ? {
            //       [CodeIssuer.SNCF]: ["FR" + tvs],
            //       [CodeIssuer.GaresAndConnexions]: [
            //         "fr" + tvs.toLowerCase(),
            //       ],
            //     }
            //   : {}),
          },
          info: fields,
        };
      }
    );

  const grouped = Object.values(
    singleLocations.reduce<Record<string, Location[]>>(
      (acc, location: Location) => {
        if (location.properties.info?.code_gare) {
          acc[location.properties.info?.code_gare] ||= [];
          acc[location.properties.info?.code_gare].push(location);
        } else {
          logger.error(
            `Location is missing code_gare property
            ${location.properties.labels?.[0].value}
            ${location.properties[CodeIssuer.UIC]}`
          );
        }

        return acc;
      },
      {}
    )
  )
  const merged = await Promise.all(grouped.map(i => mergeMultipleEntities(i)));
  return merged.sort((a, b) => a.id!.toString().localeCompare(b.id!.toString()));
};
