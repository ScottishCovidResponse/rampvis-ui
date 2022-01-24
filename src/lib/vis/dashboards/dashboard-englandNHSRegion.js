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
export class DashboardEnglandNHSRegion {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 400;

  constructor(options) {
    // creates the main div. don't touch
    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container");

    // Phong
    console.log("***live data");
    console.log(
      "PHE_ENGNHS_GROUP1",
      Data.from(options.data, Data.Fields.PHE_ENGNHS_GROUP1),
    );
    console.log(
      "PHE_ENGNHS_GROUP2",
      Data.from(options.data, Data.Fields.PHE_ENGNHS_GROUP2),
    );

    // 3. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki

    var config = {
      dataSources: [
        {
          url: "https://coronavirus.data.gov.uk/details/download",
          name: "Public Health England",
        },
      ],
      links: options.childrenLinks,
      layout: [["admissions", "hospital"], "demographics"],
      groups: [
        {
          id: "admissions",
          title: "Hospital Admissions",
          layout: ["cumAdmissions", "newAdmissions"],
        },
        {
          id: "hospital",
          title: "Hospital Admissions",
          layout: ["hospitalCases"],
        },
        {
          id: "demographics",
          title: "Demograhpics",
          layout: ["demographicsW"],
        },
      ],
      widgets: [
        {
          id: "cumAdmissions",
          title: "Cumulative Admissions",
          data: Data.from(options.data, Data.Fields.PHE_ENGNHS_GROUP1),
          dataField: "cumAdmissions",
          visualization: "linechart",
          detail: dashboard.DETAIL_LOW,
          layout: "vertical",
          cumulative: true,
          dateField: "date",
          abbreviate: true,
          color: colors.getHospitalizedColor(1),
          min: 0,
        },
        {
          id: "newAdmissions",
          title: "Cumulative Admissions",
          data: Data.from(options.data, Data.Fields.PHE_ENGNHS_GROUP1),
          dataField: "newAdmissions",
          visualization: "linechart",
          detail: dashboard.DETAIL_HIGH,
          layout: "horizontal",
          cumulative: false,
          dateField: "date",
          abbreviate: true,
          color: colors.getHospitalizedColor(1),
          min: 0,
        },
        {
          id: "hospitalCases",
          title: "Hospital Cases",
          data: Data.from(options.data, Data.Fields.PHE_ENGNHS_GROUP1),
          dataField: "hospitalCases",
          visualization: "linechart",
          detail: dashboard.DETAIL_HIGH,
          layout: "horizontal",
          cumulative: false,
          dateField: "date",
          abbreviate: true,
          color: colors.getHospitalizedColor(1),
          min: 0,
        },
        {
          id: "demographicsW",
          title: "1st dose uptake by age groups",
          data: Data.from(options.data, Data.Fields.PHE_ENGNHS_GROUP2),
          dataField: "cumVaccinationFirstDoseUptakeByVaccinationDatePercentage",
          visualization: "barchart",
          detail: dashboard.DETAIL_HIGH,
          unit: "%",
          dateField: "date",
          categories: "age",
          color: colors.getVaccinationColor(1),
          min: 0,
          max: 100,
        },
      ],
    };

    // this will interpret the dashboard specifiation
    dashboard.createDashboard(div, config);
  }
}
