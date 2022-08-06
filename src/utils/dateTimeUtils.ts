import { PostData } from "@/types/postTypes";
import { Duration } from "luxon"
import { DateTime, Interval } from "luxon";;

const relativeTime = (dateISO: string) => {
  const dateObj = DateTime.fromISO(dateISO);
  const time = dateObj.toRelative();

  return time;
};

const relativeTimeHoursAndMinutes = (dateISO: string) => {
  const dateObj = DateTime.fromISO(dateISO);
  const time = dateObj.toRelative(["hours", "minutes"]);

  return time;
};

const getDatePieces = (startTimeObj: any) => {
  const timeOfDay = startTimeObj.toLocaleString(DateTime.TIME_SIMPLE);
  const zone = startTimeObj.zoneName;
  const weekday = startTimeObj.weekdayLong;
  const month = startTimeObj.monthLong;
  const day = startTimeObj.day;
  const year = startTimeObj.year;

  return {
    timeOfDay,
    zone,
    weekday,
    month,
    day,
    year,
  };
};


export {
  relativeTime,
  relativeTimeHoursAndMinutes,
  getDatePieces
};
