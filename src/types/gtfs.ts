export const enum VehicleType {
  // Standard route types
  LIGHT_RAIL,
  METRO,
  TRAIN,
  BUS,
  FERRY,
  CABLE_CAR,
  GONDOLA,
  FUNICULAR,

  TROLLEY_BUS = 11,
  MONORAIL = 12,

  // Extended route types
  // https://developers.google.com/transit/gtfs/reference/extended-route-types

  // RAIL
  GENERIC_RAIL = 100,
  HIGH_SPEED_RAIL,
  LONG_DISTANCE_RAIL,
  INTER_REGIO_RAIL,
  CAR_TRANSPORT_RAIL,
  SLEEPER_RAIL,
  REGIONAL_RAIL,
  TOURIST_RAIL,
  RAIL_SHUTTLE,
  SUBURBAN_RAIL,
  REPLACEMENT_RAIL,
  SPECIAL_RAIL,
  TRUCK_TRANSPORT_RAIL,
  ALL_RAIL,
  CROSS_COUNTRY_RAIL,
  VEHICLE_TRANSPORT_RAIL,
  RACK_AND_PINION_RAIL,
  ADDITIONAL_RAIL,

  // COACH
  GENERIC_COACH = 200,
  INTERNATIONAL_COACH,
  NATIONAL_COACH,
  SHUTTLE_COACH,
  REGIONAL_COACH,
  SPECIAL_COACH,
  SIGHTSEEING_COACH,
  TOURIST_COACH,
  COMMUTER_COACH,
  ALL_COACH,

  // URBAN_RAIL
  GENERIC_URBAN_RAIL = 400,
  METRO_RAIL,
  UNDERGROUND,
  URBAN_RAIL,
  ALL_URBAN_RAIL,
  URBAN_MONORAIL,

  // BUS
  GENERIC_BUS = 700,
  REGIONAL_BUS,
  EXPRESS_BUS,
  STOPPING_BUS,
  LOCAL_BUS,
  NIGHT_BUS,
  POST_BUS,
  SPECIAL_NEEDS_BUS,
  MOBILITY_BUS,
  DISABILITY_BUS,
  SIGHT_SEEING_BUS,
  SHUTTLE_BUS,
  SCHOOL_BUS,
  PUBLIC_SERVICE_BUS,
  RAIL_REPLACEMENT_BUS,
  DEMAND_RESPONSIVE_BUS,
  ALL_BUS,

  // TROLLEY BUS
  GENERIC_TROLLEY_BUS = 800,

  // TRAM
  TRAM = 900,
  CITY_TRAM,
  LOCAL_TRAM,
  REGIONAL_TRAM,
  SIGHTSEEING_TRAM,
  SHUTTLE_TRAM,
  ALL_TRAM,

  WATER_TRANSPORT = 1000,

  AIR = 1100,

  GENERIC_FERRY = 1200,

  AERIALWAY = 1300,

  GENERIC_FUNICULAR = 1400,

  // TAXI
  TAXI = 1500,
  COMMUNAL_TAXI,
  WATER_TAXI,
  RAIL_TAXI,
  BIKE_TAXI,
  LICENSED_TAXI,
  PRIVATE_HIRE_TAXI,
  ALL_TAXI,

  // MISCELLANEOUS
  MISC = 1700,
  HORSE_DRAWN_CARRIAGE = 1702,
}

export const enum GTFSBool {
  NOT_SPECIFIED,
  YES,
  NO,
}
export const enum Alight {
  AVAILABLE = 0,
  NOT_AVAILABLE,
  MUST_CONTACT_AGENCY,
  MUST_CONTACT_DRIVER,
}

export const enum ExceptionType {
  SERVICE_ADDED = 1,
  SERVICE_REMOVED,
}

export const enum TransferType {
  RECCOMMENDED = 0,
  TIMED_TRANSFER,
  TIME_REQUIRED,
  NO_TRANSFER_POSSIBLE,
}

export const enum LocationType {
  STOP = 0,
  STATION,
  ENTRANCE_EXIST,
  GENERIC_NODE,
  BOARDING_AREA,
}

export const enum WheelchairBoardingType {
  UNKNOWN_OR_INHERIT = 0,
  ACCESSIBLE,
  NOT_ACCESSIBLE,
}

export const enum PickupDropoffType {
  CONTINUOUS = 0,
  NON_CONTINUOUS,
  MUST_CONTACT_AGENCY,
  MUST_CONTACT_DRIVER,
}

// files

export interface Agency {
  agency_id?: string;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
  agency_lang?: string;
  agency_phone?: string;
  agency_fare_url?: string;
  agency_email?: string;
}

export interface Stop {
  stop_id: string | number;
  stop_code?: string;
  stop_name?: string;
  stop_desc?: string;
  stop_lat?: number;
  stop_lon?: number;
  zone_id?: string;
  stop_url?: string;
  location_type?: LocationType;
  parent_station?: string;
  stop_timezone?: string;
  wheelchair_boarding?: WheelchairBoardingType | "";
  level_id?: string;
  platform_code?: string;
}

export interface Route {
  route_id: string;
  agency_id?: string;
  route_short_name?: string;
  route_long_name?: string;
  route_desc?: string;
  route_type: VehicleType;
  route_url?: string;
  route_color?: string;
  route_text_color?: string;
  route_sort_order?: number;
  continuous_pickup?: PickupDropoffType | "";
  continuous_drop_off?: PickupDropoffType | "";
}

export interface Trip {
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign?: string;
  trip_short_name?: string;
  direction_id?: 0 | 1;
  block_id?: string;
  shape_id?: string;
  wheelchair_accessible?: GTFSBool;
  bikes_allowed?: GTFSBool;
}

export interface StopTime {
  trip_id: string;
  arrival_time?: string;
  departure_time?: string;
  stop_id: string | number;
  stop_sequence: number;
  stop_headsign?: string;
  pickup_type?: Alight;
  drop_off_type?: Alight;
  continuous_pickup?: Alight;
  continuous_drop_off?: Alight;
  shape_dist_traveled?: number;
  timepoint?: 0 | 1 | "";
}

export interface Calendar {
  service_id: string;
  monday: 1 | 0;
  tuesday: 1 | 0;
  wednesday: 1 | 0;
  thursday: 1 | 0;
  friday: 1 | 0;
  saturday: 1 | 0;
  sunday: 1 | 0;
  start_date: string;
  end_date: string;
}

export interface CalendarDates {
  service_id: string;
  date: string;
  exception_type: ExceptionType;
}

export interface Shapes {
  shape_id: string;
  shape_pt_lat: number;
  shape_pt_lon: number;
  shape_pt_sequence: number;
  shape_dist_traveled?: number;
}

export interface Frequencies {
  trip_id: string;
  start_time: string;
  end_time: string;
  headway_secs: number;
  exact_times?: 0 | 1 | "";
}

export interface Transfers {
  from_stop_id: string | number;
  to_stop_id: string | number;
  transfer_type: TransferType;
  min_transfer_time: number;
}

export interface FeedInfo {
  feed_publisher_name: string;
  feed_publisher_url: string;
  feed_lang: string;
  default_lang: string;
  feed_start_date: string;
  feed_end_date: string;
  feed_version: string;
  feed_contact_email: string;
  feed_contact_url: string;
}