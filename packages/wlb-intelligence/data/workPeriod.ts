import {Time} from "./time";
import {Duration} from "./duration";

export class WorkPeriod {
  begin: Time;
  end: Time;
  estimatedEnd: Time | undefined;
  assumedEnd: boolean;
  estimation: boolean;

  constructor(begin: Time, end: Time, estimation?: boolean, assumedEnd?: boolean) {
    this.begin = begin;
    this.end = end;
    this.estimation = estimation || false;
    this.assumedEnd = assumedEnd || false;
  }

  get duration(): Duration {
    return this.begin.durationUntil(this.end);
  }

  get formatted(): string {
    return `${this.begin.formatted} - ${this.end.formatted} ${this.estimation ? '(estimated)' :''}`;
  }
}
