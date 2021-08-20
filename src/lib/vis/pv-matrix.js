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

/**
 * Matrix visualisation.
 */

export function matrix() {
    /**
     * Visual configs.
     */
    let margin = { top: 10, right: 10, bottom: 10, left: 10 };

    let visWidth = 960, visHeight = 600, // Size of the visualization, including margins
        width, height; // Size of the main content, excluding margins

    /**
     * Data binding to DOM elements.
     */
    let data; // { rows, columns, cells: [row, column, value] }

    /**
     * DOM.
     */
    let visContainer,
        itemContainer,
        xAxisContainer,
        yAxisContainer;

    /**
     * D3.
     */
    const xScale = d3.scaleBand().padding(0.01),
        yScale = d3.scaleBand().padding(0.01),
        xAxis = d3.axisBottom(xScale),
        yAxis = d3.axisLeft(yScale);
    let colorScale;

    /**
     * Main entry of the module.
     */
    function module(selection) {
        selection.each(function(_data) {
            if (!this.visInitialized) {
                visContainer = d3.select(this).append('g').attr('class', 'pv-matrix');
                xAxisContainer = visContainer.append('g').attr('class', 'x-axis');
                yAxisContainer = visContainer.append('g').attr('class', 'y-axis');
                itemContainer = visContainer.append('g').attr('class', 'items');

                this.visInitialized = true;
            }

            data = _data;
            update();
        });
    }

    /**
     * Updates the visualization when data or display attributes changes.
     */
    function update() {
        /**
         * Display area.
         */
        width = visWidth - margin.left - margin.right;
        height = visHeight - margin.top - margin.bottom;
        visContainer.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        xAxisContainer.attr('transform', 'translate(0,' + height + ')');

        /**
         * Computation.
         */
        xScale.domain(data.columns)
            .range([0, width]);
        yScale.domain(data.rows)
            .range([height, 0]);

        /**
         * Draw.
         */
        itemContainer.selectAll('rect')
            .data(data.cells)
            .join('rect')
                .attr('fill', ({ value }) => colorScale(value))
                .attr('x', d => xScale(d.column))
                .attr('y', d => yScale(d.row))
                .attr('height', yScale.bandwidth())
                .attr('width', xScale.bandwidth())
                .append('title')
                    .text(({ value }) => value);

        xAxisContainer.call(xAxis)
            .selectAll('text')
                .style('text-anchor', 'end')
                .style('dominant-baseline', 'text-after-edge')
                .attr('transform', 'rotate(-45)');
        yAxisContainer.call(yAxis);
    }

    /**
     * Sets/gets the margin of the visualization.
     */
    module.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return this;
    };

    /**
     * Sets/gets the width of the visualization.
     */
    module.width = function(value) {
        if (!arguments.length) return visWidth;
        visWidth = value;
        return this;
    };

    /**
     * Sets/gets the height of the visualization.
     */
    module.height = function(value) {
        if (!arguments.length) return visHeight;
        visHeight = value;
        return this;
    };

    /**
     * Sets/gets the color scale.
     */
    module.colorScale = function(value) {
        if (!arguments.length) return colorScale;
        colorScale = value;
        return this;
    };

    return module;
};