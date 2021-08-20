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
import Common from "./common";
import { pv } from "./pv"

export class NewMatrix {
    CHART_WIDTH = 500;
    CHART_HEIGHT = 500;

    constructor(options) {
        const data = this.processData(options.data);
        const container = d3.select('#' + options.chartElement);
        container.innerHTML = '';

        const vis = pv.matrix()
            .margin({ top: 10, right: 10, bottom: 100, left: 100 })
            .colorScale(Common.Colors.CORRELATION_SCALE)
            .width(this.CHART_WIDTH)
            .height(this.CHART_HEIGHT);
        const legend = pv.continuousLegend()
            .colorScale(Common.Colors.CORRELATION_SCALE)
            .width(this.CHART_WIDTH)
            .height(40);

        const legendContainer = container.append('svg')
            .attr('width', this.CHART_WIDTH)
            .attr('height', 40)
            .style('display', 'block');
        const svg = container.append('svg')
            .attr('width', this.CHART_WIDTH)
            .attr('height', this.CHART_HEIGHT);

        svg.datum(data).call(vis);
        legendContainer.datum([]).call(legend);
    }

    processData(data) {
        
        let values = data[0].values;
        let rowNames = values.var1_names;
        let columnNames = values.var2_names;
        let pearsonrItems=values.pearsonr;

        const newData={
            "rows": [],
            "columns": [],
            "cells":[],
            "orderings": [
                {
                    "name": "A-Z",
                    "description": "alphabetically from A to Z",
                    "orders": []
                },
                {
                    "name": "Z-A",
                    "description": "reversed alphabetically from Z to A",
                    "orders": []
                }
            ], 
            
        }

        newData.rows = rowNames;
        newData.columns = columnNames;
        newData.orderings[0].orders = rowNames;
        newData.orderings[1].orders = rowNames.slice().reverse();

        pearsonrItems.forEach((valueItem,rowIndex) => {
            for(let i in valueItem){
                newData.cells.push(
                    {
                        "row": rowNames[rowIndex],
                        "column": columnNames[i],
                        "value": valueItem[i]
                    }
                )
            }
        })

        return newData;
    }
}