/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface StationQuery {
  /**
   * offset of the first result object with respect to the total number  of hits produced by the query
   * @format int64
   */
  offset?: number;

  /**
   * maximum number of result objects to be returned
   * @format int64
   */
  limit?: number;

  /**
   * total number of hits produced by that query
   * @format int64
   */
  total?: number;

  /** result objects produced by that query */
  result?: Station[];
}

export interface SZentraleQuery {
  /**
   * offset of the first result object with respect to the total number of  hits produced by the query
   * @format int64
   */
  offset?: number;

  /**
   * maximum number of result objects to be returned
   * @format int64
   */
  limit?: number;

  /**
   * total number of hits produced by that query
   * @format int64
   */
  total?: number;

  /** result objects produced by that query */
  result?: SZentrale[];
}

export interface Error {
  /**
   * error number
   * @format int32
   */
  errNo?: number;

  /** error message */
  errMsg?: string;
}

export interface Station {
  /**
   * unique identifier representing a specific railway station
   * @format int32
   */
  number?: number;

  /** the stations name */
  name?: string;

  /** mailing address of the railway station */
  mailingAddress?: Address;

  /**
   * the stations category (-1...7). Stations with category -1 or 0 are not in production, e.g. planned, saled, without train stops.
   * @format int32
   */
  category?: number;

  /**
   * determines in some respect the price for train stops at a specific station (1..7)
   * @format int32
   */
  priceCategory?: number;

  /** german federal state */
  federalState?: string;

  /** public parking y/n */
  hasParking?: boolean;

  /** public bicycle parking y/n */
  hasBicycleParking?: boolean;

  /** public facilities y/n */
  hasPublicFacilities?: boolean;

  /** public facilities y/n */
  hasLockerSystem?: boolean;

  /** local public transport y/n */
  hasLocalPublicTransport?: boolean;

  /** taxi rank in front of the station y/n */
  hasTaxiRank?: boolean;

  /** a shop for travel necessities y/n */
  hasTravelNecessities?: boolean;

  /** stepless access is availiable yes, no or partial */
  hasSteplessAccess?: Partial;

  /** values are 'no', 'yes, advance notification is requested...' or 'yes, advance notification is required...' */
  hasMobilityService?: string;

  /** public Wi-Fi is available y/n */
  hasWiFi?: boolean;

  /** local travel center y/n */
  hasTravelCenter?: boolean;

  /** railway mission y/n */
  hasRailwayMission?: boolean;

  /** DB lounge y/n */
  hasDBLounge?: boolean;

  /** lost and found y/n */
  hasLostAndFound?: boolean;

  /** car sharing or car rental y/n */
  hasCarRental?: boolean;

  /** station related EVA-Numbers */
  evaNumbers?: EVANumber[];

  /** station related Ril100s */
  ril100Identifiers?: RiL100Identifier[];
  timetableOffice?: TimetableOffice;
  stationManagement?: StationManagementRef;

  /** a weekly schedule */
  localServiceStaff?: Schedule;

  /** a weekly schedule */
  DBinformation?: Schedule;

  /** reference object. an internal organization type of Station&Service, regional department. */
  regionalbereich?: RegionalBereichRef;

  /** reference object contained in station */
  szentrale?: SZentraleRef;

  /** local public sector entity, responsible for short distance public transport in a specific area */
  aufgabentraeger?: Aufgabentraeger;
}

export interface EVANumber {
  /** EVA identifier */
  number?: number;

  /** station related EVA-Numbers */
  isMain?: boolean;

  /** GEOJSON object of type point. By default WGS84 is the coordinate system in GEOJSON. */
  geographicCoordinates?: GeographicPoint;
}

/**
 * reference object contained in station
 */
export interface SZentraleRef {
  /**
   * unique identifier for SZentrale
   * @format int32
   */
  number?: number;

  /** unique identifier of 3SZentrale */
  name?: string;
  publicPhoneNumber?: string;
}

/**
 * 3-S-Zentralen are 7/24 hours operating centers for german railway stations
 */
export interface SZentrale {
  /**
   * unique identifier for SZentrale
   * @format int32
   */
  number?: number;

  /** unique identifier of 3SZentrale */
  name?: string;
  publicPhoneNumber?: string;
  address?: Address;

  /** public fax number */
  publicFaxNumber?: string;

  /** internal phone number */
  internalPhoneNumber?: string;

  /** internal fax number */
  internalFaxNumber?: string;

  /** mobile phone number (no longer supported!) */
  mobilePhoneNumber?: string;

  /** email adress of the 3-S-Zentrale (no longer supported!) */
  email?: string;
}

export interface Address {
  street?: string;
  houseNumber?: string;
  zipcode?: number;
  city?: string;
}

export interface TimetableOffice {
  /** identifier */
  name?: string;

  /** email */
  email?: string;
}

export interface StationManagementRef {
  name?: string;

  /** identifier */
  number?: number;
}

export interface StationManagement {
  name?: string;

  /** identifier */
  number?: number;
}

/**
 * GEOJSON object of type point. By default WGS84 is the coordinate system in GEOJSON.
 */
export interface GeographicPoint {
  /** the type of the GEOJSON Object e.g. point. Currently only point coordinates without altitude are provided. */
  type?: string;

  /** first value is longitude, second latitude third altitude (currently not provided) */
  coordinates?: number[];
}

export interface RiL100Identifier {
  /** Unique identifier of 'Betriebsstelle' according to Ril100 */
  rilIdentifier?: string;

  /** is stations main Ril100. Determination of Station&Service AG */
  isMain?: boolean;

  /** permission for steam engines y/n */
  hasSteamPermission?: boolean;

  /** GEOJSON object of type point. By default WGS84 is the coordinate system in GEOJSON. */
  geographicCoordinates?: GeographicPoint;
}

/**
 * period of time from/to
 */
export interface OpeningHours {
  /** @format date */
  fromTime?: string;

  /** @format date */
  toTime?: string;
}

/**
 * a weekly schedule
 */
export interface Schedule {
  /** period of time from/to */
  monday?: OpeningHours;

  /** period of time from/to */
  tuesday?: OpeningHours;

  /** period of time from/to */
  wednesday?: OpeningHours;

  /** period of time from/to */
  thursday?: OpeningHours;

  /** period of time from/to */
  friday?: OpeningHours;

  /** period of time from/to */
  saturday?: OpeningHours;

  /** period of time from/to */
  sunday?: OpeningHours;

  /** period of time from/to */
  holiday?: OpeningHours;
}

/**
 * reference object. an internal organization type of Station&Service, regional department.
 */
export interface RegionalBereichRef {
  /** name of the regional department */
  name?: string;
  shortName?: string;

  /**
   * unique identifier of the regional department
   * @format int32
   */
  number?: number;
}

/**
 * reference object. an internal organization type of Station&Service, regional department.
 */
export interface Regionalbereich {
  /** name of the regional department */
  name?: string;
  shortName?: string;

  /**
   * unique identifier of the regional department
   * @format int32
   */
  number?: number;
}

/**
 * local public sector entity, responsible for short distance public transport in a specific area
 */
export interface Aufgabentraeger {
  /** unique identifier */
  shortname?: string;

  /** full name of Aufgabentraeger */
  name?: string;
}

export enum Partial {
  Yes = "yes",
  No = "no",
  Partial = "partial",
}
