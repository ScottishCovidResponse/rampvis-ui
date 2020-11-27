/**
 * A juxtaposed visualisation of percentiles for uncertainty.
 */
pv.juxtaposedPercentiles = function() {
    /**
     * Visual configs.
     */
    const margin = { top: 15, right: 15, bottom: 30, left: 50 };

    let visWidth = 960, visHeight = 600, // Size of the visualization, including margins
        width, height; // Size of the main content, excluding margins

    /**
     * Data binding to DOM elements.
     */
    let data;

    /**
     * DOM.
     */
    let visContainer,
        xAxisContainer;

    /**
     * D3.
     */
    const xScale = d3.scaleLinear(),
        yScale = d3.scaleLinear(),
        chartScale = d3.scaleBand().paddingInner(0.15),
        xAxis = d3.axisBottom().scale(xScale),
        yAxis = d3.axisLeft().scale(yScale).ticks(5),
        medLine = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y)),
        q75Area = d3.area()
            .x(d => xScale(d.x))
            .y0(d => yScale(d.q25))
            .y1(d => yScale(d.q75)),
        q95Area = d3.area()
            .x(d => xScale(d.x))
            .y0(d => yScale(d.q5))
            .y1(d => yScale(d.q95)),
        medColors = [d3.schemeBlues[9][8], d3.schemeOranges[9][8], d3.schemeReds[9][8]],
        q75Colors = [d3.schemeBlues[9][5], d3.schemeOranges[9][5], d3.schemeReds[9][5]],
        q95Colors = [d3.schemeBlues[9][2], d3.schemeOranges[9][2], d3.schemeReds[9][2]];

    /**
     * Main entry of the module.
     */
    function module(selection) {
        selection.each(function(_data) {
            // Initialize
            if (!this.visInitialized) {
                visContainer = d3.select(this).append('g').attr('class', 'pv-template');
                xAxisContainer = visContainer.append('g').attr('class', 'x-axis');

                this.visInitialized = true;
            }

            data = process(_data);
            
            update();
        });
    }

    function process(data) {
        const tmp = data.ys.map(({ label, values }) => data.x.values.map((x, i) => ({
            x: x,
            y: 0,
            q95: values[0][i] - values[2][i],
            q75: values[1][i] - values[2][i],
            q25: values[3][i] - values[2][i],
            q5: values[4][i] - values[2][i]
        })));
        tmp.forEach((d, i) => {
            d.label = data.ys[i].label;
        });
        return tmp;
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
        xScale.domain(d3.extent(data[0], d => d.x)).range([0, width]).nice();
        chartScale.domain(data.map(d => d.label)).range([0, height]);
        const yMin = d3.min(data, d => d3.min(d, e => e.q5));
        const yMax = d3.max(data, d => d3.max(d, e => e.q95));
        yScale.domain([yMin, yMax]).range([chartScale.bandwidth(), 0]).nice();

        /**
         * Draw.
         */
        const items = visContainer.selectAll('g.item').data(data);
        items.enter().append('g').attr('class', 'item').call(enterItems)
            .merge(items).call(updateItems);
        items.exit().transition().remove();

        xAxisContainer.call(xAxis);
    }

    /**
     * Called when new items added.
     */
    function enterItems(selection) {
        selection.attr('transform', d => 'translate(0,' + chartScale(d.label) + ')');

        selection.append('path')
            .attr('class', 'q95-area')
            .attr('fill', (d, i) => data.length > 3 ? d3.schemeBlues[9][2] : q95Colors[i])
            .attr('stroke', 'none')
            .attr('d', q95Area);

        selection.append('path')
            .attr('class', 'q75-area')
            .attr('fill', (d, i) => data.length > 3 ? d3.schemeBlues[9][5] : q75Colors[i])
            .attr('stroke', 'none')
            .attr('d', q75Area);
        
        selection.append('path')
            .attr('class', 'med-line')
            .attr('fill', 'none')
            .attr('stroke', (d, i) => data.length > 3 ? d3.schemeBlues[9][8] : medColors[i])
            .style('stroke-width', '2px')
            .attr('d', medLine);

        selection.append('g').attr('class', 'y-axis').call(yAxis);
    }

    /**
     * Called when items updated.
     */
    function updateItems(selection) {
        selection.each(function(d) {
            const container = d3.select(this);
            container.attr('transform', 'translate(0,' + chartScale(d.label) + ')');
            container.select('.q95-area').attr('d', q95Area);
            container.select('.q75-area').attr('d', q75Area);
            container.select('.med-line').attr('d', medLine);
            container.select('.y-axis').call(yAxis);
        });
    }

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

    return module;
};