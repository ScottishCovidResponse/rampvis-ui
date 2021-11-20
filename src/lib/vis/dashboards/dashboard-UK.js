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

export class DashboardUK {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 400;

  constructor(options) {
    // creates the main div. don't touch
    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container");

    // 1. specify data URLs here...
    var cumAdmissions =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=cumAdmissions&format=csv";
    var cumCasesBySpecimenDate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=cumCasesBySpecimenDate&format=csv";
    var cumDeaths28DaysByDeathDate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=cumDeaths28DaysByDeathDate&format=csv";
    var cumPeopleVaccinatedFirstDoseByPublishDate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=cumPeopleVaccinatedFirstDoseByPublishDate&format=csv";
    var cumPeopleVaccinatedSecondDoseByPublishDate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=cumPeopleVaccinatedSecondDoseByPublishDate&format=csv";
    var cumPeopleVaccinatedThirdInjectionByPublishDate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=cumPeopleVaccinatedThirdInjectionByPublishDate&format=csv";

    var newAdmissions =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=newAdmissions&metric=newAdmissionsChange&format=csv";
    var newCasesBySpecimenDate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=newCasesBySpecimenDate&format=csv";
    var newDeaths28DaysByDeathDate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=newDeaths28DaysByDeathDate&metric=newDeaths28DaysByPublishDateChange&format=csv";
    var newPeopleVaccinatedFirstDoseByPublishDate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=newPeopleVaccinatedFirstDoseByPublishDate&format=csv";
    var newPeopleVaccinatedSecondDoseByPublishDate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=newPeopleVaccinatedSecondDoseByPublishDate&format=csv";
    var newPeopleVaccinatedThirdInjectionByPublishDate =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=newPeopleVaccinatedThirdInjectionByPublishDate&format=csv";

    // var england_newCasesRate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumCasesByPublishDateRate&format=csv"
    // var england_newDeathsRate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumDeaths28DaysByDeathDateRate&format=csv"
    // var england_newAdmissionsRollingRate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=newAdmissionsRollingRate&format=csv"
    // var ni_newCasesRate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=N92000002&metric=newCasesBySpecimenDateRollingRate&format=csv"
    // var ni_newDeathsRate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=N92000002&metric=newDeaths28DaysByDeathDateRate&format=csv"
    // var ni_newAdmissionsRollingRate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=N92000002&metric=newAdmissionsRollingRate&format=csv"
    // var scotland_newCasesRate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=S92000003&metric=newCasesBySpecimenDateRollingRate&format=csv"
    // var scotland_newDeathsRate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=S92000003&metric=newDeaths28DaysByDeathDateRollingRate&format=csv"
    // var scotland_newAdmissionsRollingRate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=S92000003&metric=newAdmissionsRollingRate&format=csv"

    // // Load data
    // d3.csv(england_newCasesRate).then(function (data) {
    //   england_newCasesRate = data;
    // });
    // d3.csv(england_newDeathsRate).then(function (data) {
    //   england_newDeathsRate = data;
    // });
    // d3.csv(england_newAdmissionsRollingRate).then(function (data) {
    //   england_newAdmissionsRollingRate = data;
    // });

    // d3.csv(ni_newCasesRate).then(function (data) {
    //   ni_newCasesRate = data;
    // });
    // d3.csv(ni_newDeathsRate).then(function (data) {
    //   ni_newDeathsRate = data;
    // });
    // d3.csv(ni_newAdmissionsRollingRate).then(function (data) {
    //   ni_newAdmissionsRollingRate = data;
    // });

    // d3.csv(scotland_newCasesRate).then(function (data) {
    //   scotland_newCasesRate = data;
    // });
    // d3.csv(scotland_newDeathsRate).then(function (data) {
    //   scotland_newDeathsRate = data;
    // });
    // d3.csv(scotland_newAdmissionsRollingRate).then(function (data) {
    //   scotland_newAdmissionsRollingRate = data;
    // });

    d3.csv(cumAdmissions).then(function (data) {
      cumAdmissions = data;
    });
    d3.csv(newAdmissions).then(function (data) {
      newAdmissions = data;
    });

    d3.csv(cumCasesBySpecimenDate).then(function (data) {
      cumCasesBySpecimenDate = data;
    });
    d3.csv(newCasesBySpecimenDate).then(function (data) {
      newCasesBySpecimenDate = data;
    });

    d3.csv(cumDeaths28DaysByDeathDate).then(function (data) {
      cumDeaths28DaysByDeathDate = data;
    });
    d3.csv(newDeaths28DaysByDeathDate).then(function (data) {
      newDeaths28DaysByDeathDate = data;
    });

    d3.csv(cumPeopleVaccinatedFirstDoseByPublishDate).then(function (data) {
      cumPeopleVaccinatedFirstDoseByPublishDate = data;
    });
    d3.csv(newPeopleVaccinatedFirstDoseByPublishDate).then(function (data) {
      newPeopleVaccinatedFirstDoseByPublishDate = data;
    });

    d3.csv(cumPeopleVaccinatedSecondDoseByPublishDate).then(function (data) {
      cumPeopleVaccinatedSecondDoseByPublishDate = data;
    });
    d3.csv(newPeopleVaccinatedSecondDoseByPublishDate).then(function (data) {
      newPeopleVaccinatedSecondDoseByPublishDate = data;
    });

    d3.csv(cumPeopleVaccinatedThirdInjectionByPublishDate).then(function (
      data,
    ) {
      cumPeopleVaccinatedThirdInjectionByPublishDate = data;
    });
    d3.csv(newPeopleVaccinatedThirdInjectionByPublishDate).then(function (
      data,
    ) {
      newPeopleVaccinatedThirdInjectionByPublishDate = data;
    });

    // test all data are loaded, once every second
    var timeseriesWidget = function (
      id,
      title,
      dataField,
      mode,
      data,
      color,
      detail,
    ) {
      var w = {
        id: id,
        title: title,
        dataField: dataField,
        visualization: "linechart",
        color: color,
        data: data,
        mode: mode,
        detail: detail,
        dateVariable: "date",
        abbreviate: true,
      };
      return w;
    };

    setTimeout(function () {
      // 2. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki
      var config = {
        layout: [["cases", "admissions", "deaths"], "vacc"],
        groups: [
          {
            id: "admissions",
            title: "Admissions",
            layout: ["cumAdmissions", "newAdmissions"],
          },
          {
            id: "cases",
            title: "Cases",
            layout: ["cumCasesBySpecimenDate", "newCasesBySpecimenDate"],
          },
          {
            id: "deaths",
            title: "Deaths",
            layout: [
              "cumDeaths28DaysByDeathDate",
              "newDeaths28DaysByDeathDate",
            ],
          },
          {
            id: "vacc",
            title: "Vaccinations",
            layout: [
              [
                ["vacc1", "vacc1d"],
                ["vacc2", "vacc2d"],
                ["vacc3", "vacc3d"],
              ],
            ],
          },
        ],
        widgets: [
          timeseriesWidget(
            "cumAdmissions",
            "Cumulative Admissions",
            "cumAdmissions",
            dashboard.MODE_CUMULATIVE,
            cumAdmissions,
            colors.getHospitalizedColor(),
            dashboard.DETAIL_HIGH,
          ),
          timeseriesWidget(
            "newAdmissions",
            "New Daily Admissions",
            "newAdmissions",
            dashboard.MODE_DAILY,
            newAdmissions,
            colors.getHospitalizedColor(),
            dashboard.DETAIL_HIGH,
          ),
          timeseriesWidget(
            "cumCasesBySpecimenDate",
            "Cumulative Cases",
            "cumCasesBySpecimenDate",
            dashboard.MODE_CUMULATIVE,
            cumCasesBySpecimenDate,
            colors.getCaseColor(),
            dashboard.DETAIL_HIGH,
          ),
          timeseriesWidget(
            "newCasesBySpecimenDate",
            "New Daily Cases",
            "newCasesBySpecimenDate",
            dashboard.MODE_DAILY,
            newCasesBySpecimenDate,
            colors.getCaseColor(),
            dashboard.DETAIL_HIGH,
          ),
          timeseriesWidget(
            "cumDeaths28DaysByDeathDate",
            "Cumulative Deaths",
            "cumDeaths28DaysByDeathDate",
            dashboard.MODE_CUMULATIVE,
            cumDeaths28DaysByDeathDate,
            colors.getDeathColor(),
            dashboard.DETAIL_HIGH,
          ),
          timeseriesWidget(
            "newDeaths28DaysByDeathDate",
            "New Weekly Deaths ",
            "newDeaths28DaysByDeathDate",
            dashboard.MODE_WEEKLY,
            newDeaths28DaysByDeathDate,
            colors.getDeathColor(),
            dashboard.DETAIL_HIGH,
          ),
          timeseriesWidget(
            "vacc1",
            "Total 1st Dose Update",
            "cumPeopleVaccinatedFirstDoseByPublishDate",
            dashboard.MODE_CUMULATIVE,
            cumPeopleVaccinatedFirstDoseByPublishDate,
            colors.getVaccinationColor(1),
            dashboard.DETAIL_MEDIUM,
          ),
          // timeseriesWidget(
          //   "vacc1d",
          //   "Daily 1st Dose Vaccinations",
          //   "newPeopleVaccinatedFirstDoseByPublishDate",
          //   dashboard.MODE_DAILY,
          //   newPeopleVaccinatedFirstDoseByPublishDate,
          //   colors.getVaccinationColor(1),
          //   dashboard.DETAIL_MEDIUM
          // ),
          timeseriesWidget(
            "vacc2",
            "Total 2nd Dose Update",
            "cumPeopleVaccinatedSecondDoseByPublishDate",
            dashboard.MODE_CUMULATIVE,
            cumPeopleVaccinatedSecondDoseByPublishDate,
            colors.getVaccinationColor(2),
            dashboard.DETAIL_MEDIUM,
          ),
          // timeseriesWidget(
          //   "vacc2d",
          //   "2nd Dose Daily",
          //   "newPeopleVaccinatedSecondDoseByPublishDate",
          //   dashboard.MODE_DAILY,
          //   newPeopleVaccinatedSecondDoseByPublishDate,
          //   colors.getVaccinationColor(2),
          //   dashboard.DETAIL_MEDIUM
          // ),
          timeseriesWidget(
            "vacc3",
            "Total 3rd Dose Uptake",
            "cumPeopleVaccinatedThirdInjectionByPublishDate",
            dashboard.MODE_CUMULATIVE,
            cumPeopleVaccinatedThirdInjectionByPublishDate,
            colors.getVaccinationColor(3),
            dashboard.DETAIL_MEDIUM,
          ),
          // timeseriesWidget(
          //   "vacc3d",
          //   "3rd Dose Daily",
          //   "newPeopleVaccinatedThirdInjectionByPublishDate",
          //   dashboard.MODE_DAILY,
          //   newPeopleVaccinatedThirdInjectionByPublishDate,
          //   colors.getVaccinationColor(3),
          //   dashboard.DETAIL_MEDIUM
          // ),
        ],
      };

      // this will interpret the dashboard specifiation
      dashboard.createDashboard(div, config);
    }, 5000);
  }
}
