import { Feature, Point, MultiPoint } from "@turf/turf";

export interface TrainlineStationProperties {
  id: string;
  name: string;
  slug: string;
  uic?: string;
  uic8_sncf?: string;
  latitude: string;
  longitude: string;
  parent_station_id?: string;
  country: string;
  time_zone: string;
  is_city: boolean;
  is_main_station: boolean;
  is_airport: boolean;
  is_suggestable: boolean;
  country_hint: boolean;
  main_station_hint: boolean;
  /** [A-Z]{5} */
  sncf_id?: string;
  /** [A-Z]{3}(_TRANS|_PSL)? */
  sncf_tvs_id?: string;
  sncf_is_enabled: boolean;
  /** [A-Z1]{3} */
  idtgv_id?: string;
  idtgv_is_enabled: boolean;
  /** [0-9]{6,7} */
  db_id?: string;
  db_is_enabled: boolean;
  /** [a-z0-9]{6} */
  busbud_id?: string;
  busbud_is_enabled: boolean;
  /** @?[A-Z]{5,8} */
  distribusion_id?: string;
  distribusion_is_enabled: boolean;
  /** [0-9]{2,5} */
  flixbus_id?: string;
  flixbus_is_enabled: boolean;
  /** [0-9]{4,7} */
  cff_id?: string;
  cff_is_enabled: boolean;
  /** ([0-9]{3,9}|[A-Z]{4,10}) */
  leoexpress_id?: string;
  leoexpress_is_enabled: boolean;
  /** [0-9]{6,7} */
  obb_id?: string;
  obb_is_enabled: boolean;
  /** [A-Z1]{3,5} */
  ouigo_id?: string;
  ouigo_is_enabled: boolean;
  /** [0-9]{7} */
  trenitalia_id?: string;
  trenitalia_is_enabled: boolean;
  /** (S|N)[0-9]{5} */
  trenitalia_rtvt_id?: string;
  /** [0-9]{3,4} */
  ntv_rtiv_id?: string;
  /** [A-Z_0]{3} */
  ntv_id?: string;
  ntv_is_enabled: boolean;
  /** [0-9]{9}s */
  hkx_id?: string;
  hkx_is_enabled: boolean;
  /** ([0-9]{5,7}|[A-Z -]{5}) */
  renfe_id?: string;
  renfe_is_enabled: boolean;
  /** ([0-9]{1,3}|[A-Z]{3}) */
  atoc_id?: string;
  atoc_is_enabled: boolean;
  /** [A-Z]{5} */
  benerail_id?: string;
  benerail_is_enabled: boolean;
  /** [0-9]{3} */
  westbahn_id?: string;
  westbahn_is_enabled: boolean;
  sncf_self_service_machine: boolean;
  same_as?: string;
  "info:de"?: string;
  "info:en"?: string;
  "info:es"?: string;
  "info:fr"?: string;
  "info:it"?: string;
  "info:nb"?: string;
  "info:nl"?: string;
  "info:cs"?: string;
  "info:da"?: string;
  "info:hu"?: string;
  "info:ja"?: string;
  "info:ko"?: string;
  "info:pl"?: string;
  "info:pt"?: string;
  "info:ru"?: string;
  "info:sv"?: string;
  "info:tr"?: string;
  "info:zh"?: string;
  normalised_code: string;
  iata_airport_code?: string;
}

export type TrainlineStation = Feature<
  Point | MultiPoint,
  Partial<TrainlineStationProperties>
>;

export type RawTrainlineStation = {
  [P in keyof TrainlineStationProperties]: TrainlineStationProperties[P] extends boolean
    ? "f" | "t"
    : TrainlineStationProperties[P];
};
