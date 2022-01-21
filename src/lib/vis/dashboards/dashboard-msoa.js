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
    // console.log('data including all 5 metrics')
    // console.log(Data.from(options.data, Data.Fields.PHE_MSOA_ALL));

    // creates the main div. don't touch
    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container");

    console.log('PHE_MSOA_ALL', Data.from(options.data, Data.Fields.PHE_MSOA_ALL));      
      
      
  

    // 3. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki
      var config = {
        layout: ['cases',
        'vaccinations'
      ],
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
            data:  Data.from(options.data, Data.Fields.PHE_MSOA_ALL), 
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
            data:  Data.from(options.data, Data.Fields.PHE_MSOA_ALL), 
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
            data:  Data.from(options.data, Data.Fields.PHE_MSOA_ALL), 
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
            data:  Data.from(options.data, Data.Fields.PHE_MSOA_ALL), 
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
            data:  Data.from(options.data, Data.Fields.PHE_MSOA_ALL), 
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
  }
}
