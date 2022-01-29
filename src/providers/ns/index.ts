import fetch from "node-fetch";
import { NS_API_KEY } from "../../../environment";
import { findCountryByIVR } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Items, Property } from "../../types/wikidata";
import { Place, Station, Location } from "./ns.types";

const getPlaces = async () => {
  const response = await fetch(
    "https://gateway.apiportal.ns.nl/places-api/v2/places?limit=1000&type=stationV2",
    {
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": NS_API_KEY,
      },
    }
  );

  const { payload }: { links: {}; payload: Place[]; meta: {} } =
    await response.json();
  return payload;
};

export const getLocations = async (): Promise<LocationV4[]> => {
  const payload = await getPlaces();
  const stations = payload.find(({ type }) => type === "stationV2")
    ?.locations as (Station & Location)[] | undefined;
  return (
    stations?.map(
      ({
        lat,
        lng,
        code,
        EVACode,
        sites,
        synoniemen,
        land,
        sporen,
        namen,
        name,
        UICCode,
      }) => ({
        id: sites?.map((i) => i.url)?.[0] || code,
        labels: Array.from(new Set([name!, ...synoniemen, namen?.lang!]))
          .filter(Boolean)
          .map((value) => ({ value })),
        claims: {
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
          [Property.Country]: [{ value: findCountryByIVR(land!)?.wikidata }],
          ...(lat && lng
            ? {
                [Property.CoordinateLocation]: [{ value: [lat, lng] }],
              }
            : {}),
          ...(sporen && {
            [Property.NumberOfPlatformFaces]: [sporen?.length]
              .filter(Boolean)
              .map((value) => ({ value: value.toString() })),
            [Property.NumberOfPlatformTracks]: [sporen?.length]
              .filter(Boolean)
              .map((value) => ({ value: value.toString() })),
          }),
          ...(land === "NL" && {
            [Property.OfficialWebsite]: sites
              ?.map(({ url }) => url)
              .filter(Boolean)
              .map((value) => ({ value })),
          }),
        },
      })
    ) || []
  );
};
