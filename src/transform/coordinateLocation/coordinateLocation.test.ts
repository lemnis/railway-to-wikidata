import test from "ava";
import { scoreCoordinateLocation } from ".";
import { featureCollection, multiPoint, point } from "@turf/turf";

test("Should match when both locations are 1,1", ({ deepEqual }) => {
  deepEqual(
    scoreCoordinateLocation(point([1, 1]), featureCollection([point([1, 1])])),
    [{ match: true, missing: false, value: [1, 1], distance: 0 }]
  );
});

test("Should match when both locations is 0,0", ({ deepEqual }) => {
  deepEqual(
    scoreCoordinateLocation(point([0, 0]), featureCollection([point([0, 0])])),
    [{ match: true, missing: false, value: [0, 0], distance: 0 }]
  );
});

test("Should calculate distance within 1 km", ({ deepEqual }) => {
  deepEqual(
    scoreCoordinateLocation(
      point([1, 1]),
      featureCollection([point([1.001, 1])])
    ),
    [
      {
        match: true,
        missing: false,
        value: [1, 1],
        distance: 111.17814468421521,
      },
    ]
  );
});

test("Should return distance of closest point", ({ deepEqual }) => {
  deepEqual(
    scoreCoordinateLocation(
      point([1, 1]),
      featureCollection([point([10, 1]), point([1.001, 1]), point([1, 3])])
    ),
    [
      {
        match: true,
        missing: false,
        value: [1, 1],
        distance: 111.17814468421521,
      },
    ]
  );
});

test("Should calculate distance between latitude", ({ deepEqual }) => {
  deepEqual(
    scoreCoordinateLocation(
      point([1, 1]),
      featureCollection([point([1.1, 1])])
    ),
    [
      {
        match: false,
        missing: false,
        value: [1, 1],
        distance: 11117.814467992992,
      },
    ]
  );
});

test("Should calculate distance between longitude", ({ deepEqual }) => {
  deepEqual(
    scoreCoordinateLocation(
      point([1, 1]),
      featureCollection([point([1, 1.1])])
    ),
    [
      {
        match: false,
        missing: false,
        value: [1, 1],
        distance: 11119.5080233533,
      },
    ]
  );
});

test("Should return empty when no source was given", ({ deepEqual }) => {
  deepEqual(
    scoreCoordinateLocation(
      multiPoint([]),
      featureCollection([point([1, 1.1])])
    ),
    []
  );
});

test("Should return missing if no destination object was given", ({
  deepEqual,
}) => {
  deepEqual(scoreCoordinateLocation(point([1, 1]), featureCollection([])), [
    {
      match: false,
      missing: true,
      value: [1, 1],
    },
  ]);
});
