import type {MetaFunction} from "@remix-run/node";
import {useState} from "react";
import {consts} from "~/consts";
import {parseWorkPeriodsSpec} from "~/parsing/workPeriod";
import {WorkPeriod} from "~/data/workPeriod";
import {defaultSettings, WorkdaySettings} from "~/data/workdaySettings";
import {enrichWorkPeriods} from "~/intelligence/workday";
import {TodayWorkPeriods} from "~/component/TodayWorkPeriods";
import {TodaySummary} from "~/component/TodaySummary";
import {PeriodsExample} from "~/component/PeriodsExample";
import {WorkdaySettingsComponent} from "~/component/WorkdaySettingsComponent";

export const meta: MetaFunction = () => {
  return [
    consts.title(),
    consts.description,
  ];
};

export default function Index() {

  const [workPeriodsSpec, setWorkPeriodsSpec] = useState<string>('');
  const [workdaySettings, setWorkdaySettings] = useState<WorkdaySettings>(defaultSettings);

  const onValueChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setWorkPeriodsSpec(e.currentTarget.value);
  };

  const lines = parseWorkPeriodsSpec(workPeriodsSpec);
  const periods = lines.flatMap(line => {
    return line.success && line.begin && line.end ?
      [new WorkPeriod(line.begin, line.end, false, line.assumedEnd)]
      : [];
  });
  const enriched = enrichWorkPeriods(periods, workdaySettings);

  return (
  <>
    <h1>WLB <span className="app-version">{consts.version}</span></h1>

    <div id="grid">
      <div id="input" className="grid-cell">
        <h3 className="first-header">Worktime</h3>
        <textarea className="input-area" id="time-input" value={workPeriodsSpec} onInput={onValueChange} />
        <div className="description">
          <p>One work period per line. Only the 24-hour clock format is supported for now.</p>
          <p>If an end time is omitted current time is assumed.</p>
          <p>Try to use any time format you like.</p>
          <PeriodsExample setWorkPeriodsSpec={setWorkPeriodsSpec}/>
          <p>All entered data are saved locally in your browser only.</p>
        </div>
      </div>
      <div id="days" className="grid-cell">
        <div id="current-day">
          <h3 className="first-header">Today</h3>
          <div id="today-periods">
            <TodayWorkPeriods periods={enriched.periods}/>
            <TodaySummary enriched={enriched}/>
          </div>
        </div>
        <div id="configs">
          <WorkdaySettingsComponent workdaySettings={workdaySettings} setWorkdaySettings={setWorkdaySettings}/>
        </div>
        {/*<div id="previous-days">*/}
        {/*  <h3>Previous days</h3>*/}
        {/*</div>*/}
      </div>
    </div>
  </>
  );
}
