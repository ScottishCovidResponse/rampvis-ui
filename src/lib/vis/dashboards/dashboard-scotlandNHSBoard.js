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
import { dashboard } from "./dashboard";
import { colors } from "../colors.js";

/* 
author: Benjamin Bach, bbach@ed.ac.uk
*/
var COLOR_CASES = "#e93516"; // orange
var COLOR_DEATHS = "#f0852d"; // orange
var COLOR_TESTS = "#2a9d8f"; // green
var COLOR_HOSPITAL = "#264653"; // blue

var nhsBoardField = "";
var latestUpdateTime = "";

// DATA STREAM TITLES

export class DashboardScotlandNHSBoard {
  constructor(options) {
    console.log("--> OPTIONs:", options);
    console.log("--> Input data:", options.data);

    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container");


    console.log(':: options', options)

    nhsBoardField = Object.keys(options.data[0].values[0])[1];
    latestUpdateTime = console.log(
      options.data[0].values[options.data[0].values.length - 1].index,
    );
    var data = options.data;
    var links = [options.parentLink]
    links = links.concat(options.childrenLinks);
      
    var config = {
      links: links,
      layout: [
      "testdeath", 
      "hospital"
      , 
      "vaccination"
    ],
      groups: [
        {
          id: "hospital",
          title: "Covid19 in Hospital",
          layout: [["hospital2", "icu"]],
        },
        {
          id: "testdeath",
          title: "Testing & Deaths",
          layout: [["dailyTests", 'deaths-weekly']],
        },
        {
          id: "deaths",
          title: "Deaths",
          layout: ["deaths-weekly"],
        },
        {
          id: "vaccination",
          title: "Vaccinations",
          layout: [
            ["vaccination-total-1st", "vaccination-agegroups-dose1"],
            ["vaccination-total-2nd", "vaccination-agegroups-dose2"],
          ],
        },
        {},
      ],
      widgets: [
        {
          id: "icu",
          title: "In ICU",
          dataField: nhsBoardField,
          color: colors.getICUColor(),
          data: Data.from(options.data, Data.Fields.HEALTH_BOARD_ICU),
          visualization: "linechart",
          cumulative: false,
          detail: dashboard.DETAIL_HIGH,
          min: 0
        },
        {
          id: "hospital2",
          title: "In Hospital",
          dataField: nhsBoardField,
          color: colors.getHospitalizedColor(),
          data: Data.from(options.data, Data.Fields.HEALTH_BOARD_HOSPITAL),
          visualization: "linechart",
          detail: "medium",
          cumulative: false,
          detail: dashboard.DETAIL_HIGH,
          conditions: [
            'index != "2011-01-12"', 
          ],
          min: 0
        },
        {
          id: "dailyTests",
          title: "Daily Tests",
          visualization: "linechart",
          dataField: nhsBoardField,
          color: colors.getTestColor(),
          data: Data.from(options.data, Data.Fields.HEALTH_BOARD_TESTS),
          // mode: dashboard.MODE_DAILY,
          cumulative: false,
          detail: dashboard.DETAIL_HIGH,
          min: 0
        },
        {
          id: "deaths-weekly",
          title: "Covid19 related deaths (weekly)",
          visualization: "linechart",
          dataField: nhsBoardField,
          color: colors.getDeathColor(),
          data: Data.from(options.data, Data.Fields.HEALTH_BOARD_COVID_DEATHS),
          mode: dashboard.MODE_WEEKLY,
          cumulative: false,
          timeUnit: dashboard.TIMEUNIT_WEEK,
          conditions: [
            "index.length > 4",
            'index.indexOf("-01-01") == -1'
          ],
          min: 0
        },
        {
          id: "deaths-all",
          title: "All Deaths (weekly)",
          dataField: nhsBoardField,
          visualization: "linechart",
          color: colors.getDeathColor(),
          data: Data.from(options.data, Data.Fields.HEALTH_BOARD_ALL_DEATHS),
          mode: dashboard.MODE_WEEKLY,
          cumulative: false, 
          timeUnit: dashboard.TIMEUNIT_WEEK,
          conditions: ["index.length > 4"],
          min: 0
        },
        {
          id: "vaccination-total-1st",
          title: "Total Dose 1 (over 18yrs)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(1),
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true, 
          unit: '%',
          min: 0, max: 100,
          detail: dashboard.DETAIL_MEDIUM,
          layout: 'horizontal',
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 1"',
            'AgeGroup == "18 years and over"',
          ],
        },
        {
          id: "vaccination-total-2nd",
          title: "Total Dose 2 (over 18yrs)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(2),
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true, 
          min: 0, max: 100,
          unit: '%',
          detail: dashboard.DETAIL_MEDIUM,
          layout: 'horizontal',
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 2"',
            'AgeGroup == "18 years and over"',
          ],
        },
        {
          id: "vaccination-agegroups-dose1",
          title: "Dose 1 by age group",
          dataField: "CumulativePercentCoverage",
          visualization: "barchart",
          color: colors.getVaccinationColor(1),
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true, 
          min: 0, max: 100,
          unit: '%',
          detail: dashboard.DETAIL_MEDIUM,
          categories: "AgeGroup",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 1"',
            'AgeGroup.indexOf("and over") < 0',
          ],
        },
        {
          id: "vaccination-agegroups-dose2",
          title: "Dose 2 by age group",
          dataField: "CumulativePercentCoverage",
          visualization: "barchart",
          color: colors.getVaccinationColor(2),
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true, 
          min: 0, max: 100,
          unit: '%',
          detail: dashboard.DETAIL_MEDIUM,
          categories: "AgeGroup",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 2"',
            'AgeGroup.indexOf("and over") < 0',
          ],
        },
      ],
    };

    dashboard.createDashboard(div, config);
  }
}
