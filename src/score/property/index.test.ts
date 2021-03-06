import test from "ava";
import { score } from ".";
import { Property } from "../../types/wikidata";

test("Should fully match to empty object", async ({ deepEqual }) => {
  deepEqual(await score({}, {}), {
    matches: {},
    amountMissing: 0,
    percentage: 0,
  });
});

test("Should fully match to equal objects", async ({ deepEqual }) => {
  deepEqual(
    await score(
      { [Property.Country]: [{ value: "h" }] },
      { [Property.Country]: [{ value: "h" }] }
    ),
    {
      matches: {
        [Property.Country]: {
          matches: [
            {
              match: true,
              value: "h",
            },
          ],
          missing: false,
        },
      },
      amountMissing: 0,
      percentage: 1,
    }
  );
});

test("Should mark missing with missing counter claims", async ({ deepEqual }) => {
  deepEqual(
    await score({ [Property.Country]: [{ value: "h" }] }, { [Property.Country]: [] }),
    {
      matches: {
        [Property.Country]: {
          matches: [
            {
              match: false,
              value: "h",
            },
          ],
          missing: true,
        },
      },
      amountMissing: 1,
      percentage: 0,
    }
  );
});

test("Should match to one of destination objects", async ({ deepEqual }) => {
  deepEqual(
    await score(
      { [Property.Country]: [{ value: "two" }] },
      {
        [Property.Country]: [
          { value: "one" },
          { value: "two" },
          { value: "third" },
        ],
      }
    ),
    {
      matches: {
        [Property.Country]: {
          matches: [
            {
              match: true,
              value: "two",
            },
          ],
          missing: false,
        },
      },
      amountMissing: 0,
      percentage: 1,
    }
  );
});

test("Should only match second object", async ({ deepEqual }) => {
  deepEqual(
    await score(
      {
        [Property.Country]: [
          { value: "one" },
          { value: "two" },
          { value: "third" },
        ],
      },
      { [Property.Country]: [{ value: "two" }] }
    ),
    {
      matches: {
        [Property.Country]: {
          matches: [
            {
              match: false,
              value: "one",
            },
            {
              match: true,
              value: "two",
            },
            {
              match: false,
              value: "third",
            },
          ],
          missing: false,
        },
      },
      amountMissing: 0,
      percentage: 1 / 3,
    }
  );
});

test("Percentage should match percentage of single existing property", async ({
  deepEqual,
}) => {
  deepEqual(
    await score(
      {
        [Property.Country]: [{ value: "two" }],
        [Property.Location]: [{ value: "location" }],
      },
      { [Property.Country]: [{ value: "two" }] }
    ),
    {
      matches: {
        [Property.Country]: {
          matches: [
            {
              match: true,
              value: "two",
            },
          ],
          missing: false,
        },
        [Property.Location]: {
          matches: [
            {
              match: false,
              value: "location",
            },
          ],
          missing: true,
        },
      },
      amountMissing: 1,
      percentage: 1,
    }
  );
});

test("Percentage should be calculated against all existing properties", async ({
  deepEqual,
}) => {
  deepEqual(
    await score(
      {
        [Property.Country]: [{ value: "one" }, { value: "two" }],
        [Property.Location]: [
          { value: "location" },
          { value: "location1" },
          { value: "location2" },
        ],
      },
      {
        [Property.Country]: [{ value: "two" }],
        [Property.Location]: [{ value: "location" }],
      }
    ),
    {
      matches: {
        [Property.Country]: {
          matches: [
            {
              match: false,
              value: "one",
            },
            {
              match: true,
              value: "two",
            },
          ],
          missing: false,
        },
        [Property.Location]: {
          matches: [
            {
              match: true,
              value: "location",
            },
            {
              match: false,
              value: "location1",
            },
            {
              match: false,
              value: "location2",
            },
          ],
          missing: false,
        },
      },
      amountMissing: 0,
      percentage: 2 / 5,
    }
  );
});
