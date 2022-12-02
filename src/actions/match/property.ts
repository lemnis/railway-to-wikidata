import { scoreStationCode } from "../../transform/stationCode";
import { ClaimObject, CodeIssuer, Property } from "../../types/wikidata";

export const propertyMatch = async (
  key: CodeIssuer | Property,
  origin: ClaimObject<any>[],
  destination: ClaimObject<any>[]
) => {
  if (key === Property.StationCode) {
    return scoreStationCode(origin, destination);
  }

  return origin?.map((a) => {
    const b = destination.find((b) => a.value === b.value);

    return {
      match: !!b,
      value: a,
      origin: b,
      missing: destination.length === 0,
    };
  });
};
