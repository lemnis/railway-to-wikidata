import fetch from "node-fetch";
import { LocationV3 } from "../types/location";
import { CodeIssuer, ISOAlpha2Code, Property } from "../types/wikidata";

interface Station {
  UICCode: string;
  stationType: string;
  EVACode?: string;
  code?: string;
  sporen: {
    spoorNummer: string;
  }[];
  synoniemen: string[];
  heeftFaciliteiten: boolean;
  heeftVertrektijden: boolean;
  heeftReisassistentie: boolean;
  namen?: {
    lang: string;
    middel: string;
    kort: string;
  };
  land?: string;
  lat?: number;
  lng?: number;
  /** @format int32 */
  radius?: number;
  /** @format int32 */
  naderenRadius?: number;
  /** @format date */
  ingangsDatum?: string;
  /** @format date */
  eindDatum?: string;
}

/** international vehicle registration code to ISO 3166-1 alpha-2 */
enum IVRtoISO {
  NL = "NL",
  D = "DE",
  B = "BE",
  GB = "GB",
  A = "AT",
  CH = "CH",
  F = "FR",
}

/**
 * Available apps for this location
 */
interface App {
  name?: string;

  /** Image which can be used as header image. This is usually a larger full color/resolution image. */
  listLogoImage?: Link;
  listLogoImages?: ResolutionAndFile[];
  links?: Record<string, AppLink>;
  categories?: string[];
}

interface AppLink {
  key?: string;
  url?: string;
  ppackage?: string;
  fallback?: string;
}

/**
 * Optional, extra information for this specific location
 */
interface ExtraInfo {
  text?: string;
}

/**
 * used internally by the places API, please use top level lat, lng
 */
interface GeoLocation {
  /** @format double */
  lat?: number;

  /** @format double */
  lon?: number;
}

/**
 * Image which can be used as header image. This is usually a larger full color/resolution image.
 */
interface Link {
  uri?: string;
}

/**
 * Represents a single location with usually a lat, lng. A place can have multiple locations.
 */
interface Location {
  /**
   * Unique identifier of the location
   * @example ChIJ2QUls2lrxkcRI4_mKWufkOM
   */
  placeId?: string;

  /** Sumo, Mauritsweg, Rotterdam */
  name?: string;

  /**
   * To which station this location belongs, optional
   * @example UT
   */
  stationCode?: string;

  /**
   * Latitude
   * @format double
   * @example 52.22491410000001
   */
  lat?: number;

  /**
   * longitude
   * @format double
   * @example 5.177699800000001
   */
  lng?: number;

  /** @format double */
  radius?: number;

  /** Contains a destination page */
  destinationPage?: boolean;

  /** used internally by the places API, please use top level lat, lng */
  location?: GeoLocation;

  /** Is this location open? */
  open?: "Yes" | "No" | "Unknown" | "open,close,unknown";

  /** Image which can be used as header image. This is usually a larger full color/resolution image. */
  link?: Link;

  /** Image which can be used as header image. This is usually a larger full color/resolution image. */
  thumbnail?: Link;

  /** Link to an external page with info about this location */
  infoUrl?: string;
  description?: string;

  /** Opening hours for the week */
  openingHours?: OpeningHour[];

  /** Extra untyped information, e.g. amount of OV-fiets available */
  extra?: Record<string, string>;

  /** Information images */
  infoImages?: RichImage[];

  /** Available apps for this location */
  apps?: App[];

  /** Available sites for this location */
  sites?: Site[];

  /** Optional, extra information for this specific location */
  extraInfo?: ExtraInfo[];
  incompleteRemarks?: string;

  /** Represents a single location with usually a lat, lng. A place can have multiple locations. */
  elasticSearchGeolocationToNull?: Location;
}

/**
 * Represents the OpeningHour of a single day
 */
interface OpeningHour {
  /** @format int32 */
  dayOfWeek?: number;

  /**
   * The time when this location will open
   * @example 13:00
   */
  startTime?: string;

  /**
   * The time when it is closed, note! when the end time is bigger then the start time, it closes the next day during the night
   * @example 01:00
   */
  endTime?: string;
  closesNextDay?: boolean;
}

interface Place {
  /**
   * Type
   * @example poi
   */
  type?: string;

  /**
   * Name
   * @example Sumo
   */
  name?: string;
  identifiers?: (
    | "ovfiets"
    | "fietsenstalling"
    | "zonetaxi"
    | "park_ride_paid"
    | "park_ride_free"
    | "greenwheels"
    | "stationinfoMissing"
    | "stationinfoBlacklist"
  )[];

  /**
   * Description of the place
   * @example Sumo, Mauritsweg, Rotterdam
   */
  description?: string;

  /**
   * List of categories to which a place belongs
   * @example shop,facility
   */
  categories?: string[];

  /** List locations for this place */
  locations?: Location[];

  /** Image which can be used as header image. This is usually a larger full color/resolution image. */
  listLogoImage?: Link;

  /**
   * The primary color for this place, value is in hex #ffffff
   * @example #f1f2f3
   */
  primaryColor?: string;

  /**
   * The secondary color for this place, value is in hex #ffffff
   * @example #f1f2f3
   */
  secondaryColor?: string;

  /**
   * The background color for this place, value is in hex #ffffff
   * @example #f1f2f3
   */
  backgroundColor?: string;

  /**
   * Is one of the locations open?, This is an aggregate of all Locations
   * @example yes
   */
  open?: "Yes" | "No" | "Unknown" | "yes,no,unknown";

  /** Opening hours for the week */
  openingHours?: OpeningHour[];

  /**
   * List of keywords
   * @example Koffie,Winkel
   */
  keywords?: string[];

  /** is this place part of a station */
  stationBound?: boolean;

  /** Image which can be used as header image. This is usually a larger full color/resolution image. */
  headerImage?: Link;

  /** Links to advert images */
  advertImages?: RichImage[];

  /** Links to info images */
  infoImages?: RichImage[];
  incompleteRemarks?: string;
}

interface Resolution {
  identifiers?: string[];
}

interface ResolutionAndFile {
  /** @format int32 */
  referenceCounter?: number;
  resolution?: Resolution;

  /** @format binary */
  file?: File;
  originalFilename?: string;
  deleted?: boolean;
}

/**
 * Links to info images
 */
interface RichImage {
  /** Name of the image */
  name?: string;

  /** Image which can be used as header image. This is usually a larger full color/resolution image. */
  link?: Link;

  /**
   * The type of image
   * @example landscape
   */
  qualifier?: "landscape,portrait,square";

  /**
   * The title
   * @example landscape
   */
  title?: "landscape,portrait,square";

  /** The subtitle which usually is below the title */
  subtitle?: string;

  /** Body text */
  body?: string;

  /** Text to be placed on a call to action button */
  buttonText?: string;

  /** Link that should be opened when a user presses the call to action button */
  buttonLink?: string;

  /** Which language this image is in */
  language?: string;
}

/**
 * Available sites for this location
 */
interface Site {
  qualifier?: string;
  url?: string;
}

const getPlaces = async () => {
  const response = await fetch(
    "https://gateway.apiportal.ns.nl/places-api/v2/places?limit=1000&type=stationV2",
    {
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": "51cd7a8d239c429ea12306b62f17d8a7",
      },
    }
  );

  const { payload }: { links: {}; payload: Place[]; meta: {} } =
    await response.json();
  return payload;
};

export const getRawStations = async (): Promise<LocationV3[]> => {
  const payload = await getPlaces();
  const stations: (Station & Location)[] | undefined = payload.find(
    ({ type }) => type === "stationV2"
  )?.locations as any;
  return (
    stations?.map((station) => ({
      labels: Array.from(
        new Set([
          ...station.synoniemen,
          ...Object.values(station.namen || {}),
          station.name!,
        ])
      )
        .filter(Boolean)
        .map((value) => ({ value })),
      claims: {
        [CodeIssuer.UIC]: [parseInt(station.UICCode)],
        [CodeIssuer.IBNR]: [station.EVACode],
        [Property.StationCode]: [station.code],
        [Property.Country]: [
          (ISOAlpha2Code as any)[(IVRtoISO as any)[station.land!]],
        ],
        [Property.CoordinateLocation]: [[station.lat, station.lng]],
        ...(station.sporen && {
          [Property.NumberOfPlatformFaces]: [station.sporen?.length].filter(
            Boolean
          ),
          [Property.NumberOfPlatformTracks]: [station.sporen?.length].filter(
            Boolean
          ),
        }),
        ...(station.land === "NL" && {
          [Property.OfficialWebsite]: station.sites
            ?.map((i) => i.url)
            .filter(Boolean),
        }),
      },
    })) || []
  );
};
