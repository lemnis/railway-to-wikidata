import test from "ava";
import { matchIds } from ".";
import { CodeIssuer, Property } from "../types/wikidata";

test("Should math with duplicate code issue claims", ({ deepEqual }) => {
  deepEqual(
    matchIds(
      { labels: [], claims: { [CodeIssuer.UIC]: [{ value: "1" }] } },
      { labels: [], claims: { [CodeIssuer.UIC]: [{ value: "1" }] } }
    ),
    true
  );
});

test("Should not match with duplicate code issue claims", ({ deepEqual }) => {
  deepEqual(
    matchIds(
      { labels: [], claims: { [CodeIssuer.UIC]: [{ value: "1" }] } },
      { labels: [], claims: { [CodeIssuer.UIC]: [{ value: "2" }] } }
    ),
    false
  );
});

test("Should not match with missing id claims", ({ deepEqual }) => {
  deepEqual(
    matchIds(
      { labels: [], claims: { [Property.Country]: [{ value: "1" }] } },
      { labels: [], claims: { [Property.Country]: [{ value: "1" }] } }
    ),
    false
  );
});

test("Should not match station codes with country", ({ deepEqual }) => {
  deepEqual(
    matchIds(
      { labels: [], claims: { [Property.StationCode]: [{ value: "1" }] } },
      { labels: [], claims: { [Property.StationCode]: [{ value: "1" }] } }
    ),
    false
  );
});

test("Should not match station codes with non matching country", ({
  deepEqual,
}) => {
  deepEqual(
    matchIds(
      {
        labels: [],
        claims: {
          [Property.StationCode]: [{ value: "1" }],
          [Property.Country]: [{ value: "1" }],
        },
      },
      {
        labels: [],
        claims: {
          [Property.StationCode]: [{ value: "1" }],
          [Property.Country]: [{ value: "2" }],
        },
      }
    ),
    false
  );
});

test("Should match station codes with matching country", ({
  deepEqual,
}) => {
  deepEqual(
    matchIds(
      {
        labels: [],
        claims: {
          [Property.StationCode]: [{ value: "1" }],
          [Property.Country]: [{ value: "1" }],
        },
      },
      {
        labels: [],
        claims: {
          [Property.StationCode]: [{ value: "1" }],
          [Property.Country]: [{ value: "1" }],
        },
      }
    ),
    true
  );
});
