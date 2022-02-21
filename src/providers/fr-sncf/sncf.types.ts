export interface SncfRawLocation {
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
}
