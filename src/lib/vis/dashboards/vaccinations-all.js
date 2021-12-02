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
import { Data } from "../data.js";
import { dashboard, COLOR_VACCINATON, COLOR_DEATHS } from "./dashboard";

export class VaccinationsAll {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 400;

  constructor(options) {
    console.log("Input data", options.data);
    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container");

    // This could be a way to get data without relying on stream order.
    const allDeathData = Data.from(
      options.data,
      Data.Fields.COUNCIL_ALL_DEATHS,
    );
    console.log(allDeathData);
    const covidDeathData = Data.from(
      options.data,
      Data.Fields.COUNCIL_COVID_DEATHS,
    );
    const vaccineData = Data.from(
      options.data,
      Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
    );

    console.log(vaccineData);

    var config = {
      layout: [],
      groups: [],
      widgets: [],
    };

    dashboard.createDashboard(div, config);
  }
}
