import { DataEvent } from "./DataEvent";

export class Fall extends DataEvent {
  _height;
  _grad;
  _normGrad;
  _rank;

  constructor(
    date = undefined,
    start = undefined,
    end = undefined,
    metric = undefined,
    height = undefined,
    grad = undefined,
  ) {
    super(date, start, end, metric);
    this._type = DataEvent.TYPES.FALL;
    this._height = height;
    this._grad = grad;
    this._normGrad;
  }

  get rank() {
    if (this._rank) return this._rank;

    if (!this._normGrad) {
      throw "You must set normalised gradient. Use the set functions: .setNormGrad().";
    }
    return 1 + Math.min(9, Math.round(this._normGrad - 1));
  }

  setHeight(height) {
    this._height = height;
    return this;
  }

  setGrad(grad) {
    this._grad = grad;
    return this;
  }

  setNormGrad(normGrad) {
    this._normGrad = normGrad;
    return this;
  }

  get height() {
    if (!this._height) {
      throw "You must set Fall height. Use constructor or chain the set function: .setHeight().";
    }
    return this._height;
  }

  get grad() {
    if (!this._grad) {
      throw "You must set Fall grad. Use constructor or chain the set function: .setGrad().";
    }
    return this._grad > 5 ? "steep" : this._grad > 2 ? "steady" : "slow";
  }
}
