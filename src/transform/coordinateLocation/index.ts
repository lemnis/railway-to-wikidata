import { distanceTo } from "geolocation-utils";
import { ClaimObject } from "../../types/wikidata";

export const scoreCoordinateLocation = (
  source: ClaimObject<[number, number]>[],
  destination: ClaimObject<[number, number]>[]
) =>
  source
    .map(({ value }) => value)
    .filter(
      (c): c is [number, number] =>
        !!c && c[0] != undefined && c[1] !== undefined
    )
    .map((value) => {
      if (destination.length === 0) {
        return {
          value,
          match: false,
          missing: true,
        };
      }

      const distance = destination
        ?.map(({ value }) => value)
        .filter((value) => value?.[0] && value?.[1] && value?.length === 2)
        .map((destinationCoordinates) =>
          distanceTo(value, destinationCoordinates!)
        )
        // Sort by distance and get closest one
        .sort((a, b) => a - b)?.[0];

      return {
        distance,
        value,
        match: distance < 3000,
        missing: false,
      };
    });
