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
export class DashboardLowerTierLocalAuthority {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 400;

  constructor(options) {
    // creates the main div. don't touch
    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container");

    // 2. specify data URLs here...

    var cases =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=ltla&areaCode=S12000036&metric=cumCasesBySpecimenDate&metric=newCasesBySpecimenDate&format=csv";
    var deaths =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=ltla&areaCode=S12000036&metric=cumWeeklyNsoDeathsByRegDate&metric=newWeeklyNsoDeathsByRegDate&format=csv";
    var vaccination =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=ltla&areaCode=S12000036&metric=cumVaccinationFirstDoseUptakeByVaccinationDatePercentage&metric=cumVaccinationSecondDoseUptakeByVaccinationDatePercentage&format=csv";
    var vaccinationAgeDemographics =
      "https://api.coronavirus.data.gov.uk/v2/data?areaType=ltla&areaCode=S12000036&metric=vaccinationsAgeDemographics&format=csv";
    // for any age range:
    // VaccineRegisterPopulationByVaccinationDate
    // cumPeopleVaccinatedCompleteByVaccinationDate
    // newPeopleVaccinatedCompleteByVaccinationDate
    // cumPeopleVaccinatedFirstDoseByVaccinationDate
    // newPeopleVaccinatedFirstDoseByVaccinationDate
    // cumPeopleVaccinatedSecondDoseByVaccinationDate
    // newPeopleVaccinatedSecondDoseByVaccinationDate
    // cumVaccinationFirstDoseUptakeByVaccinationDatePercentage
    // cumVaccinationCompleteCoverageByVaccinationDatePercentage
    // cumVaccinationSecondDoseUptakeByVaccinationDatePercentage

    d3.csv(cases).then(function (data) {
      cases = data;
    });
    d3.csv(deaths).then(function (data) {
      deaths = data;
    });
    d3.csv(vaccination).then(function (data) {
      vaccination = data;
    });
    d3.csv(vaccinationAgeDemographics).then(function (data) {
      vaccinationAgeDemographics = data;
    });

    setTimeout(function () {
      console.log("vaccination", vaccination);
      // 3. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki
      var config = {
        layout: [["cases", "deaths", "vacc"]],
        groups: [
          {
            id: "cases",
            title: "Cases",
            layout: ["cumCases", "newCases"],
          },
          {
            id: "deaths",
            title: "Deaths",
            layout: ["cumDeaths", "newDeaths"],
          },
          {
            id: "vacc",
            title: "Vaccination",
            layout: [["vacc1", "vacc1Ages"]],
          },
        ],
        widgets: [
          {
            id: "cumCases",
            title: "Cumulative Cases",
            color: colors.getCaseColor(),
            data: cases,
            dataField: "cumCasesBySpecimenDate",
            details: dashboard.DETAIL_HIGH,
            mode: dashboard.MODE_CUMULATIVE,
            dateVariable: "date",
            visualization: "linechart",
          },
          {
            id: "newCases",
            title: "New Cases",
            color: colors.getCaseColor(),
            data: cases,
            dataField: "newCasesBySpecimenDate",
            details: dashboard.DETAIL_HIGH,
            mode: dashboard.MODE_DAILY,
            dateVariable: "date",
            visualization: "linechart",
          },
          {
            id: "cumDeaths",
            title: "Cumulative Deaths",
            color: colors.getDeathColor(),
            data: deaths,
            dataField: "cumWeeklyNsoDeathsByRegDate",
            details: dashboard.DETAIL_HIGH,
            mode: dashboard.MODE_CUMULATIVE,
            dateVariable: "date",
            visualization: "linechart",
          },
          {
            id: "newDeaths",
            title: "New Weekly Deaths",
            color: colors.getDeathColor(),
            data: deaths,
            dataField: "newWeeklyNsoDeathsByRegDate",
            details: dashboard.DETAIL_HIGH,
            mode: dashboard.MODE_DAILY,
            dateVariable: "date",
            visualization: "linechart",
          },
          {
            id: "vacc1",
            title: "1st Dose Percentage",
            color: colors.getVaccinationColor(1),
            data: vaccination,
            dataField:
              "cumVaccinationFirstDoseUptakeByVaccinationDatePercentage",
            details: dashboard.DETAIL_HIGH,
            mode: dashboard.MODE_PERCENT,
            dateVariable: "date",
            visualization: "linechart",
          },
          {
            id: "vacc2",
            title: "2nd Dose Percentage",
            color: colors.getVaccinationColor(2),
            data: vaccination,
            dataField:
              "cumVaccinationSecondDoseUptakeByVaccinationDatePercentage",
            details: dashboard.DETAIL_HIGH,
            mode: dashboard.MODE_PERCENT,
            dateVariable: "date",
            visualization: "linechart",
          },
          {
            id: "vacc1Ages",
            title: "1st Dose by Age Group",
            color: colors.getVaccinationColor(1),
            data: vaccinationAgeDemographics,
            dataField:
              "cumVaccinationFirstDoseUptakeByVaccinationDatePercentage",
            detail: dashboard.DETAIL_HIGH,
            mode: dashboard.MODE_PERCENT,
            dateVariable: "date",
            visualization: "barchart",
            bars: "age",
          },
        ],
      };

      // this will interpret the dashboard specifiation
      dashboard.createDashboard(div, config);
    }, 3000);
  }
}
