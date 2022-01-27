import { SBEvent } from "./SBEvent";

export class SemanticEvent extends SBEvent {
  _type;
  _description;
  _rank;

  static get TYPES() {
    return {
      DEFAULT: "SEMANTIC EVENT",
      LOCKDOWN: "LOCKDOWN",
      LOCKDOWN_START: "LOCKDOWN START",
      LOCKDOWN_END: "LOCKDOWN END",
      VACCINE: "VACCINE",
    };
  }

  constructor(
    date,
    rank = undefined,
    description = undefined,
    type = SemanticEvent.TYPES.DEFAULT,
  ) {
    super(date);
    this._type = type;
    this._rank = rank;
    this._description = description;
  }

  setDescription(description) {
    this._description = description;
    return this;
  }

  get description() {
    if (!this._description)
      throw "Description not set for semantic event. Please use constructor or .setDescription()";

    return this._description;
  }

  get rank() {
    if (!this._rank)
      throw "Rank not set for semantic event. Please use constructor or .setRank()";

    return this._rank;
  }
}
