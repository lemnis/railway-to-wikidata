import { differenceInHours } from "date-fns";

const dateTimeFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};
const winterTime = new Date("1/1/2021").valueOf();
const summerTime = new Date("6/1/2021").valueOf();

export const getTimeZoneOffset = (timeZone: string, isWinterTime = true) => {
  const date = isWinterTime ? winterTime : summerTime;

  return differenceInHours(
    new Date(
      Intl.DateTimeFormat(undefined, {
        ...dateTimeFormat,
        timeZone,
      }).format(date)
    ),
    new Date(
      Intl.DateTimeFormat(undefined, {
        ...dateTimeFormat,
        timeZone: "UTC",
      }).format(date)
    )
  );
};
