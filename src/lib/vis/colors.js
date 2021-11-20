const CASES = "#EEB154";
const DEATHS = "#666";
const TESTS = "#6FB4D0";
const HOSPITALIZED = "#FA8383";
const ICU = "#D91D82";
const DISCARGED = "#EFCCFF";
const VACCINATIONS = "#94D467";

import * as d3 from "d3";

export const colors = {};

colors.get = function (dataType, value) {
  switch (dataType) {
    case "cases":
      return this.getCaseColor();
    case "deaths":
      return this.getCaseColor();
    case "hospitalized":
      return this.getCaseColor();
    case "tests":
      return this.getCaseColor();
    case "vaccination":
      return this.getCaseColor();
    case "cases":
      return this.getCaseColor();
  }
};

colors.getCaseColor = function () {
  return CASES;
};

colors.getDeathColor = function () {
  return DEATHS;
};

colors.getTestColor = function () {
  return TESTS;
};

colors.getHospitalizedColor = function () {
  return HOSPITALIZED;
};

colors.getVaccinationColor = function (numberOfDose) {
  switch (numberOfDose) {
    case 2:
      return d3.color(VACCINATIONS).darker(0.3);
    case 3:
      return d3.color(VACCINATIONS).darker(0.6);
    default:
      return VACCINATIONS;
  }
};

colors.getICUColor = function () {
  return ICU;
};

colors.getDiscardedColor = function () {
  return DISCARGED;
};
