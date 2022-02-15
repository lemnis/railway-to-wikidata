import test from "ava";
import fs from "fs";
import { Feature } from "geojson";
import loki from "@lokidb/loki";

const path = __dirname + "/../../../geojson/stations/";
const dir = fs.readdirSync(path);

const data: Feature[] = dir
  .filter((file) => file.endsWith(".geojson") && file.match(/^[A-Z]/))
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
  CARGO: "cargo",
  ABANDONED: "abandoned",
  DISUSED: "disused",
  MINIATURE: "miniature",
  CONSTRUCTION: "construction", // untested
  RAILWAY: "railway", // untested
  RAIL: "rail", // untested
  HIGHSPEED: "highspeed", // untested
  YARD: "yard", // untested
  SIDING: "siding", // untested
  LIGHT_RAIL_AND_SUBWAY: "light_rail;subway", // untested
  RACK: "rack", // untested
};

const USAGE_VALUES = {
  HISTORIC: "historic",
  TOURISM: "tourism",
  LEISURE: "leisure",
  PRESERVED_RAILWAY: "preserved_railway",
  INDUSTRIAL: "industrial",
  FREIGHT: "freight",
  MAIN: "main", // untested
  BRANCH: "branch", // untested
};

const TOURISM_VALUES = {
  YES: "yes",
  ATTRACTION: "attraction",
  MOTEL: "motel",
  INFORMATION: "information",
  VIEWPOINT: "viewpoint",
};

const TRAIN_VALUES = {
  YES: "yes",
  DISUSED: "disused",
  HALT: "halt",
  PRIVATE: "private",
  RAILWAY: "railway", // untested

};

const ABANDONED_AND_DISUSED_VALUES = {
  YES: "yes",
  STATION: "station",
};

const HISTORIC_VALUES = {
  YES: "yes",
  BUILDING: "building",
  RUINS: "ruins",
  ARCHAEOLOGICAL_SITE: "archaeological_site",
  MEMORIAL: "memorial",
  MONUMENT: "monument",
};

const BOOLEAN_VALUES = {
  LEISURE: "leisure",
  TRAM: "tram",
  SUBWAY: "subway",
  MONORAIL: "monorail",
  LIGHT_RAIL: "light_rail",
  BUS: "bus",
  FERRY: "ferry",
  PASSENGER: "passenger",
  ONLY: "only",
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
  "properties.passenger" as "properties.passenger", // not tested
  "properties.only" as "properties.only", // not tested
  "properties.amenity" as "properties.amenity", // not tested
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
      { "properties.station": STATION_VALUES.CARGO },
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
      { "properties.disused": ABANDONED_AND_DISUSED_VALUES.YES },
      { "properties.disused": ABANDONED_AND_DISUSED_VALUES.STATION },
      { "properties.abandoned": ABANDONED_AND_DISUSED_VALUES.YES },
      { "properties.abandoned": ABANDONED_AND_DISUSED_VALUES.STATION },
      { "properties.station": STATION_VALUES.ABANDONED },
      { "properties.station": STATION_VALUES.DISUSED },
      { "properties.train": TRAIN_VALUES.DISUSED },
    ],
  });

  t.is(found.length, 0, message(found));
});

test("Should not contain tourism locations", (t) => {
  const found = collection.find({
    $or: [
      { "properties.historic": "yes" },
      { "properties.historic": HISTORIC_VALUES.BUILDING },
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
      { "properties.train": { $ne: "yes" } },
      {
        $or: [
          { "properties.tram": { $type: "string" } },
          { "properties.tram": { $type: "string" } },
          { "properties.subway": { $type: "string" } },
          { "properties.monorail": { $type: "string" } },
          { "properties.light_rail": { $type: "string" } },
          { "properties.bus": { $type: "string" } },
          { "properties.ferry": { $type: "string" } },
          { "properties.aerialway": { $type: "string" } },
          { "properties.amenity": "bus_station" },
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
      {
        "properties.station": {
          $and: [{ $nin: Object.values(STATION_VALUES) }, { $type: "string" }],
        },
      },
      {
        "properties.usage": {
          $and: [{ $nin: Object.values(USAGE_VALUES) }, { $type: "string" }],
        },
      },
      {
        "properties.tourism": {
          $and: [{ $nin: Object.values(TOURISM_VALUES) }, { $type: "string" }],
        },
      },
      {
        "properties.train": {
          $and: [{ $nin: Object.values(TRAIN_VALUES) }, { $type: "string" }],
        },
      },
      {
        "properties.abandoned": {
          $and: [
            { $nin: Object.values(ABANDONED_AND_DISUSED_VALUES) },
            { $type: "string" },
          ],
        },
      },
      {
        "properties.disused": {
          $and: [
            { $nin: Object.values(ABANDONED_AND_DISUSED_VALUES) },
            { $type: "string" },
          ],
        },
      },
      {
        "properties.historic": {
          $and: [{ $nin: Object.values(HISTORIC_VALUES) }, { $type: "string" }],
        },
      },
      ...Object.values(BOOLEAN_VALUES).map((key) => ({
        [`properties.${key}`]: {
          $and: [{ $type: "string" }, { $nin: ["yes", "no", "station"] }],
        },
      })),
    ],
  });
  t.is(found.length, 0, message(found));
});
