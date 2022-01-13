const CASES = "#EBB87C";
const DEATHS = "#AAA";
const TESTS = "#6FB4D0";
const HOSPITALIZED = "#E17A76";
const ICU = "#D91D82";
const DISCARGED = "#EFCCFF";
const VACCINATIONS = "#85A346";

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
    // ensemble colors
    case "susceptible":
      return this.getSusceptibleColor();
    case "exposed":
      return this.getExposedColor();
    case "hospitalized":
      return this.getHospitalizedColor();
    case "recovered":
      return this.getRecoveredColor();
    case "death":
      return this.getDeathColor();
    case "asymptomatic":
      return this.getAsymptomaticColor();
    case "symptomatic":
      return this.getSymptomaticColor();
  }
};

colors.getCaseColor = function (numberOfDose) {
  if (numberOfDose && numberOfDose > 1)
    return d3
      .color(CASES)
      .darker(numberOfDose * 0.1)
      .formatHex();
  return CASES;
};

colors.getDeathColor = function (numberOfDose) {
  if (numberOfDose && numberOfDose > 1)
    return d3
      .color(DEATHS)
      .darker(numberOfDose * 0.2)
      .formatHex();
  return DEATHS;
};

colors.getTestColor = function () {
  return TESTS;
};

colors.getHospitalizedColor = function () {
  return HOSPITALIZED;
};

colors.getVaccinationColor = function (numberOfDose) {
  if (numberOfDose && numberOfDose > 1)
    return d3
      .color(VACCINATIONS)
      .darker(numberOfDose * 0.3)
      .formatHex();
  return VACCINATIONS;
};

colors.getICUColor = function () {
  return ICU;
};

colors.getDiscardedColor = function () {
  return DISCARGED;
};
