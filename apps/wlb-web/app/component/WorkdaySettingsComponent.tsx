import React, {JSX} from "react";
import {WorkdaySettings} from "wlb-intelligence/data/workdaySettings";
import {parseDuration} from "wlb-intelligence/data/duration";

export function WorkdaySettingsComponent(
  prop: {workdaySettings: WorkdaySettings, setWorkdaySettings: (value: WorkdaySettings) => void}
): JSX.Element {

  const onWorkTimeChanged = ((e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const parsedDuration = parseDuration(value);
    const newSettings = prop.workdaySettings.clone({workTime: parsedDuration, userWorkTimeValue: value});
    prop.setWorkdaySettings(newSettings)
  });

  const onLunchBreakChanged = ((e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const parsedDuration = parseDuration(e.currentTarget.value);
    const newSettings = prop.workdaySettings.clone({lunchBreak: parsedDuration, userLunchBreakValue: value});
    prop.setWorkdaySettings(newSettings)
  });

  return (
    <div>
      <h3>Work schedule</h3>
      I work {' '}
      <input className="inline" id="work-time"
             value={prop.workdaySettings.userWorkTimeValue}
             onChange={onWorkTimeChanged}/>{' '}
      per day with an approximate{' '}
      <input className="inline" id="lunch-break"
             value={prop.workdaySettings.userLunchBreakValue}
             onChange={onLunchBreakChanged}/>{' '}
      break for lunch.
    </div>
  );
}
