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

import * as d3 from "d3";
import { pv } from "./pv"

export class SuperimposedPercentiles {
    CHART_WIDTH = 850
    CHART_HEIGHT = 450

    constructor(options) {
        const container = d3.select('#' + options.chartElement);
        container.innerHTML = '';
        const data = options.data[0].values;
        const legendData = data.ys.map(d => d.label);
        const colors = d3.schemeDark2;
        
        // Legend
        const legendContainer = container.append('div');
        const legend =  pv.legend()
            .margin({ top: 3, right: 0, bottom: 3, left: 0 })
            .colorScale(d3.scaleOrdinal()
                .domain(legendData)
                .range(colors));
        legendContainer.datum(legendData).call(legend);

        // Main vis
        const svg = container.append('svg')
            .attr('width', this.CHART_WIDTH)
            .attr('height', this.CHART_HEIGHT);
        const vis = pv.superimposedPercentiles()
            .medColors(colors)
            .width(this.CHART_WIDTH)
            .height(this.CHART_HEIGHT);
        svg.datum(data).call(vis);
    }
}