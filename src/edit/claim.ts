import { removeUri } from "../transform/simplify";
import { Match } from "../score/property";
import {
  ClaimObject,
  Constraint,
  PropertyOptions,
  Property,
  CodeIssuer,
} from "../types/wikidata";
import { logger } from "../utils/logger";
import { LocationV4 } from "../types/location";

export const editClaim = (
  matches: Record<string, { matches: Match[]; missing: boolean }>,
  destination: LocationV4
) => {
  const result: Record<string, ClaimObject[]> = {};

  for (const key in matches) {
    if (!Object.prototype.hasOwnProperty.call(matches, key)) {
      continue;
    }

    if(key === Property.DBStationCategory) console.log(key, matches[key], destination.claims[key]);

    const values = matches[key].matches
      .filter(({ match }) => !match)
      .map<ClaimObject>((match) => {
        const singleValueConstraint = [
          Constraint.SingleValue,
          Constraint.PreferSingle,
        ].some((constraint) =>
          PropertyOptions[key as keyof typeof PropertyOptions]?.[
            Property.PropertyConstraint
          ]?.includes(constraint)
        );

        if (singleValueConstraint && !match.missing) {
          const destinationPropertyClaims = destination.claims?.[key as Property | CodeIssuer]!;
          if ((destinationPropertyClaims?.length || -1) > 1) {
            logger.warn(
              destinationPropertyClaims,
              "Multiple values found on single contraint property"
            );
          } else if (
            (destinationPropertyClaims?.length || -1) === 1 &&
            destinationPropertyClaims![0].id
          ) {
            return {
              id: removeUri(destinationPropertyClaims![0].id),
              value: key === Property.CoordinateLocation ? { "latitude": match.value[0], "longitude": match.value[1], "precision": 0.01, "globe": "http://www.wikidata.org/entity/Q111" } : match.value,
            };
          }
        }

        return { value: match.value };
      });

    if (values.length) {
      result[key] ||= [];
      values.forEach((value) => result[key].push(value));
    }
  }

  return result;
};
