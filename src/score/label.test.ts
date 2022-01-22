import test from "ava";
import { match } from "./label";

test("Should fully match to duplicate object", ({ deepEqual }) => {
  deepEqual(
    match([{ value: "Foo", lang: "en" }], [{ value: "Foo", lang: "en" }]),
    {
      matches: [{ match: true, missing: false, value: "Foo", lang: "en" }],
      percentage: 1,
    }
  );
});

test("Should have 0 percentage when no matches can be made", ({
  deepEqual,
}) => {
  deepEqual(match([], []), { matches: [], percentage: 0 });
});

test("Should match without source language", ({ deepEqual }) => {
  deepEqual(match([{ value: "Foo" }], [{ value: "Foo", lang: "en" }]), {
    matches: [{ match: true, missing: false, value: "Foo", lang: "en" }],
    percentage: 1,
  });
});

test("Should match without destination language", ({ deepEqual }) => {
  deepEqual(match([{ value: "Foo", lang: "en" }], [{ value: "Foo" }]), {
    matches: [{ match: true, missing: false, value: "Foo", lang: "en" }],
    percentage: 1,
  });
});

test("Multiple spaces should be ignored", ({ deepEqual }) => {
  deepEqual(
    match(
      [{ value: "fo   bar", lang: "en" }],
      [{ value: "fo bar", lang: "en" }]
    ),
    {
      matches: [{ match: true, missing: false, value: "fo   bar", lang: "en" }],
      percentage: 1,
    }
  );
});

test("Dashes should be ignored", ({ deepEqual }) => {
  deepEqual(
    match([{ value: "fo-bar", lang: "en" }], [{ value: "fo bar", lang: "en" }]),
    {
      matches: [{ match: true, missing: false, value: "fo-bar", lang: "en" }],
      percentage: 1,
    }
  );
});

test("Dash prepended by a space should be combined into a single space", ({
  deepEqual,
}) => {
  deepEqual(
    match(
      [{ value: "fo -bar", lang: "en" }],
      [{ value: "fo bar", lang: "en" }]
    ),
    {
      matches: [{ match: true, missing: false, value: "fo -bar", lang: "en" }],
      percentage: 1,
    }
  );
});

test("Straße should match with strasse", ({ deepEqual }) => {
  deepEqual(
    match(
      [{ value: "strasse", lang: "en" }],
      [{ value: "Straße", lang: "en" }]
    ),
    {
      matches: [{ match: true, missing: false, value: "strasse", lang: "en" }],
      percentage: 1,
    }
  );
});

test.skip("ÖBB should match with oebb", ({ deepEqual }) => {
  deepEqual(
    match([{ value: "ÖBB", lang: "en" }], [{ value: "oebb", lang: "en" }]),
    {
      matches: [{ match: true, missing: false, value: "ÖBB", lang: "en" }],
      percentage: 1,
    }
  );
});

test("Should match against variants in source", ({ deepEqual }) => {
  deepEqual(
    match(
      [
        {
          value: "doesNotExists",
          variants: ["munchen hauftbahnhof", "anotherFake"],
          lang: "en",
        },
      ],
      [{ value: "Munchen hbf", lang: "en", variants: ["Munchen Hauftbahnhof"] }]
    ),
    {
      matches: [
        {
          match: true,
          missing: false,
          value: "doesNotExists",
          lang: "en",
        },
      ],
      percentage: 1,
    }
  );
});

test("Should match against variants in destination", ({ deepEqual }) => {
  deepEqual(
    match(
      [{ value: "munchen hauftbahnhof", lang: "en" }],
      [{ value: "Munchen hbf", lang: "en", variants: ["Munchen Hauftbahnhof"] }]
    ),
    {
      matches: [
        {
          match: true,
          missing: false,
          value: "munchen hauftbahnhof",
          lang: "en",
        },
      ],
      percentage: 1,
    }
  );
});
