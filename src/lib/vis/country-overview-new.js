/* eslint-disable prefer-destructuring */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable spaced-comment */
/* eslint-disable one-var */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-const */
/* eslint-disable func-names */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as d3 from "d3";
import { Data } from "./data";

export class CountryOverviewNew {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 400;

  constructor(options) {
    console.log("Input data", options.data);

    // Notes: please use these
    console.log(
      "COUNTRY_NEW_CASES",
      Data.from(options.data, Data.Fields.COUNTRY_NEW_CASES),
    );
    console.log(
      "COUNTRY_HOSPITAL",
      Data.from(options.data, Data.Fields.COUNTRY_HOSPITAL),
    );
    console.log(
      "COUNTRY_ICU",
      Data.from(options.data, Data.Fields.COUNTRY_ICU),
    );
    console.log(
      "COUNTRY_VACCINE_TOTAL",
      Data.from(options.data, Data.Fields.COUNTRY_VACCINE_TOTAL),
    );
    console.log(
      "COUNTRY_VACCINE_SEX_AGEGROUP",
      Data.from(options.data, Data.Fields.COUNTRY_VACCINE_SEX_AGEGROUP),
    );
    console.log(
      "HEALTH_BOARD_TESTS_NORMALIZED",
      Data.from(options.data, Data.Fields.HEALTH_BOARD_TESTS_NORMALIZED),
    );
    console.log(
      "HEALTH_BOARD_HOSPITAL_NORMALIZED",
      Data.from(options.data, Data.Fields.HEALTH_BOARD_HOSPITAL_NORMALIZED),
    );
    console.log(
      "HEALTH_BOARD_ICU_NORMALIZED",
      Data.from(options.data, Data.Fields.HEALTH_BOARD_ICU_NORMALIZED),
    );
    console.log(
      "HEALTH_BOARD_COVID_DEATHS_NORMALIZED",
      Data.from(options.data, Data.Fields.HEALTH_BOARD_COVID_DEATHS_NORMALIZED),
    );
    console.log(
      "HEALTH_BOARD_ALL_DEATHS_NORMALIZED",
      Data.from(options.data, Data.Fields.HEALTH_BOARD_ALL_DEATHS_NORMALIZED),
    );

    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container")
      .text("TODO");
  }
}
