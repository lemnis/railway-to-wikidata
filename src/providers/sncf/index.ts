import fetch from "node-fetch";
import { LocationV4 } from "../../types/location";
import {
  CodeIssuer,
  Country,
  Property,
  UICCountryCode,
} from "../../types/wikidata";
import { mergeMultipleEntities } from "../../utils/combine-entity";
import { getGtfsStations } from "../../utils/gtfs";
import { logger } from "../../utils/logger";
import { SncfRawLocation } from "./sncf.types";

/**
 * Looks like complete list of (mostly) france stations,
 * amount of data is limite
 *
 * COMMERCIAL USE ALLOWED & CREATING DERIVED PRODUCTS ALLOWED
 *
 * @license ODbL
 * @see https://www.transit.land/feeds/f-u0-sncf~ter
 * @see https://transitfeeds.com/p/sncf/1069
 */
export const getGtfsLocations = () =>
  getGtfsStations(
    "https://eu.ftp.opendatasoft.com/sncf/gtfs/export-ter-gtfs-last.zip",
    "sncf"
  ).then((data) =>
    data
      .filter(
        ({ location_type }) =>
          (!!location_type && location_type.startsWith("StopArea:OCE")) ||
          location_type === "1"
      )
      .map<LocationV4>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
        const stationCode = stop_id.slice(12, 19);
        const labels = stop_name ? [{ value: stop_name }] : [];

        return {
          labels,
          claims: {
            [CodeIssuer.UIC]: [{ value: stationCode }],
            // [Property.StationCode]: [{ value: stationCode}],
            [Property.CoordinateLocation]: [
              { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
            ],
            [Property.Country]: [
              {
                value: stop_name.startsWith("Monaco")
                  ? Country.Monaco
                  : (UICCountryCode as any)[stationCode[0] + stationCode[1]],
              },
            ],
          },
        };
      })
  );

/**
 * List of bus stops and trains stations in mostly north east france,
 * contains a lot of operators for who it seems that it is impossible to digest a universial IDs.
 * Currently it only exports SNCF operated stations.
 *
 * `getGTFSLocations` is recommended instead.
 *
 * @license ODbL
 * @see https://data.sncf.com/explore/dataset/referentiel-gares-voyageurs/information/?disjunctive.gare_ug_libelle&sort=gare_alias_libelle_noncontraint
 */
export const getGtfsNorthEastLocations = () =>
  getGtfsStations<{
    stop_id: string;
    stop_name: string;
    stop_lat: string;
    stop_lon: string;
    location_type?: string;
    contributor_id: string;
    stop_timezone: string;
  }>(
    "https://navitia.opendatasoft.com/explore/dataset/fr-ne/files/8d4b8f3e30d5873cad1e53c73d356548/download/",
    "sncf-north-east"
  ).then((data) =>
    data
      .filter(({ location_type }) => location_type === "1")
      .map<LocationV4>(
        ({ stop_lat, stop_lon, stop_name, stop_id, ...item }) => {
          let stationCode: string = "";
          if (
            stop_id.startsWith("STE:SA:StopArea:OCE") ||
            stop_id.startsWith("STG:SA:StopArea:OCE") ||
            stop_id.startsWith("STE:SP:StopPoint") ||
            stop_id.startsWith("SIN:SP:StopPoint") ||
            stop_id.startsWith("STG:SP:StopPoint")
          ) {
            stationCode = stop_id.slice(-8, -1);
          } else {
            // TODO console.log(stop_id);
            return undefined as any;
          }

          const labels = stop_name ? [{ value: stop_name }] : [];

          return {
            labels,
            claims: {
              [CodeIssuer.UIC]: [{ value: stationCode }],
              // [Property.StationCode]: [{ value: stationCode}],
              [Property.CoordinateLocation]: [
                { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
              ],
              [Property.Country]: [
                {
                  value: stop_name.startsWith("Monaco")
                    ? Country.Monaco
                    : (UICCountryCode as any)[stationCode[0] + stationCode[1]],
                },
              ],
              [Property.LocatedInTimeZone]: [{ value: item.stop_timezone }],
            },
          };
        }
      )
      .filter(Boolean)
  );

/**
 * Looks like complete list of (mostly) france stations,
 * generate international code can't be trusted.
 *
 * @license ODbL
 * @see https://data.sncf.com/explore/dataset/referentiel-gares-voyageurs/information/?disjunctive.gare_ug_libelle&sort=gare_alias_libelle_noncontraint
 */
export const getGaresVoyageurs = () =>
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
                    { value: (UICCountryCode as any)[uic[0] + uic[1]] },
                  ],
                  [Property.PostalCode]: [{ value: adresse_cp }],
                  [Property.InAdministrativeTerritory]: [
                    { value: commune_libellemin },
                  ],
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
