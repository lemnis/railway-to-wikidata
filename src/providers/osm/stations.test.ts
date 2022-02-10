import test from "ava";
import fs from "fs";
import { Feature, FeatureCollection } from "geojson";
import loki from "@lokidb/loki";

const path = __dirname + "/../../../geojson/stations/";

const dir = fs.readdirSync(path);

const data: Feature[] = dir
  .filter((file) => file.endsWith(".geojson"))
  .map((file) => JSON.parse(fs.readFileSync(path + file, "utf-8")).features)
  .flat();

const STATION_VALUES = {
  TRAIN: "train",
  SUBWAY: "subway",
  LIGHT_RAIL: "light_rail",
  MONORAIL: "monorail",
  FUNICULAR: "funicular",
  TRAM: "tram",
  BUS: "bus",
  FREIGHT: "freight",
  ABANDONED: "abandoned",
  DISUSED: "disused",
  MINIATURE: "miniature",
  CONSTRUCTION: "construction", // untested
  HIGHSPEED: "highspeed", // untested
  SIDING: "siding", // untested
};

const USAGE_VALUES = {
  HISTORIC: "historic",
  TOURISM: "tourism",
  LEISURE: "leisure",
  PRESERVED_RAILWAY: "preserved_railway",
  INDUSTRIAL: "industrial",
  FREIGHT: "freight",
  MAIN: "main", // untested
};

const TOURISM_VALUES = {
  YES: "yes",
  ATTRACTION: "attraction",
};

const BOOLEAN_VALUES = {
  ABANDONED: "abandoned",
  DISUSED: "disused",
  HISTORIC: "historic",
  TOURISM: "tourism",
  LEISURE: "leisure",
  // TRAIN: "train",
  // TRAM: "tram",
  // SUBWAY: "subway",
  // MONORAIL: "monorail",
  // LIGHT_RAIL: "light_rail",
  // BUS: "bus",
  // FERRY: "ferry",
  // PASSENGER: "passenger",
  // ONLY: "only",
};

const message = (found: Feature[], message = "Unexpected locatons found: ") =>
  `${message} ${found
    .slice(0, 10)
    .map(({ properties }) => properties?.id)
    .join(", ")}${found.length > 10 ? ",..." : ""}`;
const db = new loki("test.json", { env: "NODEJS" });
const nestedProperties = [
  "properties.station" as "properties.station",
  "properties.usage" as "properties.usage",
  "properties.tourism" as "properties.tourism",
  "properties.train" as "properties.train",
  "properties.tram" as "properties.tram",
  "properties.subway" as "properties.subway",
  "properties.monorail" as "properties.monorail",
  "properties.light_rail" as "properties.light_rail",
  "properties.bus" as "properties.bus",
  "properties.ferry" as "properties.ferry",
  "properties.disused" as "properties.disused",
  "properties.abandoned" as "properties.abandoned",
  "properties.historic" as "properties.historic",
  "properties.leisure" as "properties.leisure",
  "properties.passenger" as "properties.passenger",
  "properties.only" as "properties.only",
];
const collection = db.addCollection<
  Feature,
  Record<typeof nestedProperties[0], any>
>("osm", { nestedProperties });
collection.insert(data);

const trainStations = [
  { railway: "halt" },
  { station: "train" },
  { station: "yes" },
  { usage: "main" },
  { "railway:traffic_mode": "passenger" },
];
test("Should contain train stations", (t) => {
  const ids = ["node/5260996738", "node/4029077115"];
  const found = collection.find({ id: { $in: ids } });
  t.is(found.length, ids.length, message(found, "Not found locations:"));
});

test("Should not contain locations are used by freight", (t) => {
  const found = collection.find({
    $or: [
      { "properties.station": STATION_VALUES.FREIGHT },
      { "properties.usage": USAGE_VALUES.FREIGHT },
      { "properties.usage": USAGE_VALUES.INDUSTRIAL },
      { "properties.passenger": "no" },
      { "properties.only": "freight" },
    ],
  });

  t.is(found.length, 0, message(found));
});

test("Should not contain disused locations", (t) => {
  const found = collection.find({
    $or: [
      { "properties.disused": "yes" },
      { "properties.abandoned": "yes" },
      { "properties.station": STATION_VALUES.ABANDONED },
      { "properties.station": STATION_VALUES.DISUSED },
    ],
  });

  t.is(found.length, 0, message(found));
});

test("Should not contain tourism locations", (t) => {
  const found = collection.find({
    $or: [
      { "properties.historic": "yes" },
      { "properties.tourism": TOURISM_VALUES.YES },
      { "properties.tourism": TOURISM_VALUES.ATTRACTION },
      { "properties.leisure": "yes" },
      { "properties.station": STATION_VALUES.MINIATURE },
      { "properties.usage": USAGE_VALUES.TOURISM },
      { "properties.usage": USAGE_VALUES.LEISURE },
      { "properties.usage": USAGE_VALUES.PRESERVED_RAILWAY },
    ],
  });

  t.is(found.length, 0, message(found));
});

test("Should not locations that is only served by other means of public transport", (t) => {
  const found = collection.find({
    $and: [
      {
        "properties.train": {
          $ne: "yes",
        },
      },
      {
        $or: [
          { "properties.tram": "yes" },
          { "properties.tram": "yes" },
          { "properties.subway": "yes" },
          { "properties.monorail": "yes" },
          { "properties.light_rail": "yes" },
          { "properties.bus": "yes" },
          { "properties.ferry": "yes" },
          { "properties.station": STATION_VALUES.BUS },
          { "properties.station": STATION_VALUES.FUNICULAR },
          // { "properties.station": STATION_VALUES.LIGHT_RAIL },
          { "properties.station": STATION_VALUES.MONORAIL },
          { "properties.station": STATION_VALUES.TRAM },
          { "properties.station": STATION_VALUES.SUBWAY },
        ],
      },
    ],
  });

  t.is(found.length, 0, message(found));
});

test("should not contain unknown values", (t) => {
  const found = collection.find({
    $or: [
      // {
      //   $and: [
      //     { "properties.station": { $nin: Object.values(STATION_VALUES) } },
      //     { "properties.station": { $type: "string" } },
      //   ],
      // },
      {
        $and: [
          { "properties.usage": { $nin: Object.values(USAGE_VALUES) } },
          { "properties.usage": { $type: "string" } },
        ],
      },
      {
        $and: [
          { "properties.tourism": { $nin: Object.values(TOURISM_VALUES) } },
          { "properties.tourism": { $type: "string" } },
        ],
      },
      ...Object.values(BOOLEAN_VALUES).map((key) => ({
        [`properties.${key}`]: { $eq: "yes" },
      })),
    ],
  });

  t.is(found.length, 0, message(found));
});
