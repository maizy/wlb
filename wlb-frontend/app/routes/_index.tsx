import type {MetaFunction} from "@remix-run/node";
import {consts} from "~/consts";

export const meta: MetaFunction = () => {
  return [
    consts.title(),
    consts.description,
  ];
};

export default function Index() {
  const examples = `
9-15 14-45
15:00 - 15:30
16 - 17
18`;

  return (
  <>
    <h1>WLB <span className="app-version">{consts.version}</span></h1>

    <div id="grid">
      <div id="input" className="grid-cell">
        <h3 className="first-header">Worktime</h3>
        <textarea className="input-area" id="time-input"></textarea>
        <div className="description">
          <p>One work period per line. Only the 24-hour clock format is supported for now.</p>
          <p>If an end time is omitted current time is assumed.</p>
          <p>Try to use any time format you like.</p>
          <p>Example:<br/>
          <pre className="input-example">{examples}</pre>
          </p>
          <p>All entered data are saved locally in your browser only.</p>
        </div>
      </div>
      <div id="days" className="grid-cell">
        <div id="current-day">
          <h3 className="first-header">Today</h3>
          <div id="today-periods"></div>
        </div>
        <div id="configs">
          <h3>Work schedule</h3>
          I work <input className="inline" id="work-time" value="8h"/> per day
          with an approximate <input className="inline" id="lunch-break" value="1h"/> break for lunch.
        </div>
        {/*<div id="previous-days">*/}
        {/*  <h3>Previous days</h3>*/}
        {/*</div>*/}
      </div>
    </div>
  </>
  );
}
