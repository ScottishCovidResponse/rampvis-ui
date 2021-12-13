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

import * as d3 from "d3";
import { Data } from '../data'
import { dashboard } from "./dashboard";
import { colors } from "../colors";

var nhsBoardField = "";
var latestUpdateTime = "";

export class DashboardScotlandNew {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 400;

  constructor(options) {
    console.log("Input data", options.data);

    // Notes: please use these
    console.log(
      "COUNTRY_NEW_CASES",
      Data.from(options.data, Data.Fields.COUNTRY_NEW_CASES),
    );
    console.log(
      "COUNTRY_HOSPITAL",
      Data.from(options.data, Data.Fields.COUNTRY_HOSPITAL),
    );
    console.log(
      "COUNTRY_ICU",
      Data.from(options.data, Data.Fields.COUNTRY_ICU),
    );
    console.log(
      "COUNTRY_VACCINE_TOTAL",
      Data.from(options.data, Data.Fields.COUNTRY_VACCINE_TOTAL),
    );
    console.log(
      "COUNTRY_VACCINE_SEX_AGEGROUP",
      Data.from(options.data, Data.Fields.COUNTRY_VACCINE_SEX_AGEGROUP),
    );
    console.log(
      "HEALTH_BOARD_TESTS_NORMALIZED",
      Data.from(options.data, Data.Fields.HEALTH_BOARD_TESTS_NORMALIZED),
    );
    console.log(
      "HEALTH_BOARD_HOSPITAL_NORMALIZED",
      Data.from(options.data, Data.Fields.HEALTH_BOARD_HOSPITAL_NORMALIZED),
    );
    console.log(
      "HEALTH_BOARD_ICU_NORMALIZED",
      Data.from(options.data, Data.Fields.HEALTH_BOARD_ICU_NORMALIZED),
    );
    console.log(
      "HEALTH_BOARD_COVID_DEATHS_NORMALIZED",
      Data.from(options.data, Data.Fields.HEALTH_BOARD_COVID_DEATHS_NORMALIZED),
    );
    console.log(
      "HEALTH_BOARD_ALL_DEATHS_NORMALIZED",
      Data.from(options.data, Data.Fields.HEALTH_BOARD_ALL_DEATHS_NORMALIZED),
    );

    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container")
      .text("TODO");

    nhsBoardField = Object.keys(options.data[0].values[0])[1];
    latestUpdateTime = console.log(
      options.data[0].values[options.data[0].values.length - 1].index,
    );
    var data = options.data;
    var links = options.links;

    var config = {
      layout: [["summary", "vaccinations"], "regions"],
      groups: [
        {
          id: "summary",
          title: "Nation Summary",
          layout: [["cases", "patients", "patientsICU"]],
        },
        {
          id: "vaccinations",
          title: "Vaccinations",
          layout: [
            ["vaccinated1", "vaccinated2", ["vaccinated3", "vaccinated4"]],
          ],
        },
        {
          id: "regions",
          title: "NHS Boards",
          layout: [
            [
              ["regionsTestsNorm", "covidInHospital", "covidInICU"],
              ["covidDeaths", "allDeaths"],
            ],
          ],
        },
      ],
      widgets: [
        {
          id: "cases",
          title: "New Cases",
          dataField: "Testing - New cases reported",
          visualization: "linechart",
          color: colors.getCaseColor(),
          data: Data.from(options.data, Data.Fields.COUNTRY_NEW_CASES),
          link: links[0],
        },
        {
          id: "patients",
          title: "COVID-19 Patients in Hospital",
          dataField: "COVID-19 patients in hospital - Confirmed",
          visualization: "linechart",
          color: colors.getHospitalizedColor(),
          data: Data.from(options.data, Data.Fields.COUNTRY_HOSPITAL),
        },
        {
          id: "patientsICU",
          title: "Covid Patients in ICU",
          dataField: "COVID-19 patients in ICU - Confirmed",
          color: colors.getICUColor(),
          visualization: "linechart",
          data: Data.from(options.data, Data.Fields.COUNTRY_ICU),
        },

        {
          id: "vaccinated1",
          title: "1st Dose Vaccination",
          dataField: "NumberVaccinated",
          visualization: "linechart",
          color: colors.getVaccinationColor(),
          data: Data.from(options.data, Data.Fields.COUNTRY_VACCINE_TOTAL),
          conditions: [
            'Dose == "Dose 1"',
            'AgeBand == "18 years and over"',
            'Product == "Total"',
          ],
          detail: dashboard.DETAIL_MEDIUM
        },
        {
          id: "vaccinated2",
          title: "2nd Dose Vaccination",
          dataField: "NumberVaccinated",
          visualization: "linechart",
          color: colors.getVaccinationColor(),
          data: Data.from(options.data, Data.Fields.COUNTRY_VACCINE_TOTAL),
          conditions: [
            'Dose == "Dose 2"', 
            'AgeBand == "18 years and over"',
            'Product == "Total"'],
          detail: dashboard.DETAIL_MEDIUM
        },
        {
          id: "vaccinated3",
          title: "Vaccination (30-39 age group)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(),
          data: Data.from(
            options.data,
            Data.Fields.COUNTRY_VACCINE_SEX_AGEGROUP,
          ),
          unit: '%',
          cumulative: true,
          detail: dashboard.DETAIL_MEDIUM,
          conditions: [
            'Dose == "Dose 1"',
            'Sex == "Total"',
            'AgeGroup == "30 - 39"',
          ],
        },
        {
          id: "vaccinated4",
          title: "Vaccination (40-49 age group)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(),
          cumulative: true,
          data: Data.from(
            options.data,
            Data.Fields.COUNTRY_VACCINE_SEX_AGEGROUP,
          ),
          unit: '%',
          detail: dashboard.DETAIL_MEDIUM,
          conditions: [
            'Dose == "Dose 1"',
            'Sex == "Total"',
            'AgeGroup == "40 - 49"',
          ],
        },
        {
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_TESTS_NORMALIZED,
          ),
          id: "regionsTestsNorm",
          title: "Tests per 1000 people",
          visualization: "cartogram",
          color: colors.getTestColor(),
          normalized: true,
        },
        {
          id: "covidInHospital",
          title: "Covid Patients in Hospital",
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_HOSPITAL_NORMALIZED,
          ),
          color: colors.getHospitalizedColor(),
          visualization: "cartogram",
          normalized: true,
        },
        {
          id: "covidInICU",
          title: "Covid Patients in ICU",
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_ICU_NORMALIZED,
          ),
          visualization: "cartogram",
          color: colors.getICUColor(),
          normalized: true,
        },
        {
          id: "covidDeaths",
          title: "Weekly Covid Deaths",
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_COVID_DEATHS_NORMALIZED,
          ),
          visualization: "cartogram",
          color: colors.getDeathColor(),
          normalized: true,
        },
        {
          id: "allDeaths",
          title: "Weekly All Deaths",
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_ALL_DEATHS_NORMALIZED,
          ),
          visualization: "cartogram",
          color:  colors.getDeathColor(),
          normalized: true,
        },
      ],
    };

    dashboard.createDashboard(div, config);
  }
}
