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
    var timeseriesWidget = function (id, title, dataField, mode, data, color) {
      var w = {
        id: id,
        title: title,
        dataField: dataField,
        visualization: "linechart",
        color: color,
        data: data,
        mode: mode,
        detail: dashboard.DETAIL_HIGH,
        dateVariable: "date",
        abbreviate: true,
      };
      return w;
    };

    setTimeout(function () {
      // 2. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki
      var config = {
        layout: [["admissions", "cases", "deaths", "vacc"]],
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
            "Cumulative",
            "cumAdmissions",
            dashboard.MODE_CUMULATIVE,
            cumAdmissions,
            colors.getHospitalizedColor(),
          ),
          timeseriesWidget(
            "newAdmissions",
            "New",
            "newAdmissions",
            dashboard.MODE_DAILY,
            newAdmissions,
            colors.getHospitalizedColor(),
          ),
          timeseriesWidget(
            "cumCasesBySpecimenDate",
            "Cumulative",
            "cumCasesBySpecimenDate",
            dashboard.MODE_CUMULATIVE,
            cumCasesBySpecimenDate,
            colors.getCaseColor(),
          ),
          timeseriesWidget(
            "newCasesBySpecimenDate",
            "New",
            "newCasesBySpecimenDate",
            dashboard.MODE_DAILY,
            newCasesBySpecimenDate,
            colors.getCaseColor(),
          ),
          timeseriesWidget(
            "cumDeaths28DaysByDeathDate",
            "Cumulative",
            "cumDeaths28DaysByDeathDate",
            dashboard.MODE_CUMULATIVE,
            cumDeaths28DaysByDeathDate,
            colors.getDeathColor(),
          ),
          timeseriesWidget(
            "newDeaths28DaysByDeathDate",
            "New",
            "newDeaths28DaysByDeathDate",
            dashboard.MODE_DAILY,
            newDeaths28DaysByDeathDate,
            colors.getDeathColor(),
          ),
          timeseriesWidget(
            "vacc1",
            "Cumulative",
            "cumPeopleVaccinatedFirstDoseByPublishDate",
            dashboard.MODE_CUMULATIVE,
            cumPeopleVaccinatedFirstDoseByPublishDate,
            colors.getVaccinationColor(1),
          ),
          timeseriesWidget(
            "vacc1d",
            "Daily",
            "newPeopleVaccinatedFirstDoseByPublishDate",
            dashboard.MODE_DAILY,
            newPeopleVaccinatedFirstDoseByPublishDate,
            colors.getVaccinationColor(1),
          ),
          timeseriesWidget(
            "vacc2",
            "Cumulative",
            "cumPeopleVaccinatedSecondDoseByPublishDate",
            dashboard.MODE_CUMULATIVE,
            cumPeopleVaccinatedSecondDoseByPublishDate,
            colors.getVaccinationColor(2),
          ),
          timeseriesWidget(
            "vacc2d",
            "Daily",
            "newPeopleVaccinatedSecondDoseByPublishDate",
            dashboard.MODE_DAILY,
            newPeopleVaccinatedSecondDoseByPublishDate,
            colors.getVaccinationColor(2),
          ),
          timeseriesWidget(
            "vacc3",
            "Cumulative",
            "cumPeopleVaccinatedThirdInjectionByPublishDate",
            dashboard.MODE_CUMULATIVE,
            cumPeopleVaccinatedThirdInjectionByPublishDate,
            colors.getVaccinationColor(3),
          ),
          timeseriesWidget(
            "vacc3d",
            "Daily",
            "newPeopleVaccinatedThirdInjectionByPublishDate",
            dashboard.MODE_DAILY,
            newPeopleVaccinatedThirdInjectionByPublishDate,
            colors.getVaccinationColor(3),
          ),
        ],
      };

      // this will interpret the dashboard specifiation
      dashboard.createDashboard(div, config);
    }, 5000);
  }
}
