import {expect, test} from '@jest/globals';

import {Time} from "../data/time";
import {parseTime} from "./workPeriod";

test.each([
  ['10:15', new Time(10, 15)],
  ['1:15', new Time(1, 15)],
  ['01:15', new Time(1, 15)],
  ['7', new Time(7, 0)],
  ['0', new Time(0, 0)],
  ['0:00', new Time(0, 0)],
  ['0:01', new Time(0, 1)],
  ['0:1', new Time(0, 1)],
  ['15-20', new Time(15, 20)],
  ['8:::25', new Time(8, 25)],
  ['7*20', new Time(7, 20)],
  ['7=2', new Time(7, 2)],
  ['18 17', new Time(18, 17)],
])("parseTime should parse expected formats", (raw: string, expected: Time) => {
  expect(parseTime(raw)).toEqual(expected);
});

test.each([
  ['10:85', new Time(10, 59)],
  ['25:00', new Time(23, 0)],
  ['25', new Time(23, 0)],
])("parseTime should parse some wrong formats", (raw: string, expected: Time) => {
  expect(parseTime(raw)).toEqual(expected);
});

test.each([
  ['midnight'],
  ['a'],
  [''],
  ['-1'],
  ['-1:15'],
])("parseTime shouldn't parses wrong formats", (raw: string) => {
  expect(parseTime(raw)).toEqual(undefined);
});
