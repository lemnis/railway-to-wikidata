import test from "ava";
import { simplify } from "./property";

test("Should return empty array if no values where given", ({ deepEqual }) => {
  deepEqual(simplify([], []), {});
});

test("Should return simplified property with ID", ({ deepEqual }) => {
  deepEqual(
    simplify(
      [{ itemId: { value: "id" }, item: { value: "value" } }],
      [{ property: "item" }]
    ),
    { item: [{ id: "id", value: "value" }] }
  );
});

test("Should return simplified property without ID", ({ deepEqual }) => {
  deepEqual(simplify([{ item: { value: "value" } }], [{ property: "item" }]), {
    item: [{ value: "value" }],
  });
});

test("Should simplify qualifiers", ({ deepEqual }) => {
  deepEqual(
    simplify(
      [{ item: { value: "value" }, itemQualifierSub: { value: "sub value" } }],
      [{ property: "item", qualifiers: ["sub"] }]
    ),
    {
      item: [{ value: "value", qualifiers: { sub: [{ value: "sub value" }] } }],
    }
  );
});

test("Should simplify qualifiers with ID", ({ deepEqual }) => {
  deepEqual(
    simplify(
      [
        {
          item: { value: "value" },
          itemQualifierSub: { value: "sub value" },
          itemQualifierSubId: { value: "sub id" },
        },
      ],
      [{ property: "item", qualifiers: ["sub"] }]
    ),
    {
      item: [
        {
          value: "value",
          qualifiers: { sub: [{ value: "sub value", id: "sub id" }] },
        },
      ],
    }
  );
});
