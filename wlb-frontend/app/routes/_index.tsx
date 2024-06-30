import type {MetaFunction} from "@remix-run/node";
import {useState} from "react";
import {consts} from "~/consts";
import {parseWorkPeriodsSpec} from "~/parsing/workPeriod";
import {WorkPeriod} from "~/data/workPeriod";
import {WorkdaySettings} from "~/data/workdaySettings";
import {enrichWorkPeriods} from "~/intelligence/workday";
import {Duration} from "~/data/duration";
import {TodayWorkPeriods} from "~/component/TodayWorkPeriods";
import {TodaySummary} from "~/component/TodaySummary";

export const meta: MetaFunction = () => {
  return [
    consts.title(),
    consts.description,
  ];
};

// FIXME: extract settings to component
const settings = new WorkdaySettings(new Duration(8 * 60), new Duration(60));

const examples = `\
9-15 14-45
15:00 - 15:30
16 - 17
18`;

export default function Index() {

  const [workPeriodsSpec, setWorkPeriodsSpec] = useState<string>('');

  const onValueChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setWorkPeriodsSpec(e.currentTarget.value);
  };

  const lines = parseWorkPeriodsSpec(workPeriodsSpec);
  const periods = lines.flatMap(line => {
    return line.success && line.begin && line.end ?
      [new WorkPeriod(line.begin, line.end, false, line.assumedEnd)]
      : [];
  });
  const enriched = enrichWorkPeriods(periods, settings);

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
          <div>
            Example:<br/>
            <pre className="input-example">{examples}</pre>
          </div>
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
        {/*<div id="configs">*/}
        {/*  <h3>Work schedule</h3>*/}
        {/*  I work <input className="inline" id="work-time" value="8h"/> per day*/}
        {/*  with an approximate <input className="inline" id="lunch-break" value="1h"/> break for lunch.*/}
        {/*</div>*/}
        {/*<div id="previous-days">*/}
        {/*  <h3>Previous days</h3>*/}
        {/*</div>*/}
      </div>
    </div>
  </>
  );
}
