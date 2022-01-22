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
import { colors} from "../colors.js";

// 1. Give class a name
export class DashboardUpperTierLocalAuthority{
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
    console.log('PHE_UTLA_NEW', Data.from(options.data, Data.Fields.PHE_UTLA_NEW));
    console.log('PHE_UTLA_CUM', Data.from(options.data, Data.Fields.PHE_UTLA_CUM));
    
    
    // 3. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki
    var config = {
      dataSources: [
        {
          url: "https://coronavirus.data.gov.uk/details/download",
          name: "Public Health England"
        }],
      dataSources: [
        {
          url: "https://coronavirus.data.gov.uk/details/download",
          name: "Public Health England"
        }],

        layout: [[
          "cases", 
          "deaths"], 
          "vacc"
        ],
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
            layout: [
              ["vacc1","vacc2", 'vacc3'],
            ],
          },
        ],
        widgets: [
          {
            id: "cumCases",
            title: "Cumulative Cases",
            color: colors.getCaseColor(),
            data: Data.from(options.data, Data.Fields.PHE_UTLA_CUM),
            dataField: "cumCasesBySpecimenDate",
            detail: dashboard.DETAIL_LOW,
            cumulative: true,
            layout: 'horizontal',
            dateField: "date",
            visualization: "linechart",
            abbreviate: true,
            min: 0,
            timeUnit: 'day',
            trendWindow: 150
          },
          {
            id: "newCases",
            title: "New Cases",
            color: colors.getCaseColor(),
            data: Data.from(options.data, Data.Fields.PHE_UTLA_NEW),
            dataField: "newCasesBySpecimenDate",
            detail: dashboard.DETAIL_MEDIUM,
            cumulative: false,
            dateField: "date",
            visualization: "linechart",
            min: 0,
            timeUnit: 'day',
            trendWindow: 14
          },
          {
            id: "cumDeaths",
            title: "Cumulative Death",
            color: colors.getDeathColor(),
            data: Data.from(options.data, Data.Fields.PHE_UTLA_CUM),
            dataField: "cumDeaths28DaysByDeathDate", 
            detail: dashboard.DETAIL_LOW,
            cumulative: true,
            dateField: "date",
            layout: 'horizontal',
            visualization: "linechart",
            min: 0,
            timeUnit: 'day',
            trendWindow: 180
          },
          {
            id: "newDeaths",
            title: "Daily Deaths",
            color: colors.getDeathColor(),
            data: Data.from(options.data, Data.Fields.PHE_UTLA_NEW),
            dataField: "newDeaths28DaysByDeathDate",
            timeUnit: dashboard.TIMEUNIT_WEEK,
            detail: dashboard.DETAIL_MEDIUM,
            dateField: "date",
            visualization: "linechart",
            min: 0,
            timeUnit: 'day',
            trendWindow: 14
          },
          {
            id: "vacc1",
            title: "1st Dose Percentage",
            color: colors.getVaccinationColor(-1),
            data: Data.from(options.data, Data.Fields.PHE_UTLA_CUM),
            dataField:
              "cumVaccinationFirstDoseUptakeByVaccinationDatePercentage",
            detail: dashboard.DETAIL_MEDIUM,
            unit: '%',
            cumulative: true,
            dateField: "date",
            visualization: "linechart",
            min: 0,
            max: 100,
            timeUnit: 'day',
            trendWindow: 14
          },
          {
            id: "vacc2",
            title: "2nd Dose Percentage",
            color: colors.getVaccinationColor(),
            data:  Data.from(options.data, Data.Fields.PHE_UTLA_CUM),
            dataField:
              "cumVaccinationSecondDoseUptakeByVaccinationDatePercentage",
            detail: dashboard.DETAIL_MEDIUM,
            unit: '%',
            cumulative: true,
            dateField: "date",
            visualization: "linechart",
            min: 0,
            max: 100,
            timeUnit: 'day',
            trendWindow: 14
          },
          {
            id: "vacc3",
            title: "3rd Dose (Booster)",
            color: colors.getVaccinationColor(1),
            data:  Data.from(options.data, Data.Fields.PHE_UTLA_NEW),
            dataField:
              "cumVaccinationThirdInjectionUptakeByVaccinationDatePercentage",
            detail: dashboard.DETAIL_MEDIUM,
            unit: '%',
            cumulative: true,
            dateField: "date",
            visualization: "linechart",
            min: 0,
            max: 100, 
            timeUnit: 'day',
            trendWindow: 14
          }
        ],
      };

    // this will interpret the dashboard specifiation
    dashboard.createDashboard(div, config);
  }
}
