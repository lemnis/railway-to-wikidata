import fetch from "node-fetch";
import { NS_API_KEY } from "../../../environment";
import { Country, findCountryByIVR } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Items, Property } from "../../types/wikidata";
import { Place, Station, Location } from "./ns.types";

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

  const { payload }: { payload: Station[]; } =
    await response.json();
  return payload;
};

export const getLocations = async (): Promise<LocationV4[]> => {
  const stations = await getPlaces();
  return (
    stations?.map(
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
        id: `https://www.ns.nl/en/stationsinformatie/${code}`,
        labels: Array.from(new Set([...synoniemen, namen?.lang!]))
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
          [Property.Country]: [
            {
              value:
                // Overwrite incorrect Basel bad bhf country
                UICCode === "8014431"
                  ? Country.Switzerland.wikidata
                  : findCountryByIVR(land!)?.wikidata,
            },
          ],
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
