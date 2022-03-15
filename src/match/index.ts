import { Position } from "geojson";
import { insideCircle, LatLon } from "geolocation-utils";
import { score } from "../score/label";
import { LocationV4, LocationV5 } from "../types/location";
import { Property, CodeIssuer, ClaimObject } from "../types/wikidata";

const ids: (CodeIssuer | Property.StationCode)[] = [
  Property.StationCode,
  CodeIssuer.ATOC,
  CodeIssuer.Benerail,
  CodeIssuer.DB,
  CodeIssuer.GaresAndConnexions,
  CodeIssuer.IATA,
  CodeIssuer.IBNR,
  CodeIssuer.SNCF,
  CodeIssuer.Trainline,
  CodeIssuer.UIC,
];

const matchValue = (
  id: Property | CodeIssuer,
  claim: ClaimObject,
  source: LocationV4
) => source.claims[id]?.some(({ value }) => value === claim.value) || false;

export const matchIds = (source: LocationV4, destination: LocationV4) =>
  ids.some((id) =>
    id === Property.StationCode
      ? destination.claims[id]?.some((claim) =>
          matchValue(id, claim, source)
        ) &&
        destination.claims[Property.Country]?.some((claim) =>
          matchValue(Property.Country, claim, source)
        )
      : destination.claims[id]?.some((claim) => matchValue(id, claim, source))
  );

const convertGeoJSONToLatLon = (poisition: Position | Position[]): LatLon[] => {
  const firstValue = poisition[0];
  const secondValue = poisition[1];
  if(typeof firstValue === 'number' && typeof secondValue === 'number') {
    return [
      {
        lat: secondValue,
        lon: firstValue,
      }
    ];
  } else {
    return (poisition as Position[]).map(([lon, lat]) => ({ lat, lon}))
  }
};

const matchCoordinates = (source: LocationV5, destination: LocationV5, maxDistance = 3000) => {
  const sourceCoordinates = convertGeoJSONToLatLon(source.geometry.coordinates);
  const destinationCoordinates = convertGeoJSONToLatLon(destination.geometry.coordinates);

  return sourceCoordinates.some(a => destinationCoordinates.some(b => insideCircle(b, a, maxDistance)));
};

const matchLabels = (source: LocationV5, destination: LocationV5) => {
  const sourceLabels = source.properties.labels;
  const destinationLabels = destination.properties.labels;
  return score(destinationLabels, sourceLabels).percentage > 0;
};

export const matchByNameAndDistance = (
  source: LocationV5,
  destination: LocationV5
) => {
  const coor = matchCoordinates(source, destination);
  if(!coor) return false;
  const l = matchLabels(source, destination);
  const m = matchLabels(destination, source);
  return coor && (l || m);
}

