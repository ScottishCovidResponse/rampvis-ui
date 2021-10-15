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
import Common from "./common";
import { pv } from "./pv";

export class MirroredStackedAreaChart {
  CHART_WIDTH = 1000;
  CHART_HEIGHT = 600;

  constructor(options) {
    const data = Common.processDataMirroredChart(options.data);
    const container = d3.select("#" + options.chartElement);
    container.innerHTML = "";

    const vis = pv
      .mirroredStackedAreaChart()
      .margin({ top: 10, right: 20, bottom: 40, left: 40 })
      .colorScale(Common.Colors.AGE_GROUP_SCALE)
      .width(this.CHART_WIDTH)
      .height(this.CHART_HEIGHT)
      .splitAttribute("splitAttribute");
    const legend = pv
      .legend()
      .margin({ top: 3, right: 3, bottom: 3, left: 50 })
      .colorScale(Common.Colors.AGE_GROUP_SCALE);

    const legendContainer = container.append("div");
    const svg = container
      .append("svg")
      .attr("width", this.CHART_WIDTH)
      .attr("height", this.CHART_HEIGHT);

    svg.datum(data).call(vis);
    legendContainer.datum(data.columns).call(legend);
  }
}
