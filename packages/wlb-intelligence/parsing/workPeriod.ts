import {Line} from "../data/line";
import {Time} from "../data/time";

const timeRegExp = new RegExp(/^\s*([0-9]+)[^0-9]*([0-9]*)\s*$/);
const beginEndRegExp = new RegExp(/\s+[a-z\-–\t]*\s*/, "i");
const newLineRegExp = new RegExp(/\r?\n/);

/** @private */
export function parseTime(time: string): Time | undefined {
  const timeMatch = time.match(timeRegExp);
  if (timeMatch && timeMatch[1]) {
    let minute = 0;
    if (timeMatch[2]) {
      minute = parseInt(timeMatch[2]) || 0;
    }
    return new Time(parseInt(timeMatch[1]), minute);
  }
  return undefined;
}

/** @private */
export function parseLine(line: string, now: Time): Line {
  const parts = line.trim().split(beginEndRegExp).filter(x => x.length > 0);
  let begin: Time | undefined = undefined;
  let end: Time | undefined = undefined;
  let success = false;
  let assumedEnd = false;
  if (parts.length === 1) {
    begin = parseTime(parts[0]);
    if (begin !== null) {
      end = now;
      assumedEnd = true;
      success = true;
    }
  } else if (parts.length === 2) {
    begin = parseTime(parts[0]);
    if (begin !== null) {
      end = parseTime(parts[1]);
    }
    success = !!begin && !!end;
  }
  return new Line(
    line,
    success,
    assumedEnd,
    begin,
    end
  )
}

export function parseWorkPeriodsSpec(value: string, now: Time): Line[] {
  return value.trim().split(newLineRegExp).map(line => parseLine(line, now));
}
