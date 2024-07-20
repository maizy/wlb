import {Duration} from "./duration";

export class Time {
  hour: number;
  minute: number;

  constructor(hour: number, minute: number) {
    this.hour = Math.min(23, Math.max(0, hour || 0));
    this.minute = Math.min(59, Math.max(0, minute || 0));
  }

  get formatted(): string {
    const minuteStr = (this.minute + "").padStart(2, "0");
    return `${this.hour}:${minuteStr}`;
  }

  get minutesOfDay(): number {
    return this.hour * 60 + this.minute;
  }

  compare(other: Time): 1 | -1 | 0 {
    if (other.minutesOfDay < this.minutesOfDay) {
      return 1;
    } else if (other.minutesOfDay > this.minutesOfDay) {
      return -1;
    }
    return 0;
  }

  ge(other: Time): boolean {
    return this.compare(other) >= 0;
  }

  gt(other: Time): boolean {
    return this.compare(other) === 1;
  }

  le(other: Time): boolean {
    return this.compare(other) <= 0;
  }

  lt(other: Time): boolean {
    return this.compare(other) === -1;
  }

  durationUntil(other: Time): Duration {
    const cmp = this.compare(other);
    if (cmp < 0) {
      return new Duration(other.minutesOfDay - this.minutesOfDay);
    } else if (cmp > 0) { // day wrap
      return new Duration(60 * 24 - this.minutesOfDay + other.minutesOfDay);
    }
    return new Duration(0);
  }

  plus(duration: Duration): Time {
    let minutesOfDay = this.minutesOfDay + duration.minutes;
    minutesOfDay = minutesOfDay % (60 * 24);
    return fromMinutesOfDay(minutesOfDay);
  }

  minus(duration: Duration): Time {
    let minutesOfDay = this.minutesOfDay - duration.minutes;
    minutesOfDay = minutesOfDay % (60 * 24);
    if (minutesOfDay < 0) {
      minutesOfDay = 24 * 60 + minutesOfDay;
    }
    return fromMinutesOfDay(minutesOfDay);
  }
}

export function fromMinutesOfDay(minutes: number): Time {
  minutes = Math.min(60 * 24, Math.max(0, minutes || 0));
  return new Time(Math.floor(minutes / 60), minutes % 60);
}

export function makeTime(): Time {
  const now = new Date();
  return new Time(now.getHours(), now.getMinutes());
}
