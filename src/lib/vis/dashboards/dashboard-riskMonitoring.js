/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-use-before-define */
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
/* eslint-disable no-multi-assign */
/* eslint-disable radix */

import * as d3 from "d3";
import Common from "../common";

export class RiskMonitoring {
  CHART_WIDTH = document.getElementById("charts").offsetWidth;
  CHART_HEIGHT = window.innerHeight - Common.MAIN_CONTENT_GAP;

  constructor(options) {
    console.log("Data", options.data);

    const container = d3.select("#" + options.chartElement);
    container.text("Risk monitoring");
  }
}
