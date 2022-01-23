import { DataEvent } from "./DataEvent";

export class DataMilestone extends DataEvent {
  _height: number;

  constructor(date, start, end, metric, height) {
    super(date, start, end, metric);
    this._type = DataEvent.TYPES.DATA_MILESTONE;
    this._height = height;
  }

  get score() {
    // Need to figure out how to score milestone events
    return (this._height == 0) * 1 + 1;
  }

  setHeight(height) {
    this._height = height;
    return this;
  }

  get height() {
    if (!this._height) {
      throw "You must set DataMilestone height. Use constructor or chain the set function: .setHeight().";
    }
    return this._height;
  }
}
