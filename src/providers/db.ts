import fetch from "node-fetch";
import { LocationV3 } from "../types/location";
import { CodeIssuer, Country, Property } from "../types/wikidata";

export const ACCESS_TOKEN = "47d80798b3d3b20b75cb4d6dc9835952";

export const getLocations = (): Promise<LocationV3[]> =>
  fetch("https://api.deutschebahn.com/stada/v2/stations", {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  })
    .then((response) => response.json())
    .then((data) => data.result)
    .then((data: any[]) =>
      data.map((item) => {
        const { mailingAddress, evaNumbers, ril100Identifiers, name } = item;

        // I believe the list only contains geman stations
        if (name.toLowerCase().includes("amsterdam")) console.log(item);

        return {
          claims: {
            [Property.InAdministrativeTerritory]: mailingAddress.city,
            [Property.PostalCode]: mailingAddress.zipcode,
            [Property.Location]: mailingAddress.street,

            // [Property.StationCode]: [
            //   ...evaNumbers.map((i: any) => i.number),
            //   ...ril100Identifiers.map((i: any) => i.rilIdentifier),
            // ].filter(Boolean),
            [CodeIssuer.IBNR]: evaNumbers.map((i: any) => i.number),
            [CodeIssuer.DB]: ril100Identifiers.map((i: any) => i.rilIdentifier),
            [Property.CoordinateLocation]: evaNumbers
              .map((i: any) => i.geographicCoordinates)
              .filter(Boolean),
            [Property.Country]: [Country.Germany],
          },
          labels: [{ value: name }],
        };
      })
    );
