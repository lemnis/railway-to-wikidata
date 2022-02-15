import test from "ava";
import { stub } from "sinon";
import { getDBStationCategory } from ".";
import { logger } from "../../utils/logger";

test("Should return category 1 station ID", ({ is }) => {
  is(getDBStationCategory(1), "Q18681579");
});

test("Should return category 7 station ID", ({ is }) => {
  is(getDBStationCategory("7"), "Q18681693");
});

test("Should throw warning when incorrect value is given", ({ is, truthy }) => {
  const warn = stub(logger, 'warn');
  is(getDBStationCategory(9), undefined);
  truthy(warn.calledOnce);
});
