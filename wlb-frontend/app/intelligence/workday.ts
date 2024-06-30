import {WorkPeriod} from "~/data/workPeriod";
import {Duration} from "~/data/duration";
import {WorkdaySettings} from "~/data/workdaySettings";
import {Time} from "~/data/time";

export interface EnrichedWorkPeriods {
  periods: WorkPeriod[];
  elapsed: Duration;
  breaks: Duration;
  remaining: Duration;
}

export function enrichWorkPeriods(periods: WorkPeriod[], settings: WorkdaySettings, now: Time): EnrichedWorkPeriods {
  const durations: Duration[] = [];
  const breaks: Duration[] = [];
  periods.sort((a, b) => {
    // day wrap
    if (a.begin.gt(a.end) && b.begin.lt(b.end)) {
      return -1;
    } else if (b.begin.gt(b.end) && a.begin.lt(a.end)) {
      return 1;
    }
    return a.begin.compare(b.begin) || a.end.compare(b.end);
  });
  let previousEnd = null;
  for (const period of periods) {
    const duration = period.duration;
    durations.push(duration);

    if (previousEnd !== null) {
      breaks.push(previousEnd.durationUntil(period.begin));
    }
    previousEnd = period.end;
  }
  const elapsed = durations.reduce((acc, x) => acc.plus(x), new Duration(0));
  const totalBreaks = breaks.reduce((acc, x) => acc.plus(x), new Duration(0));

  let remaining = new Duration(0);
  if (settings.workTime.gt(elapsed)) {
    const reminingTimeToWorkToday = settings.workTime.minus(elapsed);
    const hasBreakToday = totalBreaks.minutes > 0 &&
      totalBreaks.minutes >= settings.lunchBreak.minutes * settings.minimumBreakRatio;

    remaining = reminingTimeToWorkToday;
    if (!hasBreakToday) {
      remaining = remaining.plus(settings.lunchBreak);
    }

    let lastOpenPeriod: WorkPeriod | null = null;
    let lastClosedPeriod: WorkPeriod | null = null;
    for (let index = periods.length - 1; index >= 0; index--) {
      if (periods[index].assumedEnd && lastOpenPeriod === null) {
        lastOpenPeriod = periods[index];
      }

      if (periods[index].assumedEnd === undefined && lastClosedPeriod === null) {
        lastClosedPeriod = periods[index];
      }
    }

    // estimate end for the last open period
    if (periods.length > 0 && lastOpenPeriod !== null) {
      lastOpenPeriod.estimatedEnd = lastOpenPeriod.end.plus(remaining);

    // estimate periods if no periods for today
    } else if (periods.length === 0) {
      const currentTime = now;
      const firstDuration = new Duration(Math.floor(settings.workTime.minutes / 2));
      const secondDuration = settings.workTime.minus(firstDuration);
      periods.push(new WorkPeriod(
        currentTime,
        currentTime.plus(firstDuration),
        true
      ));
      const secondPeriodBegin = currentTime.plus(firstDuration).plus(settings.lunchBreak);
      periods.push(new WorkPeriod(
        secondPeriodBegin,
        secondPeriodBegin.plus(secondDuration),
        true
      ));
    // estimate periods and break if last period is closed
    } else {
      let begin = now;
      const currentBreakTime = lastClosedPeriod === null ?
        new Duration(0) : lastClosedPeriod.end.durationUntil(begin);

      if (!hasBreakToday) {
        const remainingBreak = settings.lunchBreak.minus(currentBreakTime);
        begin = begin.plus(remainingBreak);
      }

      periods.push(new WorkPeriod(
        begin,
        begin.plus(reminingTimeToWorkToday),
        true
      ));
    }
  }

  return {
    periods,
    elapsed,
    breaks: totalBreaks,
    remaining
  };
}
