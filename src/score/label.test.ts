import test from "ava";
import { score } from "./label";

test("Should fully match to duplicate object", ({ like }) => {
  like(
    score([{ value: "Foo", lang: "en" }], [{ value: "Foo", lang: "en" }]),
    {
      matches: [{ match: true, missing: false, value: "Foo", lang: "en", similarity: 1 }],
      percentage: 1,
    }
  );
});

test("Should have 0 percentage when no matches can be made", ({
  like,
}) => {
  like(score([], []), { matches: [], percentage: 0 });
});

test("Should match without source language", ({ like }) => {
  like(score([{ value: "Foo" }], [{ value: "Foo", lang: "en" }]), {
    matches: [{ match: true, missing: false, value: "Foo", lang: undefined, similarity: 1 }],
    percentage: 1,
  });
});

test("Should match without destination language", ({ like }) => {
  like(score([{ value: "Foo", lang: "en" }], [{ value: "Foo" }]), {
    matches: [{ match: true, missing: false, value: "Foo", lang: "en", similarity: 1 }],
    percentage: 1,
  });
});

test("Multiple spaces should be ignored", ({ like }) => {
  like(
    score(
      [{ value: "fo   bar", lang: "en" }],
      [{ value: "fo bar", lang: "en" }]
    ),
    {
      matches: [{ match: true, missing: false, value: "fo   bar", lang: "en", similarity: 1 }],
      percentage: 1,
    }
  );
});

test("Dashes should be ignored", ({ like }) => {
  like(
    score([{ value: "fo-bar", lang: "en" }], [{ value: "fo bar", lang: "en" }]),
    {
      matches: [{ match: true, missing: false, value: "fo-bar", lang: "en", similarity: 1 }],
      percentage: 1,
    }
  );
});

test("Dash prepended by a space should be combined into a single space", ({
  like,
}) => {
  like(
    score(
      [{ value: "fo -bar", lang: "en" }],
      [{ value: "fo bar", lang: "en" }]
    ),
    {
      matches: [{ match: true, missing: false, value: "fo -bar", lang: "en", similarity: 1 }],
      percentage: 1,
    }
  );
});

test("Straße should match with strasse", ({ like }) => {
  like(
    score(
      [{ value: "strasse", lang: "en" }],
      [{ value: "Straße", lang: "en" }]
    ),
    {
      matches: [{ match: true, missing: false, value: "strasse", lang: "en", similarity: 1 }],
      percentage: 1,
    }
  );
});

test("ÖBB should match with oebb", ({ like }) => {
  like(
    score([{ value: "ÖBB", lang: "en" }], [{ value: "oebb", lang: "en" }]),
    {
      matches: [{ match: true, missing: false, value: "ÖBB", lang: "en", similarity: 1 }],
      percentage: 1,
    }
  );
});

test("Different values with unknown language should not match", ({ like }) => {
  like(
    score(
      [
        {
          value: "RP BIRIMIRCI",
        },
      ],
      [
        {
          value: "Sofia",
        },
      ]
    ),
    {
      matches: [{ match: false, missing: false, value: "RP BIRIMIRCI", lang: undefined, similarity: 0, }],
      percentage: 0,
    }
  );
});
