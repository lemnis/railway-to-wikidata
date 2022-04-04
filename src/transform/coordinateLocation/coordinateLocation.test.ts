import test from "ava";
import { scoreCoordinateLocation } from ".";

test("Should match when both locations are 1,1", ({ deepEqual }) => {
  deepEqual(scoreCoordinateLocation([{ value: [1, 1] }], [{ value: [1, 1] }]), [
    { match: true, missing: false, value: [1, 1], distance: 0 },
  ]);
});

test("Should match when both locations is 0,0", ({ deepEqual }) => {
  deepEqual(scoreCoordinateLocation([{ value: [0, 0] }], [{ value: [0, 0] }]), [
    { match: true, missing: false, value: [0, 0], distance: 0 },
  ]);
});

test("Should calculate distance within 1 km", ({ deepEqual }) => {
  deepEqual(scoreCoordinateLocation([{ value: [1, 1] }], [{ value: [1.001, 1] }]), [
    {
      match: true,
      missing: false,
      value: [1, 1],
      distance: 111.30253629562503,
    },
  ]);
});

test("Should return distance of closest point", ({ deepEqual }) => {
  deepEqual(
    scoreCoordinateLocation(
      [{ value: [1, 1] }],
      [{ value: [10, 1] }, { value: [1.001, 1] }, { value: [1, 3] }]
    ),
    [
      {
        match: true,
        missing: false,
        value: [1, 1],
        distance: 111.30253629562503,
      },
    ]
  );
});

test("Should calculate distance between latitude", ({ deepEqual }) => {
  deepEqual(scoreCoordinateLocation([{ value: [1, 1] }], [{ value: [1.1, 1] }]), [
    {
      match: false,
      missing: false,
      value: [1, 1],
      distance: 11130.253629133493,
    },
  ]);
});

test("Should calculate distance between longitude", ({ deepEqual }) => {
  deepEqual(scoreCoordinateLocation([{ value: [1, 1] }], [{ value: [1, 1.1] }]), [
    {
      match: false,
      missing: false,
      value: [1, 1],
      distance: 11131.949079327367,
    },
  ]);
});

test("Should return empty when no source was given", ({ deepEqual }) => {
  deepEqual(scoreCoordinateLocation([], [{ value: [1, 1.1] }]), []);
});

test("Should return missing if no destination object was given", ({
  deepEqual,
}) => {
  deepEqual(scoreCoordinateLocation([{ value: [1, 1] }], []), [
    {
      match: false,
      missing: true,
      value: [1, 1],
    },
  ]);
});
