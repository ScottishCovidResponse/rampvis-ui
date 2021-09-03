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
import { Data } from "./data";
import {
  dashboard,
  COLOR_VACCINATON,
  COLOR_HOSPITAL,
  COLOR_TESTS,
  COLOR_DEATHS,
  COLOR_CASES,
} from "./dashboard";
// import "./css/dashboard.css";
// import "./css/default-dashboard.css";
// import "./css/common.css";

var nhsBoardField = "";
var latestUpdateTime = "";
//http://localhost:5000/608c2945051751537fab92d1

export class CountryOverview {
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
      .attr("class", "vis-example-container");

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
          layout: [["cases", "deaths", "patients"]],
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
          color: COLOR_CASES,
          data: Data.from(options.data, Data.Fields.COUNTRY_NEW_CASES),
          mode: dashboard.MODE_DAILY,
          link: links[0],
        },
        {
          id: "vaccinated1",
          title: "1st Dose Vaccination",
          dataField: "NumberVaccinated",
          visualization: "linechart",
          color: d3.color(COLOR_VACCINATON).brighter(0.6),
          data: Data.from(options.data, Data.Fields.COUNTRY_VACCINE_TOTAL),
          mode: dashboard.MODE_DAILY,
          conditions: [
            'Dose == "Dose 1"',
            'AgeBand == "18 years and over"',
            'Product == "Total"',
          ],
        },
        {
          id: "vaccinated2",
          title: "2nd Dose Vaccination",
          dataField: "NumberVaccinated",
          visualization: "linechart",
          color: d3.color(COLOR_VACCINATON),
          data: Data.from(options.data, Data.Fields.COUNTRY_VACCINE_TOTAL),
          mode: dashboard.MODE_DAILY,
          conditions: ['Dose == "Dose 2"', 'Product == "Total"'],
        },
        {
          id: "vaccinated3",
          title: "Vaccination (30-39 age group)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: d3.color(COLOR_VACCINATON).darker(0.5),
          data: Data.from(
            options.data,
            Data.Fields.COUNTRY_VACCINE_SEX_AGEGROUP,
          ),
          mode: dashboard.MODE_PERCENT,
          detail: dashboard.DETAIL_COMPACT,
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
          color: d3.color(COLOR_VACCINATON).darker(1.4),
          data: Data.from(
            options.data,
            Data.Fields.COUNTRY_VACCINE_SEX_AGEGROUP,
          ),
          mode: dashboard.MODE_PERCENT,
          detail: dashboard.DETAIL_COMPACT,
          conditions: [
            'Dose == "Dose 1"',
            'Sex == "Total"',
            'AgeGroup == "40 - 49"',
          ],
        },
        {
          id: "deaths",
          title: "COVID-19 Patients in Hospital",
          dataField: "COVID-19 patients in hospital - Confirmed",
          visualization: "linechart",
          color: d3.color(COLOR_HOSPITAL).brighter(1.5),
          data: Data.from(options.data, Data.Fields.COUNTRY_HOSPITAL),
          mode: dashboard.MODE_CUMULATIVE,
        },
        {
          id: "patients",
          title: "Covid Patients in ICU",
          dataField: "COVID-19 patients in ICU - Confirmed",
          color: COLOR_HOSPITAL,
          visualization: "linechart",
          data: Data.from(options.data, Data.Fields.COUNTRY_ICU),
          mode: dashboard.MODE_CURRENT,
        },
        {
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_TESTS_NORMALIZED,
          ),
          id: "regionsTestsNorm",
          title: "Tests per 1000 people",
          visualization: "cartogram",
          color: COLOR_TESTS,
          normalized: true,
        },
        {
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_HOSPITAL_NORMALIZED,
          ),
          id: "covidInHospital",
          title: "Covid Patients in Hospital",
          color: d3.color(COLOR_HOSPITAL).brighter(1.5),
          visualization: "cartogram",
          normalized: true,
        },
        {
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_ICU_NORMALIZED,
          ),
          id: "covidInICU",
          title: "Covid Patients in ICU",
          visualization: "cartogram",
          color: COLOR_HOSPITAL,
          normalized: true,
        },
        {
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_COVID_DEATHS_NORMALIZED,
          ),
          id: "covidDeaths",
          title: "Weekly Covid Deaths",
          visualization: "cartogram",
          color: COLOR_DEATHS,
          normalized: true,
        },
        {
          data: Data.from(
            options.data,
            Data.Fields.HEALTH_BOARD_ALL_DEATHS_NORMALIZED,
          ),
          id: "allDeaths",
          title: "Weekly All Deaths",
          visualization: "cartogram",
          color: d3.color(COLOR_DEATHS).darker(1),
          normalized: true,
        },
      ],
    };

    dashboard.createDashboard(div, config);
  }
}
