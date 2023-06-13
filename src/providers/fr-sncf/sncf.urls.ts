// @ts-nocheck
/**
 * @module sncf/urls
 */

import { Language } from "../../transform/language";
import { Location } from "../../types/location";
import { CodeIssuer } from "../../types/wikidata";

const SUPPORTED_LANGS = [Language.English[1], Language.French[1]];

// var ROUTE_EN_LANG_GARE_NAME_UIC = ':lang/stations/:name/:uic';
// var ROUTE_EN_STATION_TIMETABLES = 'departures-arrivals(/:filter)(/:line)(/**)';
// var ROUTE_EN_STATION_SHOPS = 'shops-businesses(/:filter)(/**)';
// var ROUTE_EN_STATION_SERVICES = 'in-station-services(/:filter)(/**)';
// var ROUTE_EN_STATION_PUB_TRANSPORTS = 'public-transport(/:filter)(/**)';
// var ROUTE_EN_STATION_IND_TRANSPORTS = 'personal-transport(/:filter)(/**)';
// var ROUTE_EN_TIMETABLES_STATIONS = 'en/booking-itinerary/timetables';
// var ROUTE_EN_BOOK_TICKETS = 'en/booking-itinerary/book-tickets';
// var ROUTE_EN_RECHERCHE_ITINERAIRE = 'en/booking-itinerary/itinerary';
// var ROUTE_EN_ITINERAIRE_RESULTAT_DETAILS = 'en/booking-itinerary/itinerary/results-list/details';
// var ROUTE_EN_RESULTAT_DEDOUBLONNAGE_REDIRECT = 'en/booking-itinerary/search-train-number/train-selection/';
// var ROUTE_EN_RESULTAT_TRAIN_DEDOUBLONNAGE = "".concat(ROUTE_EN_RESULTAT_DEDOUBLONNAGE_REDIRECT, ":num_train");
// var ROUTE_EN_RESULTAT_SELECTION_CAR_REDIRECT = 'en/booking-itinerary/search-train-number/coach-selection/';
// var ROUTE_EN_SELECTION_CAR_DEDOUBLONNAGE = "".concat(ROUTE_EN_RESULTAT_SELECTION_CAR_REDIRECT, ":num_car");
// var ROUTE_EN_SELECTION_CAR = 'en/booking-itinerary/search-train-number/coach-details/:num_car';
// var ROUTE_EN_RESULTAT_TRAIN = 'en/booking-itinerary/search-train-number/train-details/:num_train';
// var ROUTE_EN_RECHERCHE_TRAIN = 'en/booking-itinerary/search-train-number';
// var ROUTE_EN_INTERCALARY_PAGE = 'en/disruption-information';
// var ROUTE_EN_PREVISIONS_TRAFIC = 'en/booking-itinerary/traffic-info(/:filter)';
// var ROUTE_EN_CLIENT_SERVICE = 'en/booking-itinerary/shops-ticket-machines/search-results';
// var ROUTE_EN_CLIENT_SERVICE_OUI = 'en/shops-ticket-machines';

var luhn = {
  checksum: function checksum(input) {
    var string = input.toString();
    var sum = 0;
    var parity = 2;
    for (var i = string.length - 1; i >= 0; i--) {
      var digit = Math.max(parity, 1) * string[i];
      sum +=
        digit > 9
          ? digit
              .toString()
              .split("")
              .map(Number)
              .reduce(function (a, b) {
                return a + b;
              }, 0)
          : digit;
      parity *= -1;
    }
    sum %= 10;
    return sum > 0 ? 10 - sum : 0;
  },
};

const getStationCode = (location: Location) => {
  const uic = location.properties[CodeIssuer.UIC];
  if (uic?.[0].value)
    return `OCE${uic?.[0].value}${luhn.checksum(uic?.[0].value.slice(2), {})}`;
};

export const getStationInformation = (
  location: Location,
  { lang = "en" }: { lang?: string } = {}
) => {
  const stationCode = getStationCode(location);
  if (!stationCode) return;
  if (!SUPPORTED_LANGS.includes(lang)) return;

  return `https://www.sncf.com/${lang}/stations/fake/${stationCode}`;
};

export const getStationDepartures = (
  location: Location,
  { lang = "en" }: { lang?: string } = {}
) => {
  const stationCode = getStationCode(location);
  if (!stationCode) return;
  if (!SUPPORTED_LANGS.includes(lang)) return;

  return `https://www.sncf.com/${lang}/stations/fake/${stationCode}/departures-arrivals/gl/departures`;
};

export const getStationArrivals = (
  location: Location,
  { lang = "en" }: { lang?: string } = {}
) => {
  const stationCode = getStationCode(location);
  if (!stationCode) return;
  if (!SUPPORTED_LANGS.includes(lang)) return;

  return `https://www.sncf.com/${lang}/stations/fake/${stationCode}/departures-arrivals/gl/arrivals`;
};

export const getRoute = (
  from: Location,
  to: Location,
  {
    date = new Date(Date.now()),
    lang = "en",
  }: { date?: Date; lang?: string } = {}
) => {
  const a = getStationCode(from);
  const b = getStationCode(to);
  if (!a || !b) return;
  if (!SUPPORTED_LANGS.includes(lang)) return;

  const search = new URLSearchParams();
  search.append("date", Math.floor(date.valueOf() / 1000).toString());
  search.append("uic1", a);
  search.append("label1", from.properties.labels[0].value);
  search.append("uic2", b);
  search.append("label2", to.properties.labels[0].value);
  search.append("listeCodesMode", "0,1,2,3,4,5,6,7,8,9");
  search.append("typeDepart", "ZONE_ARRET");
  search.append("typeArrivee", "ZONE_ARRET");

  return `https://www.sncf.com/${lang}/booking-itinerary/itinerary/results-list?${search.toString()}`;
};
