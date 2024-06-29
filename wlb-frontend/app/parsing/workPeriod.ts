import {Line} from "~/data/line";
import {Time, now} from "~/data/time";

const timeRegExp = new RegExp(/^\s*(?<hour>[0-9]+)[^0-9]*(?<minute>[0-9]*)\s*$/);
const beginEndRegExp = new RegExp(/\s+[a-z\-–\t]*\s*/, "i");
const newLineRegExp = new RegExp(/\r?\n/);

function parseTime(time: string): Time | undefined {
  const timeMatch = time.match(timeRegExp);
  if (timeMatch && timeMatch.groups?.hour) {
    let minute = 0;
    if (timeMatch.groups.minute) {
      minute = parseInt(timeMatch.groups.minute) || 0;
    }
    return new Time(parseInt(timeMatch.groups.hour), minute);
  }
  return undefined;
}

function parseLine(line: string): Line {
  const parts = line.trim().split(beginEndRegExp).filter(x => x.length > 0);
  let begin: Time | undefined = undefined;
  let end: Time | undefined = undefined;
  let success = false;
  let assumedEnd = false;
  if (parts.length === 1) {
    begin = parseTime(parts[0]);
    if (begin !== null) {
      end = now();
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

export function parseWorkPeriodsSpec(value: string): Line[] {
  return value.trim().split(newLineRegExp).map(parseLine);
}
