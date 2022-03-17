/// <reference path="../../types/fptf.d.ts" />
import comboios from "comboios";
import { findCountryByAlpha2 } from "../../transform/country";
import { getTimeZonesByName } from "../../transform/locatedInTimeZone/utils/collection";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";

export const getLocations = () =>
  comboios.stations().then((locations) =>
    Promise.all(
      locations.map<Promise<Location>>(
        async ({ uicId, name, location, timezone, country, id }) => {
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [location.longitude, location.latitude],
            },
            properties: {
              id,
              labels: [{ value: name }],
              [CodeIssuer.UIC]: [{ value: uicId }],
              [Property.LocatedInTimeZone]: [
                { value: (await getTimeZonesByName(timezone))?.[0]?.id },
              ],
              [Property.Country]: [
                { value: findCountryByAlpha2(country)?.wikidata },
              ],
            },
          };
        }
      )
    )
  );
