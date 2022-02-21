import fetch from "node-fetch";
import { findCountryByUIC } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import {
  CodeIssuer,
  Property,
} from "../../types/wikidata";
import { mergeMultipleEntities } from "../../utils/combine-entity";
import { logger } from "../../utils/logger";
import { SncfRawLocation } from "./sncf.types";


/**
 * Looks like complete list of (mostly) france stations,
 * generate international code can't be trusted.
 *
 * @license ODbL
 * @see https://data.sncf.com/explore/dataset/referentiel-gares-voyageurs/information/?disjunctive.gare_ug_libelle&sort=gare_alias_libelle_noncontraint
 */
export const getLocations = () =>
  fetch(
    "https://ressources.data.sncf.com/explore/dataset/referentiel-gares-voyageurs/download/?format=json&timezone=Europe/Berlin&lang=fr"
  )
    .then((response) => response.json())
    .then((data: SncfRawLocation[]) =>
      data
        .map((item) => item.fields)
        .map<LocationV4>(
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
            ...fields
          }) => {
            const uic = uic_code.slice(2, 9);

            return {
              labels: [
                ...new Set([
                  gare_alias_libelle_fronton,
                  gare_alias_libelle_noncontraint,
                ]),
              ]
                .filter(Boolean)
                .map((value) => ({ value })),
              claims: {
                ...{
                  [CodeIssuer.UIC]: [{ value: uic }],
                  [Property.CoordinateLocation]: [{ value: wgs_84 }],
                  [Property.Country]: [
                    { value: findCountryByUIC(parseInt(uic[0] + uic[1]))?.wikidata },
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
        )
    )
    .then((data) => {
      return Object.values(
        data.reduce<Record<string, LocationV4[]>>(
          (acc, location: LocationV4) => {
            if (location.info?.code_gare) {
              acc[location.info?.code_gare] ||= [];
              acc[location.info?.code_gare].push(location);
            } else {
              logger.error(
                `Location is missing code_gare property
            ${location.labels?.[0].value}
            ${location.claims[CodeIssuer.UIC]}`
              );
            }

            return acc;
          },
          {}
        )
      ).map(mergeMultipleEntities);
    });
