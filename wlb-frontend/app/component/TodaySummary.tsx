import {JSX} from "react";
import {EnrichedWorkPeriods} from "~/intelligence/workday";

export function TodaySummary(prop: {enriched: EnrichedWorkPeriods}): JSX.Element {
  return (
    <div className={'summary'}>
      <span className={'value-label'}>Total</span>{' '}{prop.enriched.elapsed.formatted}
    </div>
  );
}
