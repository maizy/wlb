const numberRegExp = new RegExp(/\d+/);
const onlyNumericRegExp = new RegExp(/^\d+$/);
const durationSpecRegExp = new RegExp(/\d+[ .:-]*[hmd]*/, "g");

export class Duration {
  readonly minutes: number;

  constructor(minutes: number) {
    this.minutes = Math.max(0, minutes || 0);
  }

  get formatted(): string {
    const hours = Math.floor(this.minutes / 60);
    if (hours > 0) {
      const hourMinutes = this.minutes % 60;
      if (hourMinutes !== 0) {
        return `${hours}h ${this.minutes % 60}m`;
      }
      return `${hours}h`;
    }
    return `${this.minutes}m`;
  }

  plus(other: Duration): Duration {
    return new Duration(this.minutes + other.minutes);
  }

  minus(other: Duration): Duration {
    return new Duration(this.minutes - other.minutes);
  }

  compare(other: Duration): 1 | -1 | 0 {
    if (other.minutes < this.minutes) {
      return 1;
    } else if (other.minutes > this.minutes) {
      return -1;
    }
    return 0;
  }

  ge(other: Duration): boolean {
    return this.compare(other) >= 0;
  }

  gt(other: Duration): boolean {
    return this.compare(other) === 1;
  }

  le(other: Duration): boolean {
    return this.compare(other) <= 0;
  }

  lt(other: Duration): boolean {
    return this.compare(other) === -1;
  }
}

export function parse(value: string): Duration {
  value = value.toLowerCase();
  if (value.match(onlyNumericRegExp)) {
    return new Duration(parseInt(value) * 60);
  } else {
    const matchedSpecs = value.matchAll(durationSpecRegExp);
    let minutes = 0;
    for (const spec of matchedSpecs) {
      const numberMatch = spec[0].match(numberRegExp);
      if (numberMatch !== null) {
        const number = parseInt(numberMatch[0]);
        if (spec[0].includes("m")) {
          minutes += number;
        } else if (spec[0].includes("d")) {
          minutes += 24 * 60 * number;
        } else {
          minutes += number * 60;
        }
      }
    }
    return new Duration(minutes);
  }
}
