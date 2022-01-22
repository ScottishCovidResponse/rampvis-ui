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

    // Phong
    console.log('***live data')
    // var cumCasesBySpecimenDate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=cumCasesBySpecimenDate&format=csv"
    // var cumVaccinationFirstDoseUptakeByVaccinationDatePercentage = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=cumVaccinationFirstDoseUptakeByVaccinationDatePercentage&format=csv"
    // var cumVaccinationSecondDoseUptakeByVaccinationDatePercentage = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=cumVaccinationSecondDoseUptakeByVaccinationDatePercentage&format=csv"
    // var newCasesBySpecimenDate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=newCasesBySpecimenDate&format=csv"
    // var uniqueCasePositivityBySpecimenDateRollingSum = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=uniqueCasePositivityBySpecimenDateRollingSum&format=csv"
    console.log('PHE_REGION_CASES_VACCINE', Data.from(options.data, Data.Fields.PHE_REGION_CASES_VACCINE));

    // var femaleCases = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=femaleCases&format=csv"
    console.log('PHE_REGION_FEMALE_CASES', Data.from(options.data, Data.Fields.PHE_REGION_FEMALE_CASES));

    // var maleCases = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=maleCases&format=csv"
    console.log('PHE_REGION_MALE_CASES', Data.from(options.data, Data.Fields.PHE_REGION_MALE_CASES));
    
    // var newCasesBySpecimenDateAgeDemographics = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=newCasesBySpecimenDateAgeDemographics&format=csv"
    console.log('PHE_REGION_CASES_AGE', Data.from(options.data, Data.Fields.PHE_REGION_CASES_AGE));
    
    // var cumDailyNsoDeathsByDeathDate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=cumDailyNsoDeathsByDeathDate&format=csv"
    // var newDailyNsoDeathsByDeathDate = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=newDailyNsoDeathsByDeathDate&format=csv"
    console.log('PHE_REGION_DEATHS', Data.from(options.data, Data.Fields.PHE_REGION_DEATHS));
    
    // var femaleDeaths28Days = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=femaleDeaths28Days&format=csv"
    console.log('PHE_REGION_FEMALE_DEATHS', Data.from(options.data, Data.Fields.PHE_REGION_FEMALE_DEATHS));
    
    // var maleDeaths28Days = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=maleDeaths28Days&format=csv"
    console.log('PHE_REGION_MALE_DEATHS', Data.from(options.data, Data.Fields.PHE_REGION_MALE_DEATHS));
    
  
    // var vaccinationsAgeDemographics = "https://api.coronavirus.data.gov.uk/v2/data?areaType=region&areaCode=E12000007&metric=vaccinationsAgeDemographics&format=csv"
    console.log('PHE_REGION_VACCINE_AGE', Data.from(options.data, Data.Fields.PHE_REGION_VACCINE_AGE));
    
    

    // 3. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki
      var config = {
        dataSources: [
          {
            url: "https://coronavirus.data.gov.uk/details/download",
            name: "Public Health England"
          }],
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
            data: Data.from(options.data, Data.Fields.PHE_REGION_CASES_VACCINE), 
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
            data: Data.from(options.data, Data.Fields.PHE_REGION_CASES_VACCINE), 
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
            data: Data.from(options.data, Data.Fields.PHE_REGION_CASES_VACCINE), 
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
            data: Data.from(options.data, Data.Fields.PHE_REGION_DEATHS),
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
            data: Data.from(options.data, Data.Fields.PHE_REGION_DEATHS), 
            dataField: 'newDailyNsoDeathsByDeathDate', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_HIGH, 
            cumulative: false,
            dateField: 'date', 
            color: colors.getDeathColor(2), 
            min: 0
          },
        //   {
        //     id: 'femaleDeaths28Days', 
        //     title: 'Female deaths within last 28 days', 
        //     data: femaleDeaths28Days, 
        //     dataField: 'rate', 
        //     visualization: 'barchart', 
        //     detail: dashboard.DETAIL_HIGH, 
        //     cumulative: false,
        //     timeUnit: dashboard.TIMEUNIT_MONTH,
        //     dateField: 'date', 
        //     categories: 'age',
        //     color: colors.getDeathColor(3), 
        //     min: 0
        //   },{
        //     id: 'maleDeaths28Days', 
        //     title: 'Male deaths within last 28 days', 
        //     data: maleDeaths28Days, 
        //     dataField: 'rate', 
        //     visualization: 'barchart', 
        //     detail: dashboard.DETAIL_HIGH, 
        //     cumulative: false,
        //     timeUnit: dashboard.TIMEUNIT_MONTH,
        //     dateField: 'date', 
        //     categories: 'age',
        //     color: colors.getDeathColor(3), 
        //     min: 0
        //   },
        {
            id: 'vaccinationsAgeDemographics1', 
            title: '1st dose uptake by age groups', 
            data: Data.from(options.data, Data.Fields.PHE_REGION_VACCINE_AGE), 
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
            data: Data.from(options.data, Data.Fields.PHE_REGION_VACCINE_AGE), 
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
            data: Data.from(options.data, Data.Fields.PHE_REGION_CASES_VACCINE),            
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
            data: Data.from(options.data, Data.Fields.PHE_REGION_CASES_VACCINE),             
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
  }
}
