import { SBEvent } from "./SBEvent";

// Parent type to data event objects
export class DataEvent extends SBEvent {
  _metric;

  static get TYPES() {
    return {
      DEFAULT: "DATA EVENT",
      PEAK: "PEAK",
      DATA_MILESTONE: "DATA MILESTONE",
      RISE: "RISE",
      FALL: "FALL",
    };
  }

  constructor(date, start, end, metric) {
    super(date, start, end);
    this._metric = metric;
    this._type = DataEvent.TYPES.DEFAULT;
  }

  setMetric(metric) {
    this._metric = metric;
    return this;
  }

  get metric() {
    if (!this._metric)
      throw "You must give a metric to DataEvents. Use constructor or chain the set function: .setMetric().";
    return this._metric;
  }

  get duration() {
    const dayLen = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((this._start - this._end) / dayLen));
  }
}
