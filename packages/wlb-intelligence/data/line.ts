import {Time} from "./time";

export class Line {
  readonly content: string;
  readonly begin?: Time;
  readonly end?: Time;
  readonly success: boolean;
  readonly assumedEnd: boolean;

  constructor(content: string, success: boolean, assumedEnd: boolean, begin?: Time, end?: Time) {
    this.content = content;
    this.begin = begin;
    this.end = end;
    this.success = success;
    this.assumedEnd = assumedEnd;
  }
}
