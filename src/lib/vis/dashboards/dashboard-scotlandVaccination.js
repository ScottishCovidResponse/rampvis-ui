import * as d3 from "d3";
import { Data } from "../data.js";
import { dashboard } from "./dashboard";
import { colors } from "../colors.js";

export class DashboardScotlandVaccination {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 400;

  constructor(options) {
    console.log("Input data", options.data);
    d3.select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container")
      .style("width", this.CHART_WIDTH + "px")
      .style("height", this.CHART_HEIGHT + "px")
      .text("an awesome visualisation");

    console.log(
      "COUNTRY_VACCINE_TOTAL",
      Data.from(options.data, Data.Fields.COUNTRY_VACCINE_TOTAL),
    );
    console.log(
      "COUNTRY_VACCINE_SEX_AGEGROUP",
      Data.from(options.data, Data.Fields.COUNTRY_VACCINE_SEX_AGEGROUP),
    );
    // console.log('HEALTH_BOARD_VACCINE_SEX_AGEGROUP_ALL', Data.from(options.data, Data.Fields.HEALTH_BOARD_VACCINE_SEX_AGEGROUP_ALL));
    // console.log('COUNCIL_VACCINE_SEX_AGEGROUP_ALL', Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP_ALL));
  }
}
