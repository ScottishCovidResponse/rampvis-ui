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

    // creates the main div. don't touch
    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container");

    console.log('PHE_MSOA_CASES', Data.from(options.data, Data.Fields.PHE_MSOA_CASES));
    console.log('PHE_MSOA_VACCINE', Data.from(options.data, Data.Fields.PHE_MSOA_VACCINE));      
      

    // var vacc1 = "https://api.coronavirus.data.gov.uk/v2/data?areaType=msoa&areaCode=E02000961&metric=cumVaccinationFirstDoseUptakeByVaccinationDatePercentage&format=csv"
    // var vacc2 = "https://api.coronavirus.data.gov.uk/v2/data?areaType=msoa&areaCode=E02000961&metric=cumVaccinationSecondDoseUptakeByVaccinationDatePercentage&format=csv"
    // var vacc3 = 'https://api.coronavirus.data.gov.uk/v2/data?areaType=msoa&areaCode=E02000024&metric=cumVaccinationThirdInjectionUptakeByVaccinationDatePercentage&format=csv'

    // d3.csv(vacc1).then(function (data) {
    //   vacc1 = data;
    //   console.log(vacc1)
    // });
    // d3.csv(vacc2).then(function (data) {
    //   vacc2 = data;
    //   console.log(vacc2)
    // });
    // d3.csv(vacc3).then(function (data) {
    //   vacc3 = data;
    //   console.log('vacc3', vacc3)
    // });


    // 3. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki
    setTimeout(function () {
    var config = {
        layout: ['cases',
        'vaccinations'
      ],
        groups: [
          {
            id: 'cases', 
            title: 'Cases', 
            layout: [['newCasesBySpecimenDateRollingRate']]
          },
          {
            id: 'vaccinations', 
            title: 'Vaccinations', 
            layout: [['vacc1','vacc2', 'vacc3' ]]
          }

        ],
        widgets: [
          {
            id: 'newCasesBySpecimenDateRollingRate', 
            title: 'Weekly new cases', 
            data:  Data.from(options.data, Data.Fields.PHE_MSOA_CASES), 
            dataField: 'newCasesBySpecimenDateRollingRate', 
            visualization: 'linechart', 
            detail: dashboard.DETAIL_HIGH, 
            cumulative: false,
            dateField: 'date', 
            color: colors.getCaseColor(), 
            min: 0
          },{
            id: 'vacc1', 
            title: 'Vaccination 1 Uptake', 
            data:  Data.from(options.data, Data.Fields.PHE_MSOA_VACCINE), 
            dataField: 'cumVaccinationFirstDoseUptakeByVaccinationDatePercentage', 
            visualization: 'progress', 
            detail: dashboard.DETAIL_MEDIUM, 
            cumulative: true,
            unit: '%',
            dateField: 'date', 
            color: colors.getVaccinationColor(-1), 
            min: 0,
            max: 100
          }
          ,{
            id: 'vacc2', 
            title: 'Vaccination 2 Uptake', 
            data:  Data.from(options.data, Data.Fields.PHE_MSOA_VACCINE), 
            dataField: 'cumVaccinationSecondDoseUptakeByVaccinationDatePercentage', 
            visualization: 'progress', 
            detail: dashboard.DETAIL_MEDIUM, 
            cumulative: true,
            unit: '%',
            dateField: 'date', 
            color: colors.getVaccinationColor(), 
            min: 0,
            max: 100
          },{
            id: 'vacc3', 
            title: 'Vaccination 3 / Booster Uptake', 
            data:  Data.from(options.data, Data.Fields.PHE_MSOA_VACCINE), 
            dataField: 'cumVaccinationThirdInjectionUptakeByVaccinationDatePercentage', 
            visualization: 'progress', 
            detail: dashboard.DETAIL_MEDIUM, 
            cumulative: true,
            unit: '%',
            dateField: 'date', 
            color: colors.getVaccinationColor(2), 
            min: 0,
            max: 100
          }
        ],
      };

      // this will interpret the dashboard specifiation
      dashboard.createDashboard(div, config);
    }, 3000);
  }
}
