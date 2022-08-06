import { DateTime, Interval } from 'luxon';

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

const durationHoursAndMinutes = (startISO: string, endISO: string) => {
  const startObj = DateTime.fromISO(startISO);
  const endObj = DateTime.fromISO(endISO);
  const lengthOfTime = Interval.fromDateTimes(startObj, endObj)
    .toDuration(["hours", "minutes"])
    .toObject();

  if (lengthOfTime.hours !== undefined) {
    const { hours, minutes } = lengthOfTime;

    if (hours === 0) {
      return `for ${minutes} minutes`;
    }

    if (minutes === 0) {
      if (hours === 1) {
        return "for 1 hour";
      }
      return `for ${hours} hours`;
    }
    if (hours === 1) {
      return `for 1 hour and ${minutes} minutes`;
    }
    return `for ${hours} hours and ${minutes} minutes`;
  }
};

const formatDuration = (postDurationObj: typeof DateTime) => {
  const { hours, minutes } = postDurationObj;

  if (hours === 0) {
    return `${minutes} minutes`;
  }
  if (hours === 1) {
    if (minutes > 0) {
      return `1 hour and ${minutes} minutes`;
    }
    return "1 hour";
  }
  if (hours > 1) {
    if (minutes > 0) {
      return `${hours} hours and ${minutes} minutes`;
    }
    return `${hours} hours`;
  }
};

const formatAbbreviatedDuration = (postDurationObj: typeof DateTime) => {
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
const compareDate = (e1: any, e2: any) => {
  const start1 = DateTime.fromISO(e1);
  const start2 = DateTime.fromISO(e2);
  if (start1 < start2) {
    return -1;
  }
  if (start1 > start2) {
    return 1;
  }
  return 0;
};

const getReadableTimeFromISO = (timeISO: string)=>{
  const timeObject = DateTime.fromISO(timeISO)
  // TIME_SIMPLE yields the time in this format: 1:30 PM
  const humanReadableTime = timeObject.toLocaleString(DateTime.TIME_SIMPLE)
  return humanReadableTime
}
const convertTimeToReadableFormat = (time: string) => {
  const timeObject = DateTime.fromISO(time)
  const humanReadableTime = timeObject.toLocaleString(DateTime.TIME_SIMPLE)
  return humanReadableTime;
}


export {
  compareDate,
  convertTimeToReadableFormat,
  formatDuration,
  formatAbbreviatedDuration,
  relativeTime,
  relativeTimeHoursAndMinutes,
  durationHoursAndMinutes,
  getDurationObj,
  getReadableTimeFromISO,
};
