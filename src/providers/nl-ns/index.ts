import fetch from "node-fetch";
import { NS_API_KEY } from "../../../environment";
import { Country, findCountryByIVR } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Items, Property } from "../../types/wikidata";
import { Station } from "./ns.types";

const getPlaces = async () => {
  const response = await fetch(
    "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations",
    {
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": NS_API_KEY,
      },
    }
  );

  const { payload }: { payload: Station[] } = await response.json();
  return payload;
};

/** @todo Implement english labelss */
export const getLocations = async () => {
  const stations = await getPlaces();
  return (
    stations
      ?.filter(({ lat, lng }) => lat != undefined && lng != undefined)
      .map<Location>(
        ({
          lat,
          lng,
          code,
          EVACode,
          synoniemen,
          land,
          sporen,
          namen,
          UICCode,
        }) => ({
          type: "Feature",
          id: `https://www.ns.nl/en/stationsinformatie/${code}`,
          geometry: {
            type: "Point",
            coordinates: [lng!, lat!],
          },
          properties: {
            labels: Array.from(new Set([...synoniemen, namen?.lang!]))
              .filter(Boolean)
              .map((value) => ({ value, lang: "nl" })),
            [CodeIssuer.UIC]: [{ value: UICCode }],
            [CodeIssuer.IBNR]: [{ value: EVACode }],
            [Property.StationCode]: [
              {
                value: code,
                qualifiers: {
                  [Property.AppliesToPart]: {
                    value: Items.NederlandseSpoorwegen,
                  },
                },
              },
            ],
            [Property.Country]: [
              {
                value:
                  // Overwrite incorrect Basel bad bhf country
                  UICCode === "8014431"
                    ? Country.Switzerland.wikidata
                    : findCountryByIVR(land!)?.wikidata,
              },
            ],
            ...(sporen && {
              [Property.NumberOfPlatformFaces]: [sporen?.length]
                .filter(Boolean)
                .map((value) => ({ value: value.toString() })),
              [Property.NumberOfPlatformTracks]: [sporen?.length]
                .filter(Boolean)
                .map((value) => ({ value: value.toString() })),
            }),
            // ...(land === "NL" && {
            //   [Property.OfficialWebsite]: sites
            //     ?.map(({ url }) => url)
            //     .filter(Boolean)
            //     .map((value) => ({ value })),
            // }),
          },
        })
      ) || []
  );
};
