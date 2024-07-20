import {JSX} from "react";
import {WorkPeriod} from "wlb-intelligence/data/workPeriod";

export function TodayWorkPeriods(prop: {periods: WorkPeriod[]}): JSX.Element {
  const periods = prop.periods.map((period, index) => {
    const assumedClassname = period.assumedEnd ? 'assumed': undefined;
    const badges: JSX.Element[] = [];
    if (period.estimatedEnd) {
      badges.push(
        <div key={`today-work-period-${index}-until-badge`}
             className="badge estimate-badge">
          until {period.estimatedEnd.formatted}
        </div>
      );
    }
    if (period.estimation) {
      badges.push(
        <div key={`today-work-period-${index}-estimate-badge`}
              className="badge estimate-badge">
          estimation
        </div>
      );
    }
    return <tr className={period.estimation ? 'estimation': undefined} key={`today-work-period-${index}`}>
      <td>{period.begin.formatted}</td>
      <td className={assumedClassname}>{period.end.formatted}</td>
      <td className={assumedClassname}>{period.duration.formatted}</td>
      <td className="badges">{badges}</td>
    </tr>;
  });
  return (
    <table id="today-data" className="periods-table">
      <thead>
        <tr>
          <th>Begin</th>
          <th>End</th>
          <th>Length</th>
          <th className="badges"/>
        </tr>
      </thead>
      <tbody>
        {periods}
      </tbody>
    </table>
  );
}
