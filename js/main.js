if (window.wlb === undefined) {
  (function () {
    // save input value to localstorage

    const MemoizableInput = function (elementId, lsKey) {
      this.elementId = elementId;
      this.input = null;
      this.lsKey = lsKey;
    };

    MemoizableInput.prototype.init = function () {
      this.input = document.getElementById(this.elementId);
      this.ls = window.localStorage;
      if (this.ls) {
        const lsValue = this.ls.getItem(this.lsKey)
        if (lsValue !== null) {
          this.input.value = this.ls.getItem(this.lsKey);
        }
        this.bindAll();
      }
    };

    MemoizableInput.prototype.bindAll = function () {
      this.input.addEventListener("input", this.onValueChange.bind(this));
      this.input.addEventListener("change", this.onValueChange.bind(this));
    };

    MemoizableInput.prototype.onValueChange = function () {
      const currentValue = this.input.value;
      //console.debug("value changed", currentValue);
      this.ls.setItem(this.lsKey, currentValue);
    };


    // insert input examples

    const InputExamples = function () {
      this.cssClass = "input-example";
      this.timeInput = undefined;
    };

    InputExamples.prototype.init = function () {
      this.timeInput = document.getElementById("time-input");
      for (let el of document.getElementsByClassName(this.cssClass)) {
        el.addEventListener("click", this.onClick.bind(this));
      }
    };

    InputExamples.prototype.onClick = function (event) {
      const value = event.target.innerText;
      if (value) {
        this.timeInput.value = value;
        var inputEvent = document.createEvent("HTMLEvents");
        inputEvent.initEvent("change", false, true);
        this.timeInput.dispatchEvent(inputEvent);
      }
    };


    // time manipulation

    const Time = function (hour, minute) {
      this.hour = Math.min(23, Math.max(0, hour || 0));
      this.minute = Math.min(59, Math.max(0, minute || 0));
    }

    Time.fromMinutesOfDay = function (minutes) {
      minutes = Math.min(60*24, Math.max(0, minutes || 0));
      return new Time(Math.floor(minutes / 60), minutes % 60);
    }

    Time.prototype.formatted = function () {
      const minuteStr = (this.minute + '').padStart(2, '0');
      return this.hour + ":" + minuteStr;
    };

    Time.prototype.minutesOfDay = function () {
      return this.hour * 60 + this.minute;
    };

    Time.prototype.compare = function (other) {
      if (other.minutesOfDay() < this.minutesOfDay()) {
        return 1;
      } else if (other.minutesOfDay() > this.minutesOfDay()) {
        return -1;
      }
      return 0;
    };

    Time.prototype.ge = function (other) {
      return this.compare(other) >= 0;
    };

    Time.prototype.gt = function (other) {
      return this.compare(other) > 0;
    };

    Time.prototype.le = function (other) {
      return this.compare(other) <= 0;
    };

    Time.prototype.lt = function (other) {
      return this.compare(other) < 0;
    };

    Time.prototype.durationUntil = function (other) {
      let cmp = this.compare(other);
      if (cmp < 0) {
        return new Duration(other.minutesOfDay() - this.minutesOfDay());
      } else if (cmp > 0) { // day wrap
        return new Duration(60*24 - this.minutesOfDay() + other.minutesOfDay());
      }
      return new Duration(0);
    };

    Time.prototype.plus = function (duration) {
      let minutesOfDay = this.minutesOfDay() + duration.minutes;
      minutesOfDay = minutesOfDay % (60 * 24);
      return Time.fromMinutesOfDay(minutesOfDay);
    };

    Time.prototype.minus = function (duration) {
      let minutesOfDay = this.minutesOfDay() - duration.minutes;
      minutesOfDay = minutesOfDay % (60 * 24);
      if (minutesOfDay < 0) {
        minutesOfDay = 24 * 60 + minutesOfDay;
      }
      return Time.fromMinutesOfDay(minutesOfDay);
    };

    Time.MkTime = function (hour, minute) {
      return new Time(hour, minute);
    };

    Time.Now = function () {
      const now = new Date();
      return Time.MkTime(now.getHours(), now.getMinutes());
    };


    const Duration = function (minutes) {
      this.minutes = Math.max(0, minutes || 0);
    }

    const DurationHelpers = {
      number: new RegExp(/\d+/),
      onlyNumeric: new RegExp(/^\d+$/),
      durationSpec: new RegExp(/\d+[ .:-]*[hmd]*/, "g"),
    }

    Duration.parse = function (value) {
      value = value.toLowerCase();
      if (value.match(DurationHelpers.onlyNumeric)) {
        return new Duration(parseInt(value) * 60);
      } else {
        const matchedSpecs = value.matchAll(DurationHelpers.durationSpec);
        let minutes = 0;
        for (const spec of matchedSpecs) {
          const numberMatch = spec[0].match(DurationHelpers.number);
          if (numberMatch !== null) {
            const number = parseInt(numberMatch[0]);
            if (spec[0].includes("m")) {
              minutes += number;
            } else if (spec[0].includes("d")) {
              minutes += 24*60*number;
            } else {
              minutes += number * 60;
            }
          }
        }
        return new Duration(minutes);
      }
    }

    Duration.prototype.formatted = function () {
      const hours = Math.floor(this.minutes / 60);
      if (hours > 0) {
        const hourMinutes = this.minutes % 60;
        if (hourMinutes !== 0) {
          return hours + 'h ' + (this.minutes % 60) + 'm';
        }
        return hours + 'h';
      }
      return this.minutes + 'm';
    };

    Duration.prototype.plus = function (other) {
      return new Duration(this.minutes + other.minutes);
    };

    Duration.prototype.minus = function (other) {
      return new Duration(this.minutes - other.minutes);
    };

    Duration.prototype.compare = function (other) {
      if (other.minutes < this.minutes) {
        return 1;
      } else if (other.minutes > this.minutes) {
        return -1;
      }
      return 0;
    };

    Duration.prototype.ge = function (other) {
      return this.compare(other) >= 0;
    };

    Duration.prototype.gt = function (other) {
      return this.compare(other) > 0;
    };

    Duration.prototype.le = function (other) {
      return this.compare(other) <= 0;
    };

    Duration.prototype.lt = function (other) {
      return this.compare(other) < 0;
    };

    // parse today working periods

    const TodayHelpers = {
      // compile regexps for speedup matching
      timeRegExp: new RegExp(/^\s*(?<hour>[0-9]+)[^0-9]*(?<minute>[0-9]*)\s*$/),
      beginEndRegExp: new RegExp(/\s+[a-z\-–\t]*\s*/, "i"),
      newLineRegExp: new RegExp(/\r?\n/),
      minimumBreakRatio: 0.5
    };

    const Today = function () {
      this.timeInput = null;
      this.workTime = null;
      this.lunchBreak = null;
      this.todayPeriods = null;
      this.updateInterval = null;
    };

    Today.prototype.init = function () {
      this.timeInput = document.getElementById("time-input");
      this.workTime = document.getElementById("work-time");
      this.lunchBreak = document.getElementById("lunch-break");
      this.todayPeriods = document.getElementById("today-periods");

      this.timeInput.addEventListener("input", this.updateWorkingPeriods.bind(this));
      this.timeInput.addEventListener("change", this.updateWorkingPeriods.bind(this));
      this.updateWorkingPeriods();
      this.updateInterval = setInterval(this.updateWorkingPeriods.bind(this), 5000);
    };

    Today.prototype.parseWorkingPeriods = function () {
      const currentValue = this.timeInput.value;
      if (!currentValue) {
        return [];
      } else {
        return currentValue.trim().split(TodayHelpers.newLineRegExp).map(this._parseLine.bind(this));
      }
    };

    Today.prototype._parseTime = function (time) {
      const timeMatch = time.match(TodayHelpers.timeRegExp);
      if (timeMatch && timeMatch.groups.hour) {
        let minute = 0;
        if (timeMatch.groups.minute) {
          minute = parseInt(timeMatch.groups.minute) || 0
        }
        return Time.MkTime(parseInt(timeMatch.groups.hour), minute)
      }
      return null;
    };

    Today.prototype._parseLine = function (line) {
      const parts = line.trim().split(TodayHelpers.beginEndRegExp).filter(x => x.length > 0);
      let begin = null;
      let end = null;
      let success = false;
      let assumedEnd = false;
      if (parts.length === 1) {
        begin = this._parseTime(parts[0]);
        if (begin !== null) {
          end = Time.Now();
          assumedEnd = true;
          success = true;
        }
      } else if (parts.length === 2) {
        begin = this._parseTime(parts[0]);
        if (begin !== null) {
          end = this._parseTime(parts[1]);
        }
        success = !!begin && !!end;
      }
      return {
        content: line,
        begin,
        end,
        success,
        assumedEnd
      }
    };

    Today.prototype.renderParseError = function () {
      const noDataDiv = document.createElement("p");
      noDataDiv.id = "today-no-data";
      noDataDiv.innerText = "No working periods have been detected for today. Try hour formats as in example."
      this.todayPeriods.appendChild(noDataDiv);
    };

    Today.prototype.renderData = function (enriched) {
      const table = document.createElement("table");
      table.id = "today-data";
      table.className = "periods-table";

      const header = document.createElement("tr");
      const beginHeader = document.createElement("th");
      beginHeader.innerText = "Begin";
      header.appendChild(beginHeader);

      const endHeader = document.createElement("th");
      endHeader.innerText = "End";
      header.appendChild(endHeader);

      const lenHeader = document.createElement("th");
      lenHeader.innerText = "Length";
      header.appendChild(lenHeader);
      table.append(header);

      for (const period of enriched.periods) {
        const line = document.createElement("tr");

        const begin = document.createElement("td");
        begin.innerText = period.begin.formatted();
        line.appendChild(begin);

        const end = document.createElement("td");
        end.innerText = period.end.formatted();
        if (period.assumedEnd) {
          end.className = 'assumed';
        }
        // FIXME add badge
        if (period.estimateEnd !== undefined) {
          end.innerText += '\nest: ' + period.estimateEnd.formatted();
        }
        line.appendChild(end);

        const len = document.createElement("td");
        len.innerText = period.duration.formatted();
        if (period.assumedEnd) {
          len.className = 'assumed';
        }
        line.appendChild(len);

        table.appendChild(line);
      }
      this.todayPeriods.appendChild(table);

      const summary = document.createElement("div");
      summary.className = 'summary'
      const totalLabel = document.createElement("span");
      totalLabel.className = "value-label";
      totalLabel.innerText = "Total";
      summary.append(totalLabel);
      summary.append(' ');
      summary.append(enriched.totalDuration.formatted());
      this.todayPeriods.appendChild(summary);

    };

    Today.prototype.cleanContent = function () {
      this.todayPeriods.innerHTML = '';
    };

    Today.prototype.updateWorkingPeriods = function () {
      const parsed = this.parseWorkingPeriods();
      const success = parsed.filter(e => e.success);
      const enriched = this.enrichWorkingPeriods(success);
      // console.debug(periods);
      this.cleanContent();
      if (enriched.periods.length === 0 && parsed.length > 0) {
        this.renderParseError();
      } else if (enriched.periods.length > 0) {
        this.renderData(enriched);
      }
    };

    Today.prototype.enrichWorkingPeriods = function (periods) {
      const durations = [];
      const breaks = [];
      periods.sort(function(a, b) {
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
        const duration = period.begin.durationUntil(period.end);
        period.duration = duration;
        durations.push(duration);

        if (previousEnd !== null) {
          breaks.push(previousEnd.durationUntil(period.begin));
        }
        previousEnd = period.end;
      }
      const totalDuration = durations.reduce((acc, x) => acc.plus(x), new Duration(0));
      const totalBreaks = breaks.reduce((acc, x) => acc.plus(x), new Duration(0));
      const workTime = Duration.parse(this.workTime.value);
      const lunchBreak = Duration.parse(this.lunchBreak.value);

      // console.debug("totalDuration", totalDuration.formatted());
      // console.debug("totalBreaks", totalBreaks.formatted());

      let elapsed = null;
      if (workTime.gt(totalDuration)) {
        elapsed = workTime.minus(totalDuration);
        if (totalBreaks.minutes === 0 || totalBreaks.minutes < lunchBreak.minutes * TodayHelpers.minimumBreakRatio) {
          elapsed = elapsed.plus(lunchBreak);
        }
      }

      if (elapsed !== null && periods.length > 0 && periods[periods.length - 1].assumedEnd) {
        periods[periods.length - 1].estimateEnd = periods[periods.length - 1].end.plus(elapsed);
      }
      // TODO: estimate next periods

      // console.debug("breaks", breaks);
      // if (elapsed !== null) {
      //   console.debug("elapsed", elapsed.formatted());
      // }

      return {
        periods,
        totalDuration,
        totalBreaks,
        elapsed
      };
    };


    window.wlb = {
      init: function () {
        for (const prop in window.wlb) {
          if (prop !== "init" && window.wlb.hasOwnProperty(prop) && window.wlb[prop].init !== undefined) {
            window.wlb[prop].init();
          }
        }
      },
      saveInput: new MemoizableInput("time-input", "input"),
      saveWorkTimeConfig: new MemoizableInput("work-time", "work-time"),
      saveLunchBreakConfig: new MemoizableInput("lunch-break", "lunch-break"),
      inputExamples: new InputExamples(),
      today: new Today()
    };

    window.wlb.init();
  })();
}
