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
export class DashboardNation {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 400;
  
  constructor(options) {
    
    var MAX_DAILY_VACC = 700000;
    
    // creates the main div. don't touch
    var div = d3
    .select("#" + options.chartElement)
    .append("div")
    .attr("class", "vis-example-container");

    // 2. specify data URLs here...
  
    var cumAdmissions = 'https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumAdmissions&format=csv'
    var cumCasesBySpecimenDate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumCasesBySpecimenDate&format=csv"
    // var cumDeaths28DaysByDeathDateRate ="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumDeaths28DaysByDeathDateRate&format=csv"
    var cumOnsDeathsByRegistrationDate="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumOnsDeathsByRegistrationDate&format=csv"
    // var cumOnsDeathsByRegistrationDateRate="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumOnsDeathsByRegistrationDateRate&format=csv"
    // var cumVaccinationFirstDoseUptakeByPublishDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationFirstDoseUptakeByPublishDatePercentage&format=csv"
    // var cumVaccinationSecondDoseUptakeByPublishDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationSecondDoseUptakeByPublishDatePercentage&format=csv"
    // var cumVaccinationThirdDoseUptakeByPublishDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationThirdDoseUptakeByPublishDatePercentage&format=csv"
    var cumVaccinationFirstDoseUptakeByVaccinationDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationFirstDoseUptakeByVaccinationDatePercentage&format=csv"
    var cumVaccinationSecondDoseUptakeByVaccinationDatePercentage ="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationSecondDoseUptakeByVaccinationDatePercentage&format=csv"
    var cumVaccinationThirdInjectionUptakeByPublishDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationThirdInjectionUptakeByPublishDatePercentage&format=csv"
    var hospitalCases="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=hospitalCases&format=csv"
    var transmissionRateMax="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=transmissionRateMax&format=csv"
    var transmissionRateMin="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=transmissionRateMin&format=csv"

    var newAdmissions = 'https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=newAdmissions&format=csv'
    var newCasesBySpecimenDate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=newCasesBySpecimenDate&format=csv"
    // var newDeaths28DaysByDeathDateRate ="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumDeaths28DaysByDeathDateRate&format=csv"
    var newOnsDeathsByRegistrationDate="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=newOnsDeathsByRegistrationDate&format=csv"
    // var newOnsDeathsByRegistrationDateRate="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumOnsDeathsByRegistrationDateRate&format=csv"
    // var newVaccinationFirstDoseUptakeByPublishDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationFirstDoseUptakeByPublishDatePercentage&format=csv"
    // var newVaccinationSecondDoseUptakeByPublishDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationSecondDoseUptakeByPublishDatePercentage&format=csv"
    // var newVaccinationThirdDoseUptakeByPublishDatePercentage="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumVaccinationThirdDoseUptakeByPublishDatePercentage&format=csv"
    var newPeopleVaccinatedFirstDoseByVaccinationDate="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=newPeopleVaccinatedFirstDoseByVaccinationDate&format=csv"
    var newPeopleVaccinatedSecondDoseByVaccinationDate ="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=newPeopleVaccinatedSecondDoseByVaccinationDate&format=csv"
    var newPeopleVaccinatedThirdInjectionByVaccinationDate="https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=newPeopleVaccinatedThirdInjectionByVaccinationDate&format=csv"

    d3.csv(cumAdmissions).then(function (data) {
      cumAdmissions = data;
    });
    d3.csv(cumCasesBySpecimenDate).then(function (data) {
      cumCasesBySpecimenDate = data;
      console.log('>>', cumCasesBySpecimenDate)
    });
    d3.csv(cumOnsDeathsByRegistrationDate).then(function (data) {
      cumOnsDeathsByRegistrationDate = data;
    });
    d3.csv(cumVaccinationFirstDoseUptakeByVaccinationDatePercentage).then(function (data) {
      cumVaccinationFirstDoseUptakeByVaccinationDatePercentage = data;
    });
    d3.csv(cumVaccinationSecondDoseUptakeByVaccinationDatePercentage).then(function (data) {
      cumVaccinationSecondDoseUptakeByVaccinationDatePercentage = data;
    });
    d3.csv(cumVaccinationThirdInjectionUptakeByPublishDatePercentage).then(function (data) {
      cumVaccinationThirdInjectionUptakeByPublishDatePercentage = data;
    });
   
    d3.csv(newAdmissions).then(function (data) {
      newAdmissions = data;
    });
    d3.csv(newCasesBySpecimenDate).then(function (data) {
      newCasesBySpecimenDate = data;
    });
    d3.csv(newOnsDeathsByRegistrationDate).then(function (data) {
      newOnsDeathsByRegistrationDate = data;
    });
    d3.csv(newPeopleVaccinatedFirstDoseByVaccinationDate).then(function (data) {
      newPeopleVaccinatedFirstDoseByVaccinationDate = data;
    });
    d3.csv(newPeopleVaccinatedSecondDoseByVaccinationDate).then(function (data) {
      newPeopleVaccinatedSecondDoseByVaccinationDate = data;
    });
    d3.csv(newPeopleVaccinatedThirdInjectionByVaccinationDate).then(function (data) {
      newPeopleVaccinatedThirdInjectionByVaccinationDate = data;
    });

    
   

    https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=vaccinationsAgeDemographics&format=csv
    // 3. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki
    setTimeout(function () {
      var config = {
        links: [
          {
            name: "UK", 
            url: "http://localhost:3000/page?id=61b5e06d224b6283197d3a82"
          },{
            name: "Ayrshire and Arran", 
            url: "http://localhost:3000/page?id=60aea734592fa23aea1c8c2d"
          },
          {
            name: "Orkney", 
            url: "http://localhost:3000/page?id=60aea7208839aa3ae916e22f"
          },
          {
            name: "Tayside", 
            url: "http://localhost:3000/page?id=60aea629da3d623ac9941f39"
          }
        ],
        layout: [
          [
          "cases", 
          "admissions", 
          "deaths"], 
          "vacc"
        ],
        groups: [
          {
            id: "admissions",
            title: "Admissions",
            layout: [
              "cumAdmissions", 
              "newAdmissions"
            ],
            color: colors.getHospitalizedColor()
          },
          {
            id: "cases",
            title: "Cases",
            layout: [
              "cumCasesBySpecimenDate", 
              "newCasesBySpecimenDate"
            ],
            color: colors.getCaseColor()
          },
          {
            id: "deaths",
            title: "Deaths",
            layout: [
              "cumOnsDeathsByRegistrationDate",
              "newOnsDeathsByRegistrationDate",
            ],
            color: colors.getDeathColor()
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
          color: colors.getVaccinationColor()
          },
        ],
        widgets: [
          // ADMISSIONS
          {
            id:"cumAdmissions",
            title: "Cumulative Admissions",
            dataField: "cumAdmissions",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: cumAdmissions,
            color: colors.getHospitalizedColor(),
            detail: dashboard.DETAIL_LOW,
            visualization: 'linechart',
            layout: 'vertical',
            dateField: "date",
            abbreviate: true, 
            trendWindow: 'all'
          },
          {
            id:"newAdmissions",
            title: "Daily Admissions",
            dataField: "newAdmissions",
            cumulative: false,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: newAdmissions,
            color: colors.getHospitalizedColor(),
            detail: dashboard.DETAIL_HIGH,
            visualization: 'linechart',
            dateField: "date",
            abbreviate: true
          },
          
          // CASES
          {
            id:"cumCasesBySpecimenDate",
            title: "Cumulative Cases",
            dataField: "cumCasesBySpecimenDate",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: cumCasesBySpecimenDate,
            color: colors.getCaseColor(),
            detail: dashboard.DETAIL_LOW,
            visualization: 'linechart',
            layout: 'vertical',
            dateField: "date",
            abbreviate: true,
            trendWindow: 'all'

          },
          {
            id:"newCasesBySpecimenDate",
            title: "Daily Cases",
            dataField: "newCasesBySpecimenDate",
            cumulative: false,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: newCasesBySpecimenDate,
            color: colors.getCaseColor(),
            detail: dashboard.DETAIL_HIGH,
            visualization: 'linechart',
            dateField: "date",
            abbreviate: true
          },

          // DEATHS
          {
            id:"cumOnsDeathsByRegistrationDate",
            title: "Cumulative Deaths",
            dataField: "cumOnsDeathsByRegistrationDate",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: cumOnsDeathsByRegistrationDate,
            color: colors.getDeathColor(),
            detail: dashboard.DETAIL_LOW,
            visualization: 'linechart',
            layout: 'vertical',
            dateField: "date",
            abbreviate: true,
            trendWindow: 'all'

          },
          {
            id:"newOnsDeathsByRegistrationDate",
            title: "Daily Deaths",
            dataField: "newOnsDeathsByRegistrationDate",
            cumulative: false,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: newOnsDeathsByRegistrationDate,
            color: colors.getDeathColor(),
            detail: dashboard.DETAIL_HIGH,
            visualization: 'linechart',
            dateField: "date",
            abbreviate: true
          },

          // VACCINATIONS
          {
            id: "vacc1",
            visualization: "progress",
            title: "Total 1st Dose Update",
            dataField: "cumVaccinationFirstDoseUptakeByVaccinationDatePercentage",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: cumVaccinationFirstDoseUptakeByVaccinationDatePercentage,
            color: colors.getVaccinationColor(1),
            detail: dashboard.DETAIL_LOW,
            dateField: "date",
            abbreviate: true,
            unit: '%',
            min: 0,
            max: 100
          },
          {
            id: "vacc1d",
            visualization: "linechart",
            title: "Daily 1st Dose Vaccinations",
            dataField: "newPeopleVaccinatedFirstDoseByVaccinationDate",
            cumulative: false,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data:newPeopleVaccinatedFirstDoseByVaccinationDate,
            color: colors.getVaccinationColor(1),
            detail: dashboard.DETAIL_MEDIUM,
            dateField: "date",
            abbreviate: true,
            unit: '%',
            min: 0,
            max: MAX_DAILY_VACC

          },
          {
            id: "vacc2",
            title: "Total 2nd Dose Update",
            visualization: "progress",
            dataField: "cumVaccinationSecondDoseUptakeByVaccinationDatePercentage",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: cumVaccinationSecondDoseUptakeByVaccinationDatePercentage,
            color: colors.getVaccinationColor(2),
            detail: dashboard.DETAIL_LOW,
            dateField: "date",
            abbreviate: true,
            unit: '%',
            min: 0,
            max: 100
          },
          {
            id: "vacc2d",
            title: "2nd Dose Daily",
            visualization: "linechart",
            dataField: "newPeopleVaccinatedSecondDoseByVaccinationDate",
            cumulative: false,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: newPeopleVaccinatedSecondDoseByVaccinationDate,
            color: colors.getVaccinationColor(2),
            detail: dashboard.DETAIL_MEDIUM,
            dateField: "date",
            abbreviate: true,
            unit: '%',
            min: 0,
            max: MAX_DAILY_VACC

          },
          {
            id: "vacc3",
            visualization: "progress",
            title: "Total 3rd Dose Uptake",
            dataField: "cumVaccinationThirdInjectionUptakeByPublishDatePercentage",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: cumVaccinationThirdInjectionUptakeByPublishDatePercentage,
            color: colors.getVaccinationColor(3),
            detail: dashboard.DETAIL_LOW,
            dateField: "date",
            abbreviate: true,
            unit: '%',
            min: 0,
            max: 100
          },
          {
            id: "vacc3d",
            visualization: "linechart",
            title: "3rd Dose Daily",
            dataField: "newPeopleVaccinatedThirdInjectionByVaccinationDate",
            cumulative: false,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: newPeopleVaccinatedThirdInjectionByVaccinationDate,
            color: colors.getVaccinationColor(3),
            detail: dashboard.DETAIL_MEDIUM,
            dateField: "date",
            abbreviate: true,
            unit: '%',
            min: 0,
            max: MAX_DAILY_VACC
          }
        ]
      };
      // this will interpret the dashboard specifiation
      dashboard.createDashboard(div, config);
    }, 3000);
  }
}
