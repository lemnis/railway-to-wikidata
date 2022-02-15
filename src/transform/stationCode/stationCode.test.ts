import test from "ava";
import { scoreStationCode } from ".";

test("Should match stringified numbes", ({ deepEqual }) => {
  deepEqual(scoreStationCode([{ value: "2" }], [{ value: "2" }]), [
    { match: true, missing: false, value: "2" },
  ]);
});

test("Should match equal strings", ({ deepEqual }) => {
  deepEqual(scoreStationCode([{ value: "code" }], [{ value: "code" }]), [
    { match: true, missing: false, value: "code" },
  ]);
});

test("Should match lowercase and camelcased values", ({ deepEqual }) => {
  deepEqual(scoreStationCode([{ value: "Code" }], [{ value: "CODE" }]), [
    { match: true, missing: false, value: "Code" },
  ]);
});

test("Should return missing if no destination object was given", ({
  deepEqual,
}) => {
  deepEqual(scoreStationCode([{ value: "code" }], []), [
    {
      match: false,
      missing: true,
      value: "code",
    },
  ]);
});

test("Should return empty array if no values were given", ({
  deepEqual,
}) => {
  deepEqual(scoreStationCode([], [{ value: "code" }]), []);
});
