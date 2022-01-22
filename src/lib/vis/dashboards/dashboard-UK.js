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
// http://localhost:3000/page?id=619d00017d01359c29937ed9

import * as d3 from "d3";
import { Data } from '../data'
import { dashboard } from "./dashboard";
import { colors } from "../colors";


export class DashboardUK {
  CHART_WIDTH = 1200;
  CHART_HEIGHT = 1000;
  
  constructor(options) {
    
    var UK_POPULATION = 67220000;
    var PEOPLE_PER_DAY = 500000
    var RATE_CASES_MAX = 30000;
    var RATE_DEATHS_MAX = 1000;
    var RATE_ADMISSIONS_MAX = 6000;

    var DETAIL_DAILY = dashboard.DETAIL_HIGH;
    var DETAIL_NATIONS = dashboard.DETAIL_HIGH; 

    var newCasesBySpecimenDate_all = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&metric=newCasesBySpecimenDate&format=csv"    
    var newAdmissionsRollingSum = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&metric=newAdmissionsRollingSum&format=csv"
    var newOnsDeathsByRegistrationDate_all= "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&metric=newOnsDeathsByRegistrationDate&format=csv"
    var newCasesBySpecimenDateChangePercentage_councils = "https://api.coronavirus.data.gov.uk/v2/data?areaType=ltla&metric=newCasesBySpecimenDateChangePercentage&format=csv"
    var newCasesBySpecimenDateChangePercentage_all = "https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&metric=newCasesBySpecimenDateChangePercentage&format=csv"

    d3.csv(newCasesBySpecimenDate_all).then(function (data) {
      newCasesBySpecimenDate_all = data;
    });
    d3.csv(newAdmissionsRollingSum).then(function (data) {
      newAdmissionsRollingSum = data;
    });
    d3.csv(newOnsDeathsByRegistrationDate_all).then(function (data) {
      newOnsDeathsByRegistrationDate_all = data;
    });
    d3.csv(newCasesBySpecimenDateChangePercentage_all).then(function (data) {
      newCasesBySpecimenDateChangePercentage_all = data;
    });

    d3.csv(newCasesBySpecimenDateChangePercentage_councils).then(function (data) {
      newCasesBySpecimenDateChangePercentage_councils = data;
    });


    
    // creates the main div. don't touch
    var div = d3
    .select("#" + options.chartElement)
    .append("div")
    .attr("class", "vis-example-container");

    // test all data are loaded, once every second
    var timeseriesWidget = function (
      id,
      title,
      dataField,
      cumulative,
      timeUnit,
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
        cumulative: cumulative,
        timeUnit: timeUnit,
        detail: detail,
        dateField: "date",
        abbreviate: true,
        min: 0
      };
      return w;
    };

    console.log('>> options', options)

    // create links array
    setTimeout(function () {
      // 2. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki
      var config = {
        dataSources: [
          {
            url: "https://coronavirus.data.gov.uk/details/download",
            name: "Public Health England"
          }],

        links: options.childrenLinks,
        layout: [
          [
          "cases", 
          "admissions", 
          "deaths"
          ], 
          [
            "vacc",
            // "ltla"
          ] 
        ],
        groups: [
          {
            id: "admissions",
            title: "Admissions",
            layout: [
              "cumAdmissions", 
              "newAdmissions",
              "admissionsNations"
              // [
              //   "newAdmissions_eng", 
              //   "newAdmissions_sco", 
              //   "newAdmissions_ni", 
              //   "newAdmissions_wales",              
              // ]
            ],
          },
          {
            id: "cases",
            title: "Cases",
            layout: [
              "cumCasesBySpecimenDate", 
              "newCasesBySpecimenDate",
              "casesNations",
              // "cases_ltlas"
              // [
              //   "newCasesBySpecimenDate_eng", 
              //   "newCasesBySpecimenDate_sco", 
              //   "newCasesBySpecimenDate_ni", 
              //   "newCasesBySpecimenDate_wales",                 
              // ]
            ],
          },
          {
            id: "deaths",
            title: "Deaths",
            layout: [
              "cumDeaths28DaysByDeathDate",
              "newDeaths28DaysByDeathDate",
              "deathsNations"
              // [
              //   "newOnsDeathsByRegistrationDate_eng", 
              //   "newOnsDeathsByRegistrationDate_sco", 
              //   "newOnsDeathsByRegistrationDate_ni", 
              //   "newOnsDeathsByRegistrationDate_wales",                 
              // ]
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
          {
            id: "ltla", 
            title: "Councils", 
            layout: [
              'cases_ltlas'
            ]
          }
        ],
        widgets: [

          // ADMISSIONS
          {
            id:"cumAdmissions",
            title: "Cumulative",
            dataField: "cumAdmissions",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: Data.from(options.data, Data.Fields.PHE_UK_CUM_ADMISSIONS),
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
            title: "New Daily Admissions",
            dataField: "newAdmissions",
            cumulative: false,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: Data.from(options.data, Data.Fields.PHE_UK_NEW_AMISSIONS),
            color: colors.getHospitalizedColor(),
            detail: dashboard.DETAIL_HIGH,
            visualization: 'linechart',
            dateField: "date",
            abbreviate: true,
          },
          {
            id:"admissionsNations",
            title: "New admissions today",
            dataField: "newAdmissionsRollingSum",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: newAdmissionsRollingSum,
            color: colors.getHospitalizedColor(),
            detail: DETAIL_NATIONS,
            visualization: 'barchart',
            dateField: "date",
            categories: "areaName",             
            filter: ['latest'], 
          },
          // {
          //   id:"newAdmissions_eng",
          //   title: "England (Last 7 days)",
          //   dataField: "newAdmissionsRollingSum",
          //   cumulative: true,
          //   timeUnit: dashboard.TIMEUNIT_DAY,
          //   data: newAdmissionsRollingSum,
          //   color: colors.getHospitalizedColor(),
          //   detail: dashboard.DETAIL_LOW,
          //   visualization: 'progress',
          //   dateField: "date",
          //   abbreviate: true,
          //   conditions:[
          //     "areaName == 'England'"
          //   ],
          //   max: RATE_ADMISSIONS_MAX            
          // },
          // {
          //   id:"newAdmissions_sco",
          //   title: "Scotland (Last 7 days)",
          //   dataField: "newAdmissionsRollingSum",
          //   cumulative: true,
          //   timeUnit: dashboard.TIMEUNIT_DAY,
          //   data: newAdmissionsRollingSum,
          //   color: colors.getHospitalizedColor(),
          //   detail: dashboard.DETAIL_LOW,
          //   visualization: 'progress',
          //   dateField: "date",
          //   abbreviate: true,
          //   conditions:[
          //     "areaName == 'Scotland'"
          //   ],
          //   max: RATE_ADMISSIONS_MAX            
          // },
          // {
          //   id:"newAdmissions_ni",
          //   title: "Ireland (Last 7 days)",
          //   dataField: "newAdmissionsRollingSum",
          //   cumulative: true,
          //   timeUnit: dashboard.TIMEUNIT_DAY,
          //   data: newAdmissionsRollingSum,
          //   color: colors.getHospitalizedColor(),
          //   detail: dashboard.DETAIL_LOW,
          //   visualization: 'progress',
          //   dateField: "date",
          //   abbreviate: true,
          //   conditions:[
          //     "areaName == 'Northern Ireland'"
          //   ],
          //   max: RATE_ADMISSIONS_MAX            
          // },
          // {
          //   id:"newAdmissions_wales",
          //   title: "Wales (Last 7 days)",
          //   dataField: "newAdmissionsRollingSum",
          //   cumulative: true,
          //   timeUnit: dashboard.TIMEUNIT_DAY,
          //   data: newAdmissionsRollingSum,
          //   color: colors.getHospitalizedColor(),
          //   detail: dashboard.DETAIL_LOW,
          //   visualization: 'progress',
          //   dateField: "date",
          //   abbreviate: true,
          //   conditions:[
          //     "areaName== 'Wales'"
          //   ],
          //   max: RATE_ADMISSIONS_MAX            
          // },

          // CASES
          {
            id:"cumCasesBySpecimenDate",
            title: "Cumulative",
            dataField: "cumCasesBySpecimenDate",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: Data.from(options.data, Data.Fields.PHE_UK_CUM_CASES),
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
            data: Data.from(options.data, Data.Fields.PHE_UK_NEW_CASES),
            color: colors.getCaseColor(),
            detail: DETAIL_DAILY,
            visualization: 'linechart',
            dateField: "date",
            abbreviate: true
          },
          {
            id:"casesNations",
            title: "Change in cases from yesterday",
            dataField: "newCasesBySpecimenDateChangePercentage",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: newCasesBySpecimenDateChangePercentage_all,
            color: colors.getCaseColor(),
            detail: DETAIL_NATIONS,
            visualization: 'barchart',
            dateField: "date",
            categories: "areaName", 
            filter: ['latest'], 
          },
          // {
          //   id:"newCasesBySpecimenDate_eng",
          //   title: "New Cases England",
          //   dataField: "newCasesBySpecimenDate",
          //   cumulative: true,
          //   timeUnit: dashboard.TIMEUNIT_DAY,
          //   data: newCasesBySpecimenDate_all,
          //   color: colors.getCaseColor(),
          //   detail: dashboard.DETAIL_LOW,
          //   visualization: 'progress',
          //   dateField: "date",
          //   abbreviate: true,
          //   conditions:[
          //     "areaName == 'England'"
          //   ],
          //   max: RATE_CASES_MAX            
          // },
          // {
          //   id:"newCasesBySpecimenDate_sco",
          //   title: "New Cases Scotland",
          //   dataField: "newCasesBySpecimenDate",
          //   cumulative: true,
          //   timeUnit: dashboard.TIMEUNIT_DAY,
          //   data: newCasesBySpecimenDate_all,
          //   color: colors.getCaseColor(),
          //   detail: dashboard.DETAIL_LOW,
          //   visualization: 'progress',
          //   dateField: "date",
          //   abbreviate: true,
          //   conditions:[
          //     "areaName == 'Scotland'"
          //   ],
          //   max: RATE_CASES_MAX            
          // },
          // {
          //   id:"newCasesBySpecimenDate_ni",
          //   title: "New Cases Northern Ireland",
          //   dataField: "newCasesBySpecimenDate",
          //   cumulative: true,
          //   timeUnit: dashboard.TIMEUNIT_DAY,
          //   data: newCasesBySpecimenDate_all,
          //   color: colors.getCaseColor(),
          //   detail: dashboard.DETAIL_LOW,
          //   visualization: 'progress',
          //   dateField: "date",
          //   abbreviate: true,
          //   conditions:[
          //     "areaName == 'Northern Ireland'"
          //   ],
          //   max: RATE_CASES_MAX            
          // },
          // {
          //   id:"newCasesBySpecimenDate_wales",
          //   title: "New Cases Wales",
          //   dataField: "newCasesBySpecimenDate",
          //   cumulative: true,
          //   timeUnit: dashboard.TIMEUNIT_DAY,
          //   data: newCasesBySpecimenDate_all,
          //   color: colors.getCaseColor(),
          //   detail: dashboard.DETAIL_LOW,
          //   visualization: 'progress',
          //   dateField: "date",
          //   abbreviate: true,
          //   conditions:[
          //     "areaName== 'Wales'"
          //   ],
          //   max: RATE_CASES_MAX            
          // },

          // DEATHS
          {
            id:"cumDeaths28DaysByDeathDate",
            title: "Cumulative",
            dataField: "cumDeaths28DaysByDeathDate",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: Data.from(options.data, Data.Fields.PHE_UK_CUM_DEATHS_28_DAYS),
            color: colors.getDeathColor(),
            detail: dashboard.DETAIL_LOW,
            visualization: 'linechart',
            layout: 'vertical',
            dateField: "date",
            abbreviate: true,
            trendWindow: 'all'
          },
          timeseriesWidget(
            "newDeaths28DaysByDeathDate",
            "New Weekly Deaths ",
            "newDeaths28DaysByDeathDate",
            false,
            dashboard.TIMEUNIT_DAY,
            Data.from(options.data, Data.Fields.PHE_UK_NEW_DEATHS_28_DAYS),
            colors.getDeathColor(),
            DETAIL_DAILY,
          ),
          {
            id:"deathsNations",
            title: "New deaths per nation (this week)",
            dataField: "newOnsDeathsByRegistrationDate",
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: newOnsDeathsByRegistrationDate_all,
            color: colors.getDeathColor(),
            detail: DETAIL_NATIONS,
            visualization: 'barchart',
            dateField: "date",
            filter: ['latest'],
            categories: "areaName", 
         },
          // {
          //   id:"newOnsDeathsByRegistrationDate_eng",
          //   title: "New Cases England",
          //   dataField: "newOnsDeathsByRegistrationDate",
          //   cumulative: true,
          //   timeUnit: dashboard.TIMEUNIT_DAY,
          //   data: newOnsDeathsByRegistrationDate_all,
          //   color: colors.getDeathColor(),
          //   detail: dashboard.DETAIL_LOW,
          //   visualization: 'progress',
          //   dateField: "date",
          //   abbreviate: true,
          //   conditions:[
          //     "areaName == 'England'"
          //   ],
          //   max: RATE_DEATHS_MAX            
          // },
          // {
          //   id:"newOnsDeathsByRegistrationDate_sco",
          //   title: "New Cases Scotland",
          //   dataField: "newOnsDeathsByRegistrationDate",
          //   cumulative: true,
          //   timeUnit: dashboard.TIMEUNIT_DAY,
          //   data: newOnsDeathsByRegistrationDate_all,
          //   color: colors.getDeathColor(),
          //   detail: dashboard.DETAIL_LOW,
          //   visualization: 'progress',
          //   dateField: "date",
          //   abbreviate: true,
          //   conditions:[
          //     "areaName == 'Scotland'"
          //   ],
          //   max: RATE_DEATHS_MAX            
          // },
          // {
          //   id:"newOnsDeathsByRegistrationDate_ni",
          //   title: "New Cases Northern Ireland",
          //   dataField: "newOnsDeathsByRegistrationDate",
          //   cumulative: true,
          //   timeUnit: dashboard.TIMEUNIT_DAY,
          //   data: newOnsDeathsByRegistrationDate_all,
          //   color: colors.getDeathColor(),
          //   detail: dashboard.DETAIL_LOW,
          //   visualization: 'progress',
          //   dateField: "date",
          //   abbreviate: true,
          //   conditions:[
          //     "areaName == 'Northern Ireland'"
          //   ],
          //   max: RATE_DEATHS_MAX            
          // },
          // {
          //   id:"newOnsDeathsByRegistrationDate_wales",
          //   title: "New Cases Wales",
          //   dataField: "newOnsDeathsByRegistrationDate",
          //   cumulative: true,
          //   timeUnit: dashboard.TIMEUNIT_DAY,
          //   data: newOnsDeathsByRegistrationDate_all,
          //   color: colors.getDeathColor(),
          //   detail: dashboard.DETAIL_LOW,
          //   visualization: 'progress',
          //   dateField: "date",
          //   abbreviate: true,
          //   conditions:[
          //     "areaName== 'Wales'"
          //   ],
          //   max: RATE_DEATHS_MAX            
          // },
          // VACC
          {
            id: "vacc1",
            visualization: "progress",
            title: "Total 1st Dose Uptake",
            dataField: "cumPeopleVaccinatedFirstDoseByPublishDate",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: Data.from(options.data, Data.Fields.PHE_UK_CUM_VACC_FIRST),
            color: colors.getVaccinationColor(1),
            detail: dashboard.DETAIL_LOW,
            dateField: "date",
            abbreviate: true,
            min: 0, 
            max: UK_POPULATION
          },
          {
            id: "vacc1d",
            visualization: "linechart",
            title: "Daily 1st Dose Vaccinations",
            dataField: "newPeopleVaccinatedFirstDoseByPublishDate",
            cumulative: false,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: Data.from(options.data, Data.Fields.PHE_UK_NEW_VACC_FIRST),
            color: colors.getVaccinationColor(1),
            detail: dashboard.DETAIL_MEDIUM,
            dateField: "date",
            abbreviate: true,
            min: 0, max: PEOPLE_PER_DAY
          },
          {
            id: "vacc2",
            title: "Total 2nd Dose Uptake",
            visualization: "progress",
            dataField: "cumPeopleVaccinatedSecondDoseByPublishDate",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: Data.from(options.data, Data.Fields.PHE_UK_CUM_VACC_SECOND),
            color: colors.getVaccinationColor(2),
            detail: dashboard.DETAIL_LOW,
            dateField: "date",
            abbreviate: true,
            min: 0, 
            max: UK_POPULATION
          },
          {
            id: "vacc2d",
            title: "Daily 2nd Dose",
            visualization: "linechart",
            dataField: "newPeopleVaccinatedSecondDoseByPublishDate",
            cumulative: false,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: Data.from(options.data, Data.Fields.PHE_UK_NEW_VACC_SECOND),
            color: colors.getVaccinationColor(2),
            detail: dashboard.DETAIL_MEDIUM,
            dateField: "date",
            abbreviate: true,
            min: 0, max: PEOPLE_PER_DAY
          },
          {
            id: "vacc3",
            visualization: "progress",
            title: "Total 3rd Dose  / Booster",
            dataField: "cumPeopleVaccinatedThirdInjectionByPublishDate",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: Data.from(options.data, Data.Fields.PHE_UK_CUM_VACC_THIRD),
            color: colors.getVaccinationColor(3),
            detail: dashboard.DETAIL_LOW,
            dateField: "date",
            abbreviate: true,
            min: 0, 
            max: UK_POPULATION
          },
          {
            id: "vacc3d",
            visualization: "linechart",
            title: "Daily 3rd Dose / Boosters",
            dataField: "newPeopleVaccinatedThirdInjectionByPublishDate",
            cumulative: false,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: Data.from(options.data, Data.Fields.PHE_UK_NEW_VACC_THIRD),
            color: colors.getVaccinationColor(3),
            detail: dashboard.DETAIL_MEDIUM,
            dateField: "date",
            abbreviate: true,
            min: 0, max: PEOPLE_PER_DAY
          },
          // LTLAs
          {
            id:"cases_ltlas",
            title: "Case rate (per 1,000,000?)",
            dataField: "newCasesBySpecimenDateChangePercentage",
            cumulative: true,
            timeUnit: dashboard.TIMEUNIT_DAY,
            data: newCasesBySpecimenDateChangePercentage_councils,
            color: colors.getCaseColor(),
            detail: dashboard.DETAIL_LOW,
            visualization: 'cartogram',
            map: "uk_ltla",
            dateField: "date",
            categories: "areaName", 
            filter: ['latest'], 
          },
        ],
      };

      // this will interpret the dashboard specifiation
      dashboard.createDashboard(div, config);
    }, 3000);
  }
}
