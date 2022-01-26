import { removeUri, simplifyByDatatype } from "../../transform/simplify";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property, ClaimObject } from "../../types/wikidata";
import { coordinateLocation } from "./coordinateLocation";
import { locatedInTimeZone } from "./locatedInTimeZone";
import { stationCode } from "./stationCode";

const customMatchers: Partial<
  Record<
    Property,
    (
      source: ClaimObject<any>[],
      destination: ClaimObject<any>[],
      missing: boolean
    ) => any[]
  >
> = {
  [Property.LocatedInTimeZone]: locatedInTimeZone,
  [Property.CoordinateLocation]: coordinateLocation,
  [Property.StationCode]: stationCode,
};

export const querySingleProperty = (
  property: string,
  qualifiers?: string[]
) => `?item p:${property} ?${property}Id. ?${property}Id ps:${property} ?${property}
${
  qualifiers
    ? qualifiers.map((q) => `?${property}Id pq:${q} ${property}Qualifiers${q}`)
    : ""
}`;

export const query = (
  properties: { property: string; qualifiers?: string[] }[]
): [string[], string] => [
  properties.map(({ property }) => property).flat(),
  properties
    .map(
      ({ property, qualifiers }) =>
        `OPTIONAL { ${querySingleProperty(property, qualifiers)} }\r\n`
    )
    .join(" "),
];

export const simplify = (
  itemList: any[],
  properties: { property: string; qualifiers?: string[] }[],
  extra: string[] = []
) => {
  const result = itemList.reduce<Record<string, Map<string, ClaimObject>>>(
    (acc, item, i) => {
      properties.forEach(({ property, qualifiers }) => {
        if (Object.prototype.hasOwnProperty.call(item, property)) {
          acc[property] = acc[property] || new Map();

          const claim: ClaimObject = {
            value:
              item[property].type === "uri"
                ? removeUri(item[property].value)
                : item[property].datatype
                ? simplifyByDatatype(
                    item[property].datatype,
                    item[property].value
                  )
                : item[property].value,
            id: item[`${property}Id`].value,
            ...(item[`${property}Label`]
              ? { label: item[`${property}Label`]?.value }
              : {}),
          };

          if (qualifiers) {
            claim.qualifiers = qualifiers.reduce<
              Record<string, { value: any; id: string }[]>
            >((acc2, propKey) => {
              if (Object.prototype.hasOwnProperty.call(item, propKey)) {
                acc2[propKey] = acc2[propKey] || [];
                acc2[propKey].push({
                  value: item[`itemQualifier${propKey}`].value,
                  id: item[`itemQualifier${propKey}Id`].value,
                });
              }

              return acc2;
            }, {});
          }

          acc[property].set(item[`${property}Id`].value, claim);
        }
      });
      extra.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          acc[key] = acc[key] || new Set();
          (acc[key] as any).add(item[key].value);
        }
      });
      return acc;
    },
    {}
  );

  const r: Record<string, ClaimObject[]> = {};
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      r[key] = extra.includes(key)
        ? (Array.from(result[key].values()).map((value) => ({ value })) as any)
        : Array.from(result[key].values());
    }
  }

  return r;
};

export interface Match {
  match: boolean;
  value: any;
  [key: string]: any;
}

export const score = (
  proposed: LocationV4["claims"],
  current: LocationV4["claims"],
  proposedObject?: LocationV4,
  currentObject?: LocationV4
) => {
  const result: Record<string, { matches: Match[]; missing: boolean }> = {};

  (
    Object.entries(proposed) as any as [Property | CodeIssuer, ClaimObject[]][]
  ).forEach(([key, value]) => {
    const claim: ClaimObject<any>[] | undefined = current[key];
    const matches: Match[] = [];
    const missing = !claim || claim?.length === 0;

    const customMatcher =
      key in customMatchers &&
      customMatchers[key as keyof typeof customMatchers];
    if (customMatcher && claim && value) {
      customMatcher(value, claim, missing).forEach((i) => matches.push(i));
    } else {
      value.forEach(({ value }) => {
        const match =
          claim?.some(
            ({ value: claimValue }) => claimValue === value?.toString()
          ) || false;

        matches.push({ match, value });
      });
    }

    result[key] = { matches, missing };
  });

  const existing = Object.values(result)
    .filter(({ missing }) => !missing)
    .map(({ matches }) => matches)
    .flat();

  const percentage =
    existing.filter(({ match }) => match).length / existing.length;

  return {
    matches: result,
    percentage: existing.length ? percentage : 0,
    amountMissing: Object.values(result).filter((i) => i.missing).length,
  };
};
