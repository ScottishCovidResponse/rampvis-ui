/**
 * Combined Stacked Bar Chart and Line Chart.
 */
pv.stackedBarLineChart = function() {
    /**
     * Visual configs.
     */
    let margin = { top: 10, right: 10, bottom: 10, left: 10 };

    let visWidth = 960, visHeight = 600, // Size of the visualization, including margins
        width, height; // Size of the main content, excluding margins

    /**
     * Accessors.
     */
    let label = d => d.label;

    /**
     * Data binding to DOM elements.
     */
    let data; // { barColumns, lineColumns, [] }

    /**
     * DOM.
     */
    let visContainer,
        barContainer,
        xAxisContainer,
        yAxisContainer;

    /**
     * D3.
     */
    const xScale = d3.scaleBand().padding(0.1),
        yScale = d3.scaleLinear(),
        xAxis = d3.axisBottom().scale(xScale).ticks(d3.timeWeek),
        yAxis = d3.axisLeft().scale(yScale).ticks(5),
        line = d3.line()
            .x(d => xScale(d.label) + xScale.bandwidth() / 2)
            .y(d => yScale(d.value));
    let colorScale;

    /**
     * Main entry of the module.
     */
    function module(selection) {
        selection.each(function(_data) {
            if (!this.visInitialized) {
                visContainer = d3.select(this).append('g').attr('class', 'pv-stacked-bar-chart');
                xAxisContainer = visContainer.append('g').attr('class', 'x-axis');
                yAxisContainer = visContainer.append('g').attr('class', 'y-axis');
                barContainer = visContainer.append('g').attr('class', 'bars');
                lineContainer = visContainer.append('g').attr('class', 'lines');

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
        const barSeries = d3.stack().keys(data.barColumns)(data);
        const lineSeries = data.lineColumns.map(c => ({
            key: c,
            items: data.map(d => ({
                label: label(d),
                value: d[c]
            }))
        }));
        
        xScale.domain(data.map(label))
            .range([0, width]);
        yScale.domain([0, d3.max(barSeries, d => d3.max(d, d => d[1]))]).nice()
            .range([height, 0]);
        
        /**
         * Draw.
         */
        barContainer.selectAll('g')
            .data(barSeries)
            .join('g')
                .attr('fill', ({ key }) => colorScale(key))
            .selectAll('rect')
                .data(d => d)
                .join('rect')
                    .attr('x', d => xScale(label(d.data)))
                    .attr('y', d => yScale(d[1]))
                    .attr('height', d => yScale(d[0]) - yScale(d[1]))
                    .attr('width', xScale.bandwidth())
                .append('title')
                    .text(function(d) {
                        const key = d3.select(this.parentNode.parentNode).datum().key;
                        return `${label(d.data)}: ${key} (${(d.data[key])})`;
                    });

        lineContainer.selectAll('path')
            .data(lineSeries)
            .join('path')
                .style('stroke',  ({ key }) => colorScale(key))
                .style('stroke-width', '2px')
                .style('fill', 'none')
                .attr('d', d => line(d.items));
        lineContainer.selectAll('g')
            .data(lineSeries)
            .join('g')
            .selectAll('circle')
                .data(d => d.items)
                .join('circle')
                    .style('fill', function() { return colorScale(d3.select(this.parentNode).datum().key); })
                    .attr('cx', d => xScale(d.label) + xScale.bandwidth() / 2)
                    .attr('cy', d => yScale(d.value))
                    .attr('r', 3);

        xAxisContainer.call(xAxis)
            .selectAll('text')
                .attr('transform', 'rotate(-30)')
                .attr('dx', '-.5em')
                .attr('dy', '1em')
        xAxisContainer.selectAll('.tick').each(function() {
            const trans = d3.select(this).attr('transform');
            const coords = trans.substring(trans.indexOf('(') + 1, trans.indexOf(')'));
            const [x, y] = coords.split(',');
            // Move tick half a bandwidth back
            d3.select(this).attr('transform', `translate(${x - xScale.bandwidth() * 0.55}, ${y})`);
        });
            
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