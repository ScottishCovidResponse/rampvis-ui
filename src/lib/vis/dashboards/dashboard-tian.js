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

///////////////////////////////////////////////////////////////////////////////////////////
// This is a dashboard template file. Copy this file and start scripting a new dashboard //
// by linking to data URLS and specifying the config variable below.                     //
///////////////////////////////////////////////////////////////////////////////////////////

import * as d3 from "d3";
import { Data } from "../data";
import { dashboard } from "./dashboard";
import { colors, DEATHS } from "../colors.js";

// 1. Give class a name
export class DashboardTian {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 400;

  constructor(options) {
    // creates the main div. don't touch
    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container");

    // 2. specify data URLs here...
    var england_newCasesRate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumCasesByPublishDateRate&format=csv";
    var england_newDeathsRate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumDeaths28DaysByDeathDateRate&format=csv";
    var england_newAdmissionsRollingRate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=newAdmissionsRollingRate&format=csv";
    var ni_newCasesRate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=N92000002&metric=newCasesBySpecimenDateRollingRate&format=csv";
    var ni_newDeathsRate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=N92000002&metric=newDeaths28DaysByDeathDateRate&format=csv";
    var ni_newAdmissionsRollingRate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=N92000002&metric=newAdmissionsRollingRate&format=csv";
    var scotland_newCasesRate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=S92000003&metric=newCasesBySpecimenDateRollingRate&format=csv";
    var scotland_newDeathsRate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=S92000003&metric=newDeaths28DaysByDeathDateRollingRate&format=csv";
    var scotland_newAdmissionsRollingRate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=S92000003&metric=newAdmissionsRollingRate&format=csv";

    var aberdeenshire_vacc_rate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=utla&areaCode=S12000033&metric=cumVaccinationFirstDoseUptakeByPublishDatePercentage&format=csv";

    // Load data
    d3.csv(england_newCasesRate).then(function (data) {
      england_newCasesRate = data;
    });
    d3.csv(england_newDeathsRate).then(function (data) {
      england_newDeathsRate = data;
    });
    d3.csv(england_newAdmissionsRollingRate).then(function (data) {
      england_newAdmissionsRollingRate = data;
    });

    d3.csv(ni_newCasesRate).then(function (data) {
      ni_newCasesRate = data;
    });
    d3.csv(ni_newDeathsRate).then(function (data) {
      ni_newDeathsRate = data;
    });
    d3.csv(ni_newAdmissionsRollingRate).then(function (data) {
      ni_newAdmissionsRollingRate = data;
    });

    d3.csv(scotland_newCasesRate).then(function (data) {
      scotland_newCasesRate = data;
    });
    d3.csv(scotland_newDeathsRate).then(function (data) {
      scotland_newDeathsRate = data;
    });
    d3.csv(scotland_newAdmissionsRollingRate).then(function (data) {
      scotland_newAdmissionsRollingRate = data;
    });
    //d3.csv(aberdeenshire_vacc_rate).then(function (data) {
    //  aberdeenshire_vacc_rate = data;
    //});
    d3.csv(aberdeenshire_vacc_rate).then(function (data) {
      data[0].percent =
        data[0].cumVaccinationFirstDoseUptakeByPublishDatePercentage / 100;
      aberdeenshire_vacc_rate = data;
    });

    console.log("Tian's playground");

    setTimeout(function () {
      // 3. Specify your dashboard spec here: https://github.com/benjbach/dashboardscript/wiki
      var config = {
        layout: ["england"],
        groups: [
          {
            id: "england",
            title: "Progress Bars",
            layout: [
              [
                "ni_death_rates",
                "aberdeen_vax_progress",
                "aberdeen_vax_progress2",
              ],
            ],
          },
        ],
        widgets: [
          {
            id: "ni_death_rates",
            title: "Northern Ireland death rate daily uptake",
            dataField: "newDeaths28DaysByDeathDateRate",
            visualization: "progress",
            color: colors.getDeathColor(),
            data: ni_newDeathsRate,
            timeUnit: dashboard.TIMEUNIT_MONTH,
            min: 0,
            max: 1,
            timeWindow: 1,
            timeLabel: dashboard.TIMEUNIT_MONTH,
            detail: dashboard.DETAIL_HIGH,
            abbreviate: true,
          },
          {
            id: "aberdeen_vax_progress",
            title: "Vaccination progress in Aberdeen county",
            dataField: "cumVaccinationFirstDoseUptakeByPublishDatePercentage",
            visualization: "progress",
            color: colors.getVaccinationColor(),
            data: aberdeenshire_vacc_rate,
            timeUnit: dashboard.TIMEUNIT_DAY,
            min: 0,
            max: 100,
            unit: "%",
            detail: dashboard.DETAIL_MEDIUM,
            abbreviate: true,
          },
          {
            id: "aberdeen_vax_progress2",
            title: "Vaccination progress in Aberdeen county",
            dataField: "cumVaccinationFirstDoseUptakeByPublishDatePercentage",
            visualization: "progress",
            color: colors.getVaccinationColor(),
            data: aberdeenshire_vacc_rate,
            timeUnit: dashboard.TIMEUNIT_DAY,
            min: 0,
            max: 100,
            unit: "%",
            detail: dashboard.DETAIL_LOW,
            abbreviate: true,
          },
        ],
      };

      // this will interpret the dashboard specifiation
      dashboard.createDashboard(div, config);
    }, 2000);
  }
}
