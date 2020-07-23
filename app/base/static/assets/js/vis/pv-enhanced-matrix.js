/**
 * An enhanced matrix visualisation.
 */
pv.enhancedMatrix = function() {
    /**
     * Visual configs.
     */
    let margin = { top: 0, right: 0, bottom: 0, left: 0 };

    let visWidth = 960, visHeight = 600, // Size of the visualization, including margins
        width, height; // Size of the main content, excluding margins

    let summaryWidth;

    /**
     * Data binding to DOM elements.
     */
    let data; // { rows, columns, cells: [row, column, value] }

    /**
     * DOM.
     */
    let visContainer,
        itemContainer,
        rowSummaryContainer,
        xAxisContainer,
        yAxisContainer;

    /**
     * D3.
     */
    const xScale = d3.scaleBand().padding(0.01),
        yScale = d3.scaleBand().padding(0.01),
        xSummaryScale = d3.scaleBand().padding(0.05),
        ySummaryScale = d3.scaleLinear(),
        xAxis = d3.axisTop(xScale),
        yAxis = d3.axisLeft(yScale);
    let colorScale;

    /**
     * Main entry of the module.
     */
    function module(selection) {
        selection.each(function(_data) {
            if (!this.visInitialized) {
                visContainer = d3.select(this).append('g').attr('class', 'pv-enhanced-matrix');
                xAxisContainer = visContainer.append('g').attr('class', 'x-axis');
                yAxisContainer = visContainer.append('g').attr('class', 'y-axis');
                itemContainer = visContainer.append('g').attr('class', 'cells');
                rowSummaryContainer = visContainer.append('g').attr('class', 'row-summaries');

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
        summaryWidth = margin.right;
        visContainer.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        rowSummaryContainer.attr('transform', 'translate(' + width + ',0)');

        /**
         * Computation.
         */
        xScale.domain(data.columns.map(d => d.name))
            .rangeRound([0, width]);
        yScale.domain(data.rows.map(d => d.name))
            .rangeRound([0, height]);
        // xSummaryScale.domain(data.rows[0].values.map((d, i) => i))
        //     .range([0, summaryWidth]);
        // ySummaryScale.domain([0, d3.max(data.rows, d => d3.max(d.values))])
        //     .range([yScale.bandwidth(), 0])
        //     .nice();
        
        /**
         * Draw.
         */
        const rects = itemContainer.selectAll('rect')
            .data(data.cells)
            .join('rect')
                .attr('fill', ({ value }) => colorScale(value));
        rects.transition()
            .attr('x', d => xScale(d.column))
            .attr('y', d => yScale(d.row))
            .attr('height', yScale.bandwidth())
            .attr('width', xScale.bandwidth());
        rects.append('title')
            .text(({ value }) => value);

        // // Small barcharts
        // const rows = rowSummaryContainer.selectAll('g')
        //     .data(data.rows, d => d.name)
        //     .join('g')
        //     .attr('class', 'summary');
        // rows.transition()
        //     .attr('transform', ({ name }) => `translate(0, ${yScale(name)})`);
        // rows.selectAll('rect')
        //     .data(d => d.values)
        //     .join('rect')
        //         .style('fill', 'grey')
        //         .attr('x', (d, i) => xSummaryScale(i))
        //         .attr('y', ySummaryScale)
        //         .attr('height', d => yScale.bandwidth() - ySummaryScale(d))
        //         .attr('width', xSummaryScale.bandwidth());

        xAxisContainer.transition().call(xAxis)
            .selectAll('text')
                .style('text-anchor', 'start')
                .style('dominant-baseline', 'text-before-edge')
                .attr('transform', 'rotate(-90)')
                .attr('dx', '0.75em');
        yAxisContainer.transition().call(yAxis);
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