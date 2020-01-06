const msInSec = 1000;
const msInMin = msInSec * 60;
const msInHour = msInMin * 60;
const msInDay = msInHour * 24;

// A human readable representation of the elapsed time.
// start must be before end.
export function timeElapsed(
  start: Date,
  end: Date,
  separator: string = " "
): string {
  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) {
    throw new Error("`start` must be before `end`");
  }
  const ms = diffMs % 1000;

  const diffSecs = diffMs - ms;
  // The modulo of the minutes (one unit of measurement above), to get the the
  // actual seconds, as they won't be part of a full minute.
  const secsAsMs = diffSecs % msInMin;
  // Convert from milliseconds.
  const secs = secsAsMs / 1000;

  const diffMins = diffSecs - secsAsMs;
  const minsAsMs = diffMins % msInHour;
  const mins = minsAsMs / msInMin;

  const diffHours = diffMins - minsAsMs;
  const hoursAsMs = diffHours % msInDay;
  const hours = hoursAsMs / msInHour;

  const diffDays = diffHours - hoursAsMs;
  const days = diffDays / (1000 * 60 * 60 * 24);

  const parts = [];
  // All parts except the very first one are ensured to always have the maximum
  // possible length.
  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0) {
    const hoursPad = parts.length === 0 ? 0 : 2;
    parts.push(`${hours.toString().padStart(hoursPad, "0")}h`);
  }
  if (mins > 0) {
    const minsPad = parts.length === 0 ? 0 : 2;
    parts.push(`${mins.toString().padStart(minsPad, "0")}m`);
  }
  if (secs > 0) {
    const secsPad = parts.length === 0 ? 0 : 2;
    parts.push(`${secs.toString().padStart(secsPad, "0")}s`);
  }
  const msPad = parts.length === 0 ? 0 : 3;
  parts.push(`${ms.toString().padStart(msPad, "0")}ms`);
  return parts.join(separator);
}

export function formatDate(
  date: Date,
  dateSeparator: string = "-",
  timeSeparator: string = ":",
  showMs: boolean = true
): string {
  const dateStr = [
    date.getFullYear(),
    // + 1 since it's zero based to index month names.
    (date.getMonth() + 1).toString().padStart(2, "0"),
    // This is the day number, because .getDay() returns the day of the week.
    date
      .getDate()
      .toString()
      .padStart(2, "0")
  ].join(dateSeparator);
  let timeStr = [
    date
      .getHours()
      .toString()
      .padStart(2, "0"),
    date
      .getMinutes()
      .toString()
      .padStart(2, "0"),
    date
      .getSeconds()
      .toString()
      .padStart(2, "0")
  ].join(timeSeparator);
  if (showMs) {
    timeStr += `.${date
      .getMilliseconds()
      .toString()
      .padStart(3, "0")}`;
  }
  return `${dateStr} ${timeStr}`;
}

export function parseDate(str: string): Date | undefined {
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) {
    const parts = str.split(" ");
    // This is a special case for Safari.
    // 2019-11-15 13:35:52.809545 is not considered valid and must be
    // 2019-11-15T13:35:52.809545 (the space needs to be replaced by a T for it
    // to be valid.
    // Chrome and Firefox both happily accept that format.
    if (parts.length === 2) {
      const joinedDate = new Date(parts.join("T"));
      if (!Number.isNaN(joinedDate.getTime())) {
        return joinedDate;
      }
    }
    return undefined;
  }
  return date;
}
