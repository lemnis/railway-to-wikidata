import { LocationV4 } from "../../types/location";
import { ClaimObject, Property } from "../../types/wikidata";
import { db } from "../../utils/database";
import { getTimeZoneByWikiIds, getTimeZoneByWikiId } from "./utils/collection";
import { getTimeZoneOffset } from "./utils/getTimeZoneOffset";

/**
 * Returns offset by looking up data of cached wikidata entity or Intl timezone
 */
const getOffset = (claims: LocationV4[]) => {
  const result: number[] = [];

  claims.forEach((claim) => {
    const claimValues = claim.claims[Property.UTCTimezoneOffset]
      ?.map(({ value }) => value)
      .filter((x): x is string => x !== undefined);
    const labels = claim.labels?.map(({ value }) => value).filter(Boolean);

    if (claimValues) {
      for (const value of claimValues) {
        result.push(parseFloat(value));
      }
    }
    for (const label of labels) {
      try {
        result.push(getTimeZoneOffset(label));
      } catch {}
    }
  });

  return result;
};

export const scoreLocatedInTimeZone = async (
  source: ClaimObject<string>[],
  destination: ClaimObject<string>[]
) => {
  const destinationValues = destination
    .map(({ value }) => value)
    .filter((item): item is string => !!item);
  const destinationObjects = await getTimeZoneByWikiIds(destinationValues);
  const destinationOffsets = getOffset(destinationObjects);
  const destinationSameAs = destinationObjects
    .map((object) => object.claims[Property.SaidToBeTheSameAs])
    .flat()
    .map((obj) => obj?.value)
    .filter((item): item is string => !!item);
  const destinationLocatedInTimeZone = destinationObjects
    .map((object) => object.claims[Property.LocatedInTimeZone])
    .flat()
    .map((obj) => obj?.value)
    .filter((item): item is string => !!item);

  const values = source
    .map(({ value }) => value)
    .filter((item): item is string => !!item);
  const missing = !destinationValues.length;

  const result = values.map(async (value) => {
    // Exact match
    const match = [
      ...destinationValues,
      ...destinationSameAs,
      ...destinationLocatedInTimeZone,
    ]?.includes(value);

    // Fuzzy match aka Europe/Amsterdam === UTC +1
    if (!match && !!destinationValues.length) {
      const valueObject = await getTimeZoneByWikiId(value);
      const valueOffset = getOffset(valueObject)?.[0];
      const sameAs = valueObject
        .map((object) => object.claims[Property.SaidToBeTheSameAs])
        .flat()
        .map((obj) => obj?.value)
        .filter((item): item is string => !!item);
      const locatedInTimeZone = valueObject
        .map((object) => object.claims[Property.LocatedInTimeZone])
        .flat()
        .map((obj) => obj?.value)
        .filter((item): item is string => !!item);

      if (
        [...sameAs, ...locatedInTimeZone].some((s) =>
          [...destinationValues, ...destinationSameAs]?.includes(s)
        ) ||
        destinationOffsets.includes(valueOffset)
      ) {
        return {
          match: true,
          value,
          missing,
        };
      }
    }

    return {
      match,
      value,
      missing,
    };
  });

  return Promise.all(result).then((result) => {
    db.close();
    return result;
  });
};
