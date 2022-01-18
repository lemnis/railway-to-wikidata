import { match as matchLabel } from "./label";
import { match as matchClaims } from "./property";
import { LocationV3, LocationV4 } from "../types/location";

export const match = (location: LocationV3, wikidata: LocationV4) => {
  const locationClaims: any = {};
  for (const key in location.claims) {
    if (Object.prototype.hasOwnProperty.call(location.claims, key)) {
      const element: any[] = (location.claims as any)[key];
      locationClaims[key] = element.map((value) => ({ value }));
    }
  }

  return {
    labels: matchLabel(location.labels, wikidata.labels),
    claims: matchClaims(
      locationClaims,
      wikidata.claims,
      { id: location.id, labels: location.labels, claims: locationClaims },
      wikidata
    ),
  };
};
