/// <reference path="../../types/fptf.d.ts" />
import { point } from "@turf/turf";
import comboios from "comboios";
import { findCountryByAlpha2 } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";

export const getLocations = () =>
  comboios.stations().then((locations) =>
    Promise.all(
      locations.map<Promise<Location>>(
        async ({ uicId, name, location, country, id }) =>
          point(
            [location.longitude, location.latitude],
            {
              labels: [{ value: name }],
              [CodeIssuer.UIC]: [{ value: uicId }],
              [Property.Country]: [
                { value: findCountryByAlpha2(country)?.wikidata! },
              ],
            },
            { id }
          )
      )
    )
  );
