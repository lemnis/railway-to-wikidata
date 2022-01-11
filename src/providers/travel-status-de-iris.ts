import fetch from "node-fetch";
import { CodeIssuer, IBNRCountryCode, Property } from "../types/wikidata";
import { LocationV3 } from "../types/location";

export const getLocations = (): Promise<LocationV3[]> =>
  fetch(
    "https://raw.githubusercontent.com/derf/Travel-Status-DE-IRIS/master/share/stations.json"
  )
    .then((response) => response.json())
    .then(
      (
        data: {
          name: string;
          ds100: string;
          eva: number;
          latlong: [number, number];
        }[]
      ) =>
        data.map(({ name, ds100, eva, latlong }) => ({
          labels: [{ value: name }],
          claims: {
            [CodeIssuer.IBNR]: [eva.toString()],
            [CodeIssuer.DB]: [ds100],
            [Property.CoordinateLocation]: [latlong],
            // [Property.StationCode]: [ds100],
            [Property.Country]: [
              (IBNRCountryCode as any)[eva.toString().slice(0, 2)],
            ],
          },
        }))
    );
