// Basic parent class to all Event type objects
export class SBEvent {
  protected _date;
  protected _start;
  protected _end;
  protected _rank;
  protected _type;

  constructor(date, start = 0, end = 0) {
    this._date = date;
    this._start = start;
    this._end = end;
  }

  setDate(date) {
    this._date = date;
    return this;
  }

  setStart(start) {
    this._start = start;
    return this;
  }

  setEnd(end) {
    this._end = end;
    return this;
  }

  setRank(rank) {
    this._rank = rank;
    return this;
  }

  setType(type) {
    this._type = type;
    return this;
  }

  get date() {
    if (!this._date)
      throw "Every Event object must have a date. Set it in the constructor or using the .setDate() function.";
    return this._date.toLocaleDateString();
  }

  get start() {
    if (!this._start)
      throw "This Event object doesn't have a start. Set it in the constructor or using the .setStart() function.";
    return this._start.toLocaleDateString();
  }

  get end() {
    if (!this._end)
      throw "This Event object doesn't have an end. Set it in the constructor or using the .setEnd() function.";
    return this._end.toLocaleDateString();
  }

  get rank() {
    if (!this._rank) throw "Rank is not set getter needs to be defined";
    return this._rank;
  }

  get type() {
    if (!this._type) throw "Type is not set for this event.";
    return this._type;
  }
}
