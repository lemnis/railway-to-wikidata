export interface DiDok {
  /**
   * UIC Country Code
   * @example 85
   */
  DS_LAENDERCODE: number;
  /**
   * Service ID
   * Number of the office to which the traffic point element is assigned.
   * Together with the country code, forms a unique key.
   * Numerically in the range 1 - 99,999.
   * @example 12345-6
   */
  DS_NUMMER: number;
  /**
   * Check digit
   * Arithmetical value which is formed from the agency ID.
   */
  PRUEFZIFFER: number;
  /**
   * Identification in accordance with the requirements of the
   * Union Internationale des Chemins de fer (UIC)for international data exchange.
   */
  BPUIC: string;
  /**
   * The SLOID is used as a unique key for traffic point elements (VPE).
   * @example stops range: ch: 1: sloid: 12345: 0
   * @example retaining edge: ch: 1: sloid: 12345: 0: 78910
   * @see [«SwissLocation ID» specification, Chapter 4.2]{@link https://transportdatamanagement.ch/en/standards/}
   */
  SLOID: string;
  /**
   * Official name of a department which must be adopted by all customers.
   * Maximum length 30 characters.
   */
  BEZEICHNUNG_OFFIZIELL: string;
  /**
   * Long name of a departement
   * Maximum length of 50 characters
   */
  BEZEICHNUNG_LANG: string;
  ABKUERZUNG: string;
  /**
   * Automatically calculated status of a department. Only the number in brackets is published in the export.
   * To seek (0)
   * to stop should the BAV requested
   * Requested (1)
   * stop was the BAV requested
   * plan (2)
   * Department / Station has been approved but not yet effective
   * in operation (3)
   * Department / Station is operating
   * Terminated (4)
   * the date of termination ( valid until) is recorded
   * In the follow-up (5)
   * Up to 6 months after "valid until"
   * Historically (6) The
   * office / stop is out of service for more than 6 months
   */
  STATUS: number;
  /**
   * If entirety of the departments has an operating point.
   */
  IS_BETRIEBSPUNKT: 0 | 1;
  IS_FAHRPLAN: string;
  /** Is open for passenger traffic */
  IS_HALTESTELLE: string;
  /** Is open for freight traffic */
  IS_BEDIENPUNKT: string;
  /** Is open for passenger or freight traffic */
  IS_VERKEHRSPUNKT: string;
  IS_VIRTUELL: number;

  GUELTIG_VON: string;
  GUELTIG_BIS: string;
  BEZEICHNUNG: string;
  BEZEICHNUNG_BETRIEBLICH: string;
  LAENGE: string;
  KANTENHOEHE: string;
  KOMPASSRICHTUNG: string;
  /** VPE Parent, SLOID used as key */
  BPVE_ID: string;
  /** Indicates type of PU involved
   * @example
   * 1 = stop edge
   * 2 = stop area
   */
  BPVE_TYPE: 0 | 1;
  /** @deprecated */
  HALTEBEREICH_TYPE: string;
  /** Latitude coordinate according to LV95 */
  E_LV95: number;
  /** Longitude coordinate according to LV95 */
  N_LV95: number;
  /** Height in meters */
  Z_LV95: number;
  /** Latitude coordinate according to LV03 */
  E_LV03: number;
  /** Longitude coordinate according to LV03 */
  N_LV03: number;
  /** Height in meters */
  Z_LV03: number;
  /** Latitude coordinate according to WGS84 */
  E_WGS84: number;
  /** Longitude coordinate according to WGS84 */
  N_WGS84: number;
  /** Height in meters */
  Z_WGS84: number;
  GEAENDERT_AM: string;
  DS_SLOID: string;
  DS_BEZEICHNUNG_OFFIZIELL: string;
  DS_GO_IDENTIFIKATION: string;
  DS_GO_NUMMER: string;
  DS_GO_ABKUERZUNG_DE: string;
  DS_GO_ABKUERZUNG_FR: string;
  DS_GO_ABKUERZUNG_IT: string;
  DS_GO_ABKUERZUNG_E: string;
}


export interface DidokRawLocation {
  datasetid: "dienststellen-gemass-opentransportdataswiss",
  recordid: string;
  fields: {
    /** Latitude coordinate according to LV95 */
    e_lv95: number;
    /** Longitude coordinate according to LV95 */
    n_lv95: number;
    /** Height in meters */
    z_lv95: number;
    /** Latitude coordinate according to LV03 */
    e_lv03: number;
    /** Longitude coordinate according to LV03 */
    n_lv03: number;
    /** Height in meters */
    z_lv03: number;
    /** Latitude coordinate according to WGS84 */
    e_wgs84: number;
    /** Longitude coordinate according to WGS84 */
    n_wgs84: number;
    /** Height in meters */
    z_wgs84: number;
    /** Abbreviation for the business organisation */
    go_abkuerzung_de: string,
    /** Swiss Administration ID (SAID),
     * part of the future Swiss ID for business organisation identification */
    go_identifikation: number,
    /** Number of the business organisation */
    go_nummer: number,
    /** Geoposition of the data set, [lat, lon] */
    geopos: [number, number],
    /** Abbreviation code for the station/operating point */
    abkuerzung: string,
    /**
     * URL, Linked Open Data representation of the stop.
     * @example http://lod.opentransportdata.swiss/didok/8509153
     */
    lod: string,
    /** Official name of the stop */
    bezeichnung_offiziell: string,
    /** Name of the municipality where the stop is located. */
    gemeindename: string,
    /** Abbreviation of the canton in which the stop is located */
    kantonskuerzel: string,
    /**
     * Type of transport that uses current stop
     * @example Bus
     */
    bpvh_verkehrsmittel_text_de: string,
    /** Service point is a stop */
    is_haltestelle: 0 | 1,
    /** Name of the business organisation */
    go_bezeichnung_de: string,
    /** Name of the locality */
    ortschaftsname: string,
    /** Number of the municipality according to FSO */
    bfs_nummer: 3921,
    /** Name of the district */
    bezirksname: string,
    /** Name of the canton in which the stop is located */
    kantonsname: string,
    /** ISO country code of the stop */
    land_iso2_geo: string,
    is_bedienpunkt: 0 | 1,
    /** Identification of the stop according to UIC specification */
    bpuic: number,
    bezirksnum: string,
    is_verkehrspunkt: 0 | 1,
    /** Number of the canton in which the stop is located (FSO) */
    kantonsnum: number,
    nummer: string,
  }
  geometry: {
    type: "Point";
    /** [Latitude, longitude] */
    coordinates: [number, number];
  };
  /** ISO Date */
  record_timestamp: string;
}
