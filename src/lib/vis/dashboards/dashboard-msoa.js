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
export class DashboardMSOA {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 400;

  constructor(options) {
    // Phong
    console.log('data including all 5 metrics')
    console.log(Data.from(options.data, Data.Fields.PHE_MSOA_ALL));

    // creates the main div. don't touch
    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container");

    console.log('PHE_NATION_ADMISSIONS', Data.from(options.data, Data.Fields.PHE_MSOA_ALL));      
      
      
    // 2. specify data URLs here...
    var newCasesBySpecimenDateRollingSum = "https://api.coronavirus.data.gov.uk/v2/data?areaType=msoa&areaCode=E02000961&metric=newCasesBySpecimenDateRollingSum&format=csv"
    var newCasesBySpecimenDateRollingRate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=msoa&areaCode=E02000961&metric=newCasesBySpecimenDateRollingRate&format=csv"
    var newCasesBySpecimenDateChangePercentage = "https://api.coronavirus.data.gov.uk/v2/data?areaType=msoa&areaCode=E02000961&metric=newCasesBySpecimenDateChangePercentage&format=csv"
    var cumVaccinationFirstDoseUptakeByVaccinationDatePercentage = "https://api.coronavirus.data.gov.uk/v2/data?areaType=msoa&areaCode=E02000961&metric=cumVaccinationFirstDoseUptakeByVaccinationDatePercentage&format=csv"
    var cumVaccinationSecondDoseUptakeByVaccinationDatePercentage = "https://api.coronavirus.data.gov.uk/v2/data?areaType=msoa&areaCode=E02000961&metric=cumVaccinationSecondDoseUptakeByVaccinationDatePercentage&format=csv"
    
    d3.csv(newCasesBySpecimenDateRollingSum).then(function (data) {
      newCasesBySpecimenDateRollingSum = data;
    });
    d3.csv(newCasesBySpecimenDateRollingRate).then(function (data) {
      newCasesBySpecimenDateRollingRate = data;
    });
    d3.csv(newCasesBySpecimenDateChangePercentage).then(function (data) {
      newCasesBySpecimenDateChangePercentage = data;
    });
    d3.csv(cumVaccinationFirstDoseUptakeByVaccinationDatePercentage).then(function (data) {
      cumVaccinationFirstDoseUptakeByVaccinationDatePercentage = data;
    });
    d3.csv(cumVaccinationSecondDoseUptakeByVaccinationDatePercentage).then(function (data) {
      cumVaccinationSecondDoseUptakeByVaccinationDatePercentage = data;
    });


    // 3. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki
    setTimeout(function () {
      var config = {
        layout: ['cases','vaccinations'],
        groups: [
          {
            id: 'cases', 
            title: 'Cases', 
            layout: [['newCasesBySpecimenDateRollingSum','newCasesBySpecimenDateRate','newCasesBySpecimenDateChangePercentage']]
          },
          {
            id: 'vaccinations', 
            title: 'Vaccinations', 
            layout: [['cumVaccinationFirstDoseUptakeByVaccinationDatePercentage', 'cumVaccinationSecondDoseUptakeByVaccinationDatePercentage']]
          }

        ],
        widgets: [
          {
            id: 'newCasesBySpecimenDateRollingSum', 
            title: 'Total cases over time', 
            data: newCasesBySpecimenDateRollingSum, 
            dataField: 'newCasesBySpecimenDateRollingSum', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_HIGH, 
            cumulative: true,
            dateField: 'date', 
            color: colors.getCaseColor(), 
            min: 0
          },{
            id: 'newCasesBySpecimenDateRate', 
            title: 'Change in Cases', 
            data: newCasesBySpecimenDateRollingRate, 
            dataField: 'newCasesBySpecimenDateRollingRate', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_HIGH, 
            cumulative: false,
            dateField: 'date', 
            color: colors.getCaseColor(), 
            min: 0
          }
          ,{
            id: 'newCasesBySpecimenDateChangePercentage', 
            title: 'Change in Cases', 
            data: newCasesBySpecimenDateChangePercentage, 
            dataField: 'newCasesBySpecimenDateChangePercentage', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_HIGH, 
            cumulative: false,
            dateField: 'date', 
            color: colors.getCaseColor(), 
            min: 0
          },{
            id: 'cumVaccinationFirstDoseUptakeByVaccinationDatePercentage', 
            title: 'Change in Cases', 
            data: cumVaccinationFirstDoseUptakeByVaccinationDatePercentage, 
            dataField: 'cumVaccinationFirstDoseUptakeByVaccinationDatePercentage', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_MEDIUM, 
            cumulative: true,
            unit: '%',
            dateField: 'date', 
            color: colors.getCaseColor(), 
            min: 0
          },{
            id: 'cumVaccinationSecondDoseUptakeByVaccinationDatePercentage', 
            title: 'Change in Cases', 
            data: cumVaccinationSecondDoseUptakeByVaccinationDatePercentage, 
            dataField: 'cumVaccinationSecondDoseUptakeByVaccinationDatePercentage', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_HIGH, 
            cumulative: true, 
            unit: '%,',
            dateField: 'date', 
            color: colors.getCaseColor(), 
            min: 0
          }
        ],
      };

      // this will interpret the dashboard specifiation
      dashboard.createDashboard(div, config);
    }, 3000);
  }
}
