import { logger } from "../../utils/logger";

const StationCategory = {
  1: "Q18681579",
  2: "Q18681660",
  3: "Q18681688",
  4: "Q18681690",
  5: "Q18681691",
  6: "Q18681692",
  7: "Q18681693",
};

export const getDBStationCategory = (category: string | number) => {
  if (category in StationCategory) {
    return StationCategory[category as keyof typeof StationCategory];
  }

  logger.error({ category }, "Unknown station category value was given");
  return;
};
