import { ResultSet } from "@lokidb/loki/types/loki/src/result_set";
import { destination } from "pino";
import { LocationV4 } from "../types/location";
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

// export const map = (sourceList: LocationV4[], destinationList: LocationV4[]) =>
//   sourceList.map((entity) =>
//     destinationList.map((destination) => matchIds(entity, destination))
//   );
