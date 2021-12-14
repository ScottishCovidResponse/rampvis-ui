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
export class CountryOverview {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 400;

  constructor(options) {
    // creates the main div. don't touch
    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container");

    // 2. specify data URLs here...
    var cumAdmissions = 'https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumAdmissions&format=csv'
    var cumCasesBySpecimentDate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumCasesBySpecimenDate&format=csv"
    var cumDeaths28DaysByDeathDateRate ="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumDeaths28DaysByDeathDateRate&format=csv"
    var cumOnsDeathsByRegistrationDate="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumOnsDeathsByRegistrationDate&format=csv"
    var cumOnsDeathsByRegistrationDateRate="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumOnsDeathsByRegistrationDateRate&format=csv"
    var cumVaccinationFirstDoseUptakeByPublishDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationFirstDoseUptakeByPublishDatePercentage&format=csv"
    var cumVaccinationSecondDoseUptakeByPublishDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationSecondDoseUptakeByPublishDatePercentage&format=csv"
    var cumVaccinationThirdDoseUptakeByPublishDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationThirdDoseUptakeByPublishDatePercentage&format=csv"
    var cumVaccinationFirstDoseUptakeByVaccinationDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationFirstDoseUptakeByVaccinationDatePercentage&format=csv"
    var cumVaccinationSecondDoseUptakeByVaccinationDatePercentage ="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationSecondDoseUptakeByVaccinationDatePercentage&format=csv"
    var cumVaccinationThirdDoseUptakeByVaccinationDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationThirdDoseUptakeByVaccinationDatePercentage&format=csv"
    var hospitalCases="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=hospitalCases&format=csv"
    var transmissionRateMax="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=transmissionRateMax&format=csv"
    var transmissionRateMin="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=transmissionRateMin&format=csv"

    var newAdmissions = 'https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumAdmissions&format=csv'
    var newCasesBySpecimentDate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumCasesBySpecimenDate&format=csv"
    var newDeaths28DaysByDeathDateRate ="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumDeaths28DaysByDeathDateRate&format=csv"
    var newOnsDeathsByRegistrationDate="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumOnsDeathsByRegistrationDate&format=csv"
    var newOnsDeathsByRegistrationDateRate="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumOnsDeathsByRegistrationDateRate&format=csv"
    var newVaccinationFirstDoseUptakeByPublishDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationFirstDoseUptakeByPublishDatePercentage&format=csv"
    var newVaccinationSecondDoseUptakeByPublishDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationSecondDoseUptakeByPublishDatePercentage&format=csv"
    var newVaccinationThirdDoseUptakeByPublishDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationThirdDoseUptakeByPublishDatePercentage&format=csv"
    var newVaccinationFirstDoseUptakeByVaccinationDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationFirstDoseUptakeByVaccinationDatePercentage&format=csv"
    var newVaccinationSecondDoseUptakeByVaccinationDatePercentage ="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationSecondDoseUptakeByVaccinationDatePercentage&format=csv"
    var newVaccinationThirdDoseUptakeByVaccinationDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationThirdDoseUptakeByVaccinationDatePercentage&format=csv"




    https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=vaccinationsAgeDemographics&format=csv
    // 3. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki
    setTimeout(function () {
      var config = {
        layout: [],
        groups: [],
        widgets: [],
      };

      // this will interpret the dashboard specifiation
      dashboard.createDashboard(div, config);
    }, 3000);
  }
}
