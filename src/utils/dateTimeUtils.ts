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

const formatAbbreviatedDuration = (postDurationObj: Duration) => {
  const { hours, minutes } = postDurationObj;

  if (hours === 0) {
    return `${minutes}m`;
  }
  if (hours === 1) {
    if (minutes > 0) {
      return `1h ${minutes}m`;
    }
    return "1h";
  }
  if (hours > 1) {
    if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${hours}h`;
  }
};


// This function allows posts to be
// sorted in chronological order.
const compareDate = (e1: PostData, e2: PostData) => {
  const start1 = DateTime.fromISO(e1.startTime);
  const start2 = DateTime.fromISO(e2.startTime);
  if (start1 < start2) {
    return -1;
  }
  if (start1 > start2) {
    return 1;
  }
  return 0;
};

export {
  formatDuration,
  formatAbbreviatedDuration,
  relativeTime,
  relativeTimeHoursAndMinutes,
  durationHoursAndMinutes,
  getDurationObj,
  compareDate,
  getDatePieces
};
