import fetch from "node-fetch";
import { LocationV3 } from "../types/location";
import {
  CodeIssuer,
  Country,
  Property,
  UICCountryCode,
} from "../types/wikidata";
import { mergeMultipleEntities } from "../utils/combine-entity";
import { getGtfsStations } from "../utils/gtfs";
import { logger } from "../utils/logger";

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
export const getGtfsLocations = (): Promise<LocationV3[]> =>
  getGtfsStations("https://eu.ftp.opendatasoft.com/sncf/gtfs/export-ter-gtfs-last.zip", "sncf")
    .then((data) =>
      data
        .filter(
          ({ location_type }) =>
            (!!location_type && location_type.startsWith("StopArea:OCE")) ||
            location_type === "1"
        )
        .map(({ stop_lat, stop_lon, stop_name, ...item }) => {
          const stationCode = item.stop_id.slice(12, 19);
          const labels = stop_name ? [{ value: stop_name }] : [];

          return {
            labels,
            claims: {
              [CodeIssuer.UIC]: [parseFloat(stationCode)],
              [Property.StationCode]: [stationCode],
              [Property.CoordinateLocation]: [
                [parseFloat(stop_lat), parseFloat(stop_lon)],
              ],
              [Property.Country]: [
                stop_name.startsWith("Monaco")
                  ? Country.Monaco
                  : (UICCountryCode as any)[stationCode[0] + stationCode[1]],
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
export const getGtfsNorthEastLocations = (): Promise<LocationV3[]> =>
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
      .map(({ stop_lat, stop_lon, stop_name, stop_id, ...item }) => {
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
            [CodeIssuer.UIC]: [parseFloat(stationCode)],
            [Property.StationCode]: [stationCode!],
            [Property.CoordinateLocation]: [
              [parseFloat(stop_lat), parseFloat(stop_lon)],
            ],
            [Property.Country]: [
              (UICCountryCode as any)[stationCode![0] + stationCode![1]],
            ],
            [Property.LocatedInTimeZone]: [item.stop_timezone]
          },
        };
      })
      .filter(Boolean)
  );

/**
 * Looks like complete list of (mostly) france stations,
 * generate international code can't be trusted.
 * 
 * @license ODbL
 * @see https://data.sncf.com/explore/dataset/referentiel-gares-voyageurs/information/?disjunctive.gare_ug_libelle&sort=gare_alias_libelle_noncontraint
 */
export const getGaresVoyageurs = (): Promise<LocationV3[]> =>
  fetch(
    "https://ressources.data.sncf.com/explore/dataset/referentiel-gares-voyageurs/download/?format=json&timezone=Europe/Berlin&lang=fr"
  )
    .then((response) => response.json())
    .then(
      (
        data: {
          datasetid: "referentiel-gares-voyageurs";
          recordid: string;
          fields: {
            /** Stringified data object */
            gare: string;

            /** Identifier of complete station */
            code_gare: string;
            /** Unique identifier of current section */
            code: string;

            /** UIC code */
            uic_code: string;
            /** Latitude */
            latitude_entreeprincipale_wgs84: string;
            /** longitude */
            longitude_entreeprincipale_wgs84: string;
            /** [Latitude, longitude] */
            wgs_84: [number, number];
            /** Postal code */
            adresse_cp: string;
            /**
             * a: Passenger stations of national interest. >250,000 travelers per year.
             * b: Passenger stations of regional interest. >100,000 travelers per year.
             * c: Local passenger stations.
             */
            segmentdrg_libelle: "a" | "b" | "c";

            /** Foreign station */
            gare_etrangere_on: "False" | "True";
            /** Level of service */
            niveauservice_libelle: number;
            /** Track DRG */
            gare_drg_on: "True" | "False";

            /** Region agency, Territorial Direction Station */
            gare_agencegc_libelle: string;
            /** Region */
            gare_regionsncf_libelle: string;

            /** NSEE department code (P2586)  */
            departement_numero: string;
            /** NSEE department code - label */
            departement_libellemin: string;
            /** NSEE municipality code = departement_numero + commune_code */
            commune_code: string;
            /** NSEE municipality code - label */
            commune_libellemin: string;

            /** Name of complete location */
            gare_alias_libelle_noncontraint: string;
            /** Name of complete location */
            gare_alias_libelle_fronton: string;
            /** Name of current section */
            alias_libelle_noncontraint: string;
            /** UT */
            gare_ut_libelle: string;
            /** Station unit (region name) */
            gare_ug_libelle: string;
            /** RG */
            rg_libelle: string;
            /** Number of platforms */
            gare_nbpltf: 1;

            tvs: string;
            /** TVSs */
            tvss: string;
          };
          geometry: {
            type: "Point";
            /** [Latitude, longitude] */
            coordinates: [number, number];
          };
          /** ISO Date */
          record_timestamp: string;
        }[]
      ) =>
        data
          .map((item) => item.fields)
          .map(
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
                    [CodeIssuer.UIC]: [parseInt(uic)],
                    [Property.CoordinateLocation]: [wgs_84],
                    [Property.Country]: [
                      (UICCountryCode as any)[uic[0] + uic[1]],
                    ],
                    [Property.PostalCode]: [adresse_cp],
                    [Property.InAdministrativeTerritory]: [commune_libellemin],
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
    ).then(data => {
      return Object.values(
        data.reduce<Record<string, LocationV3[]>>((acc, location: LocationV3) => {
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
        }, {})
      ).map(mergeMultipleEntities);
    });
