import test from "ava";
import { scoreLocatedInTimeZone } from ".";

test("Should match same ID", async (t) => {
  t.deepEqual(
    await scoreLocatedInTimeZone([{ value: "Q6655" }], [{ value: "Q6655" }]),
    [{ match: true, missing: false, value: 'Q6655' }]
  );
});

test("Should match Europe/Amsterdam with +1:00", async (t) => {
  t.deepEqual(
    await scoreLocatedInTimeZone([{ value: "Q5412088" }], [{ value: "Q6655" }]),
    [{ match: true, missing: false, value: 'Q5412088' }]
  );
});

test("Should match +1:00 with Europe/Amsterdam", async (t) => {
  t.deepEqual(
    await scoreLocatedInTimeZone([{ value: "Q6655" }], [{ value: "Q5412088" }]),
    [{ match: true, missing: false, value: 'Q6655' }]
  );
});

test("Should match +0:00 with Western European Time", async (t) => {
  t.deepEqual(
    await scoreLocatedInTimeZone([{ value: "Q6574" }], [{ value: "Q843589" }]),
    [{ match: true, missing: false, value: 'Q6574' }]
  );
});

test("Should match +0:00 with Atlantic/Faroe", async (t) => {
  t.deepEqual(
    await scoreLocatedInTimeZone([{ value: "Q6574" }], [{ value: "Q63285994" }]),
    [{ match: true, missing: false, value: 'Q6574' }]
  );
});

test("Should not match UTC+4:00 with Moscow Time", async (t) => {
  t.deepEqual(
    await scoreLocatedInTimeZone([{ value: "Q6779" }], [{ value: "Q842320" }]),
    [{ match: false, missing: false, value: 'Q6779' }]
  );
});

test("Should match Further-eastern European Time with Moscow Time", async (t) => {
  t.deepEqual(
    await scoreLocatedInTimeZone([{ value: "Q2166209" }], [{ value: "Q842320" }]),
    [{ match: true, missing: false, value: 'Q2166209' }]
  );
});

test("Should match Moscow Time with Further-eastern European Time", async (t) => {
  t.deepEqual(
    await scoreLocatedInTimeZone([{ value: "Q842320" }], [{ value: "Q2166209" }]),
    [{ match: true, missing: false, value: 'Q842320' }]
  );
});

test("Should match UTC+03:00 with Bagdad Time zone", async (t) => {
  t.deepEqual(
    await scoreLocatedInTimeZone([{ value: "Q6760" }], [{ value: "Q6913416" }]),
    [{ match: true, missing: false, value: 'Q6760' }]
  );
});

test("Should match Bagdad Time zone with UTC+03:00", async (t) => {
  t.deepEqual(
    await scoreLocatedInTimeZone([{ value: "Q6913416" }], [{ value: "Q6760" }]),
    [{ match: true, missing: false, value: 'Q6913416' }]
  );
});

test.todo('Should check against summer time');
test.todo('Should check against winter time');  
test.todo("Should match time in Turkey with Moscow Time");