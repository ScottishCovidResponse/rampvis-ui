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
    // Phong added - to remove
    // @Ben: please get data this way rather than relying on index in options.data
    // end Phong added - to remove

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
      };
      return w;
    };

    setTimeout(function () {
      // 2. Specify your dashboar spec here: https://github.com/benjbach/dashboardscript/wiki
      var config = {
        layout: [["cases", "admissions", "deaths"], "vacc"],
        groups: [
          {
            id: "admissions",
            title: "Admissions",
            layout: ["cumAdmissions", "newAdmissions"],
          },
          {
            id: "cases",
            title: "Cases",
            layout: ["cumCasesBySpecimenDate", "newCasesBySpecimenDate"],
          },
          {
            id: "deaths",
            title: "Deaths",
            layout: [
              "cumDeaths28DaysByDeathDate",
              "newDeaths28DaysByDeathDate",
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
        ],
        widgets: [
          timeseriesWidget(
            "cumAdmissions",
            "Cumulative Admissions",
            "cumAdmissions",
            true,
            dashboard.TIMEUNIT_DAY,
            Data.from(options.data, Data.Fields.PHE_UK_CUM_ADMISSIONS),
            colors.getHospitalizedColor(),
            dashboard.DETAIL_HIGH,
          ),
          timeseriesWidget(
            "newAdmissions",
            "New Daily Admissions",
            "newAdmissions",
            false,
            dashboard.TIMEUNIT_DAY,
            Data.from(options.data, Data.Fields.PHE_UK_NEW_AMISSIONS),
            colors.getHospitalizedColor(),
            dashboard.DETAIL_HIGH,
          ),
          timeseriesWidget(
            "cumCasesBySpecimenDate",
            "Cumulative Cases",
            "cumCasesBySpecimenDate",
            true,
            dashboard.TIMEUNIT_DAY,
            Data.from(options.data, Data.Fields.PHE_UK_CUM_CASES),
            colors.getCaseColor(),
            dashboard.DETAIL_HIGH,
          ),
          timeseriesWidget(
            "newCasesBySpecimenDate",
            "New Daily Cases",
            "newCasesBySpecimenDate",
            false,
            dashboard.TIMEUNIT_DAY,
            Data.from(options.data, Data.Fields.PHE_UK_NEW_CASES),
            colors.getCaseColor(),
            dashboard.DETAIL_HIGH,
          ),
          timeseriesWidget(
            "cumDeaths28DaysByDeathDate",
            "Cumulative Deaths",
            "cumDeaths28DaysByDeathDate",
            true,
            dashboard.TIMEUNIT_DAY,
            Data.from(options.data, Data.Fields.PHE_UK_CUM_DEATHS_28_DAYS),
            colors.getDeathColor(),
            dashboard.DETAIL_HIGH,
          ),
          timeseriesWidget(
            "newDeaths28DaysByDeathDate",
            "New Weekly Deaths ",
            "newDeaths28DaysByDeathDate",
            false,
            dashboard.TIMEUNIT_DAY,
            Data.from(options.data, Data.Fields.PHE_UK_NEW_DEATHS_28_DAYS),
            colors.getDeathColor(),
            dashboard.DETAIL_HIGH,
          ),
          timeseriesWidget(
            "vacc1",
            "Total 1st Dose Update",
            "cumPeopleVaccinatedFirstDoseByPublishDate",
            true,
            dashboard.TIMEUNIT_DAY,
            Data.from(options.data, Data.Fields.PHE_UK_CUM_VACC_FIRST),
            colors.getVaccinationColor(1),
            dashboard.DETAIL_MEDIUM,
          ),
          timeseriesWidget(
            "vacc1d",
            "Daily 1st Dose Vaccinations",
            "newPeopleVaccinatedFirstDoseByPublishDate",
            false,
            dashboard.TIMEUNIT_DAY,
            Data.from(options.data, Data.Fields.PHE_UK_NEW_VACC_FIRST),
            colors.getVaccinationColor(1),
            dashboard.DETAIL_MEDIUM
          ),
          timeseriesWidget(
            "vacc2",
            "Total 2nd Dose Update",
            "cumPeopleVaccinatedSecondDoseByPublishDate",
            true,
            dashboard.TIMEUNIT_DAY,
            Data.from(options.data, Data.Fields.PHE_UK_CUM_VACC_SECOND),
            colors.getVaccinationColor(2),
            dashboard.DETAIL_MEDIUM,
          ),
          timeseriesWidget(
            "vacc2d",
            "2nd Dose Daily",
            "newPeopleVaccinatedSecondDoseByPublishDate",
            false,
            dashboard.TIMEUNIT_DAY,
            Data.from(options.data, Data.Fields.PHE_UK_NEW_VACC_SECOND),
            colors.getVaccinationColor(2),
            dashboard.DETAIL_MEDIUM
          ),
          timeseriesWidget(
            "vacc3",
            "Total 3rd Dose Uptake",
            "cumPeopleVaccinatedThirdInjectionByPublishDate",
            true,
            dashboard.TIMEUNIT_DAY,
            Data.from(options.data, Data.Fields.PHE_UK_CUM_VACC_THIRD),
            colors.getVaccinationColor(3),
            dashboard.DETAIL_MEDIUM,
          ),
          timeseriesWidget(
            "vacc3d",
            "3rd Dose Daily",
            "newPeopleVaccinatedThirdInjectionByPublishDate",
            false,
            dashboard.TIMEUNIT_DAY,
            Data.from(options.data, Data.Fields.PHE_UK_NEW_VACC_THIRD),
            colors.getVaccinationColor(3),
            dashboard.DETAIL_MEDIUM
          ),
        ],
      };

      // this will interpret the dashboard specifiation
      dashboard.createDashboard(div, config);
    }, 5000);
  }
}
