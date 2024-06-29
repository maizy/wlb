import {Duration} from "~/data/duration";

export class WorkdaySettings {
  readonly workTime: Duration;
  readonly lunchBreak: Duration;
  readonly minimumBreakRatio = 0.5;

  constructor(workTime: Duration, lunchBreak: Duration) {
    this.workTime = workTime;
    this.lunchBreak = lunchBreak;
  }
}
