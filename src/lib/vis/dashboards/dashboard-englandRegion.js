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
export class DashboardEnglandRegion {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 400;

  constructor(options) {
    // creates the main div. don't touch
    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container");





    // 2. specify data URLs here...
    var cumCasesBySpecimenDate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=cumCasesBySpecimenDate&format=csv"
    var femaleCases = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=femaleCases&format=csv"
    var maleCases = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=maleCases&format=csv"
    var newCasesBySpecimenDate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=newCasesBySpecimenDate&format=csv"
    var newCasesBySpecimenDateAgeDemographics = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=newCasesBySpecimenDateAgeDemographics&format=csv"

    var uniqueCasePositivityBySpecimenDateRollingSum = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=uniqueCasePositivityBySpecimenDateRollingSum&format=csv"

    var cumDailyNsoDeathsByDeathDate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=cumDailyNsoDeathsByDeathDate&format=csv"
    var femaleDeaths28Days = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=femaleDeaths28Days&format=csv"
    var maleDeaths28Days = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=maleDeaths28Days&format=csv"
    var newDailyNsoDeathsByDeathDate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=newDailyNsoDeathsByDeathDate&format=csv"

    var cumVaccinationFirstDoseUptakeByVaccinationDatePercentage = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=cumVaccinationFirstDoseUptakeByVaccinationDatePercentage&format=csv"
    var cumVaccinationSecondDoseUptakeByVaccinationDatePercentage = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=cumVaccinationSecondDoseUptakeByVaccinationDatePercentage&format=csv"
    var vaccinationsAgeDemographics = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=vaccinationsAgeDemographics&format=csv"



    d3.csv(cumCasesBySpecimenDate).then(function (data) {
      cumCasesBySpecimenDate = data;
    });
    d3.csv(cumDailyNsoDeathsByDeathDate).then(function (data) {
      cumDailyNsoDeathsByDeathDate = data;
    });
    d3.csv(cumVaccinationFirstDoseUptakeByVaccinationDatePercentage).then(function (data) {
      cumVaccinationFirstDoseUptakeByVaccinationDatePercentage = data;
    });
    d3.csv(cumVaccinationSecondDoseUptakeByVaccinationDatePercentage).then(function (data) {
      cumVaccinationSecondDoseUptakeByVaccinationDatePercentage = data;
    });
    d3.csv(femaleCases).then(function (data) {
      femaleCases = data;
    });
    d3.csv(maleCases).then(function (data) {
      maleCases = data;
    });
    d3.csv(newCasesBySpecimenDate).then(function (data) {
      newCasesBySpecimenDate = data;
    });
    d3.csv(newCasesBySpecimenDateAgeDemographics).then(function (data) {
      newCasesBySpecimenDateAgeDemographics = data;
    });
    d3.csv(femaleDeaths28Days).then(function (data) {
      femaleDeaths28Days = data;
    });
    d3.csv(maleDeaths28Days).then(function (data) {
      maleDeaths28Days = data;
    });
    d3.csv(newDailyNsoDeathsByDeathDate).then(function (data) {
      newDailyNsoDeathsByDeathDate = data;
    });
    d3.csv(vaccinationsAgeDemographics).then(function (data) {
      vaccinationsAgeDemographics = data;
    });
    d3.csv(uniqueCasePositivityBySpecimenDateRollingSum).then(function (data) {
      uniqueCasePositivityBySpecimenDateRollingSum = data;
    });
    
    console.log(':: options', options)

    // 3. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki
    setTimeout(function () {
      var config = {
        links: options.childrenLinks,
        layout: [['cases',['vaccinations','deaths']]],
        groups: [
          {
            id: 'cases', 
            title: 'Cases', 
            layout: ['newCasesBySpecimenDate', ['cumCasesBySpecimenDate','uniqueCasePositivityBySpecimenDateRollingSum']]
          },
          {
            id: 'vaccinations', 
            title: 'Vaccinations', 
            layout: [['cumVaccinationFirstDoseUptakeByVaccinationDatePercentage', 'cumVaccinationSecondDoseUptakeByVaccinationDatePercentage',['vaccinationsAgeDemographics1', 'vaccinationsAgeDemographics2']]]
          },
          {
            id: 'deaths', 
            title: 'Deaths', 
            layout: [['cumDailyNsoDeathsByDeathDate', 'newDailyNsoDeathsByDeathDate',['femaleDeaths28Days', 'maleDeaths28Days']]]
          }

        ],
        widgets: [
          {
            id: 'cumCasesBySpecimenDate', 
            title: 'Total cases over time', 
            data: cumCasesBySpecimenDate, 
            dataField: 'cumCasesBySpecimenDate', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_MEDIUM, 
            cumulative: true,
            dateField: 'date', 
            abbreviate: true,
            color: colors.getCaseColor(1), 
            min: 0
          },
          {
            id: 'uniqueCasePositivityBySpecimenDateRollingSum', 
            title: 'Unique cases at every given moment', 
            data: uniqueCasePositivityBySpecimenDateRollingSum, 
            dataField: 'uniqueCasePositivityBySpecimenDateRollingSum', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_MEDIUM, 
            cumulative: true,
            dateField: 'date', 
            abbreviate: true,
            color: colors.getCaseColor(2), 
            min: 0
          },{
            id: 'newCasesBySpecimenDate', 
            title: 'Change in Cases', 
            data: newCasesBySpecimenDate, 
            dataField: 'newCasesBySpecimenDate', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_HIGH, 
            cumulative: false,
            dateField: 'date', 
            color: colors.getCaseColor(3), 
            min: 0
          },
          {
            id: 'cumDailyNsoDeathsByDeathDate', 
            title: 'Total deaths over time', 
            data: cumDailyNsoDeathsByDeathDate, 
            dataField: 'cumDailyNsoDeathsByDeathDate', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_MEDIUM, 
            cumulative: true,
            dateField: 'date', 
            abbreviate: true,
            color: colors.getDeathColor(), 
            min: 0
          },{
            id: 'newDailyNsoDeathsByDeathDate', 
            title: 'Change in deaths', 
            data: newDailyNsoDeathsByDeathDate, 
            dataField: 'newDailyNsoDeathsByDeathDate', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_HIGH, 
            cumulative: false,
            dateField: 'date', 
            color: colors.getDeathColor(2), 
            min: 0
          },{
            id: 'femaleDeaths28Days', 
            title: 'Female deaths within last 28 days', 
            data: femaleDeaths28Days, 
            dataField: 'rate', 
            visualization: 'barchart', 
            detail: dashboard.DETAIL_HIGH, 
            cumulative: false,
            timeUnit: dashboard.TIMEUNIT_MONTH,
            dateField: 'date', 
            categories: 'age',
            color: colors.getDeathColor(3), 
            min: 0
          },{
            id: 'maleDeaths28Days', 
            title: 'Male deaths within last 28 days', 
            data: maleDeaths28Days, 
            dataField: 'rate', 
            visualization: 'barchart', 
            detail: dashboard.DETAIL_HIGH, 
            cumulative: false,
            timeUnit: dashboard.TIMEUNIT_MONTH,
            dateField: 'date', 
            categories: 'age',
            color: colors.getDeathColor(3), 
            min: 0
          },{
            id: 'vaccinationsAgeDemographics1', 
            title: '1st dose uptake by age groups', 
            data: vaccinationsAgeDemographics, 
            dataField: 'cumVaccinationFirstDoseUptakeByVaccinationDatePercentage', 
            visualization: 'barchart', 
            detail: dashboard.DETAIL_HIGH, 
            unit: '%',
            dateField: 'date', 
            categories: 'age',
            color: colors.getVaccinationColor(1), 
            min: 0, max: 100
          },{
            id: 'vaccinationsAgeDemographics2', 
            title: '2nd dose uptake by age groups', 
            data: vaccinationsAgeDemographics, 
            dataField: 'cumVaccinationSecondDoseUptakeByVaccinationDatePercentage', 
            visualization: 'barchart', 
            detail: dashboard.DETAIL_HIGH, 
            unit: '%',
            dateField: 'date', 
            categories: 'age',
            color: colors.getVaccinationColor(2), 
            min: 0, max: 100
          },
          {
            id: 'cumVaccinationFirstDoseUptakeByVaccinationDatePercentage', 
            title: 'Total 1st dose uptake', 
            data: cumVaccinationFirstDoseUptakeByVaccinationDatePercentage, 
            dataField: 'cumVaccinationFirstDoseUptakeByVaccinationDatePercentage', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_MEDIUM, 
            unit: '%',
            dateField: 'date', 
            color: colors.getVaccinationColor(), 
            min: 0, max: 100
          },{
            id: 'cumVaccinationSecondDoseUptakeByVaccinationDatePercentage', 
            title: 'Total 1st dose uptake', 
            data: cumVaccinationSecondDoseUptakeByVaccinationDatePercentage, 
            dataField: 'cumVaccinationSecondDoseUptakeByVaccinationDatePercentage', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_MEDIUM, 
            unit: '%',
            dateField: 'date', 
            color: colors.getVaccinationColor(2), 
            min: 0, max: 100
          }
        ],
      };

      // this will interpret the dashboard specifiation
      dashboard.createDashboard(div, config);
    }, 3000);
  }
}
