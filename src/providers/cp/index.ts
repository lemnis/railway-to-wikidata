/// <reference path="../../types/fptf.d.ts" />
import comboios from "comboios";
import { findCountryByAlpha2 } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";

export const getLocations = () => comboios.stations().then((locations) =>
  locations.map<LocationV4>(({ uicId, name, location, timezone, country }) => {
    return {
      labels: [{ value: name }],
      claims: {
        [CodeIssuer.UIC]: [{ value: uicId }],
        [Property.LocatedInTimeZone]: [{ value: timezone }],
        [Property.Country]: [{ value: findCountryByAlpha2(country)?.wikidata }],
        [Property.CoordinateLocation]: [{ value: [location.latitude, location.longitude] }],
      },
    };
  })
);
