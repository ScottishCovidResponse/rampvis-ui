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
import { Data } from "../data.js";
import { dashboard } from "./dashboard";
import { colors } from "../colors.js";

export class DashboardScotlandCouncil {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 400;

  constructor(options) {
    console.log("Input data", options.data);
    var div = d3
      .select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container");

    var council = options.data[0].description;

    const covidDeathData = Data.from(
      options.data,
      Data.Fields.COUNCIL_COVID_DEATHS,
    );
    console.log("allDeathData:", covidDeathData[0]);

    const vaccineData = Data.from(
      options.data,
      Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
    );

    var config = {
      links: [options.parentLink],
      layout: [
        ["council", "vaccinations-total"],
        "vaccinations-agegroup",
        "vaccinations-agegroup-2",
      ],
      groups: [
        {
          id: "council",
          title: "Deaths",
          layout: ["covidDeathData"],
        },
        {
          id: "vaccinations-total",
          title: "Covid-19 Vaccinations Total %",
          layout: [["vaccination-total-1st", "vaccination-total-2nd"]],
        },
        {
          id: "vaccinations-agegroup",
          title: "Dose 1 by age group",
          layout: [
            [
              "vaccination-1",
              "vaccination-2",
              "vaccination-3",
              "vaccination-4",
              "vaccination-5",
              "vaccination-6",
              "vaccination-7",
              "vaccination-8",
              "vaccination-9",
            ],
          ],
        },
        {
          id: "vaccinations-agegroup-2",
          title: "Dose 2 by age group",
          layout: [
            [
              "vaccination-2-1",
              "vaccination-2-2",
              "vaccination-2-3",
              "vaccination-2-4",
              "vaccination-2-5",
              "vaccination-2-6",
              "vaccination-2-7",
              "vaccination-2-8",
              "vaccination-2-9",
            ],
          ],
        },
      ],
      widgets: [
        {
          id: "covidDeathData",
          title: "Daily Covid Deaths",
          dataField: council,
          visualization: "linechart",
          color: colors.getDeathColor(),
          data: Data.from(options.data, Data.Fields.COUNCIL_COVID_DEATHS),
          cumulative: false,
          detail: dashboard.DETAIL_HIGHT,
          conditions: ["index.length > 4"],
          min: 0,
        },
        {
          id: "vaccination-total-1st",
          title: "Vaccination over 18 years (1st Dose)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(1),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_HIGH,
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 1"',
            'AgeGroup == "18 years and over"',
          ],
        },
        {
          id: "vaccination-total-2nd",
          title: "Vaccination over 18 years (2nd Dose)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(2),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          min: 0,
          max: 100,
          unit: "%",
          detail: dashboard.DETAIL_HIGH,
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 2"',
            'AgeGroup == "18 years and over"',
          ],
        },
        // per age group
        {
          id: "vaccination-1",
          title: "Vaccination (18-29 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(1),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 1"',
            'AgeGroup == "18 - 29"',
          ],
        },
        {
          id: "vaccination-2",
          title: "Vaccination (30-39 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 1"',
            'AgeGroup == "30 - 39"',
          ],
        },
        {
          id: "vaccination-3",
          title: "Vaccination (40-49 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 1"',
            'AgeGroup == "40 - 49"',
          ],
        },
        {
          id: "vaccination-4",
          title: "Vaccination (50-54 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 1"',
            'AgeGroup == "50 - 54"',
          ],
        },
        {
          id: "vaccination-5",
          title: "Vaccination (60-64 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 1"',
            'AgeGroup == "60 - 64"',
          ],
        },
        {
          id: "vaccination-6",
          title: "Vaccination (65-69 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 1"',
            'AgeGroup == "65 - 69"',
          ],
        },
        {
          id: "vaccination-7",
          title: "Vaccination (70-74 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 1"',
            'AgeGroup == "70 - 74"',
          ],
        },
        {
          id: "vaccination-8",
          title: "Vaccination (75-79 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 1"',
            'AgeGroup == "75 - 79"',
          ],
        },
        {
          id: "vaccination-9",
          title: "Vaccination (80+ years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 1"',
            'AgeGroup == "80 years and over"',
          ],
        },
        // Dose 2
        {
          id: "vaccination-2-1",
          title: "Vaccination (18-29 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(2),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 2"',
            'AgeGroup == "18 - 29"',
          ],
        },
        {
          id: "vaccination-2-2",
          title: "Vaccination (30-39 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(2),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 2"',
            'AgeGroup == "30 - 39"',
          ],
        },
        {
          id: "vaccination-2-3",
          title: "Vaccination (40-49 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(2),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 2"',
            'AgeGroup == "40 - 49"',
          ],
        },
        {
          id: "vaccination-2-4",
          title: "Vaccination (50-54 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(2),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 2"',
            'AgeGroup == "50 - 54"',
          ],
        },
        {
          id: "vaccination-2-5",
          title: "Vaccination (60-64 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(2),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 2"',
            'AgeGroup == "60 - 64"',
          ],
        },
        {
          id: "vaccination-2-6",
          title: "Vaccination (65-69 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(2),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 2"',
            'AgeGroup == "65 - 69"',
          ],
        },
        {
          id: "vaccination-2-7",
          title: "Vaccination (70-74 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(2),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 2"',
            'AgeGroup == "70 - 74"',
          ],
        },
        {
          id: "vaccination-2-8",
          title: "Vaccination (75-79 years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(2),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 2"',
            'AgeGroup == "75 - 79"',
          ],
        },
        {
          id: "vaccination-2-9",
          title: "Vaccination (80+ years)",
          dataField: "CumulativePercentCoverage",
          visualization: "linechart",
          color: colors.getVaccinationColor(2),
          data: Data.from(
            options.data,
            Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP,
          ),
          cumulative: true,
          unit: "%",
          min: 0,
          max: 100,
          detail: dashboard.DETAIL_LOW,
          layout: "horizontal",
          conditions: [
            'Sex == "Total"',
            'Dose == "Dose 2"',
            'AgeGroup == "80 years and over"',
          ],
        },
      ],
    };

    dashboard.createDashboard(div, config);
  }
}
