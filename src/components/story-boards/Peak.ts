import { DataEvent } from "./DataEvent";

export class Peak extends DataEvent {
  _height;
  _normHeight;
  _normWidth;
  _normDuration;

  constructor(
    date = undefined,
    start = undefined,
    end = undefined,
    metric = undefined,
    height = undefined,
  ) {
    super(date, start, end, metric);
    this._type = DataEvent.TYPES.PEAK;
    this._height = height;

    // this._normHeight;
    // this._normDuration;
  }

  setHeight(height) {
    this._height = height;
    return this;
  }

  setNormHeight(normHeight) {
    this._normHeight = normHeight;
    return this;
  }

  setNormWidth(normWidth) {
    this._normWidth = normWidth;
    return this;
  }

  get rank() {
    if (this._rank) return this._rank;

    if (!this._normHeight)
      throw "You need to set both the normalised height to calculate rank. Please use the setter.";
    return 1 + Math.floor(this._normHeight / 0.2);
  }

  get height() {
    if (!this._height) {
      throw "You must set Peak height. Use constructor or chain the set function: .setHeight().";
    }
    return this._height;
  }
}
