import {Duration} from "~/data/duration";

export class WorkdaySettings {
  readonly workTime: Duration;
  readonly userWorkTimeValue: string;
  readonly lunchBreak: Duration;
  readonly userLunchBreakValue: string;
  readonly minimumBreakRatio = 0.5;

  constructor(workTime: Duration, lunchBreak: Duration, userWorkTimeValue?: string, userLunchBreakValue?: string) {
    this.workTime = workTime;
    this.lunchBreak = lunchBreak;
    // empty string is a valid user*Value
    this.userWorkTimeValue = userWorkTimeValue !== undefined ? userWorkTimeValue : workTime.formatted;
    this.userLunchBreakValue = userLunchBreakValue !== undefined ? userLunchBreakValue : lunchBreak.formatted;
  }

  clone(props: {
    workTime?: Duration, lunchBreak?: Duration, userWorkTimeValue?: string, userLunchBreakValue?: string
  }): WorkdaySettings {
    return new WorkdaySettings(
      props.workTime || this.workTime,
      props.lunchBreak || this.lunchBreak,
      props.userWorkTimeValue !== undefined ? props.userWorkTimeValue : this.userWorkTimeValue,
      props.userLunchBreakValue !== undefined ? props.userLunchBreakValue : this.userLunchBreakValue
    );
  }
}

export const defaultSettings = new WorkdaySettings(new Duration(8 * 60), new Duration(60));
