import { color } from "@material-ui/system";

const CASES = "#EEB154";
const DEATHS = "#666";
const TESTS = "#6FB4D0";
const HOSPITALIZED = "#FA8383";
const ICU = "#D91D82";
const DISCARGED = "#EFCCFF";
const VACCINATIONS = "#94D467";

import * as d3 from "d3";

export const colors = {};

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

colors.getVaccinationColor = function (number) {
  switch (number) {
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
