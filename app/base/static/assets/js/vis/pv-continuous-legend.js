/**
 * Continuous legend.
 */
pv.continuousLegend = function() {
    /**
    * Visual configs.
    */
    let margin = { top: 0, right: 10, bottom: 0, left: 10 };
    let visWidth = 960, visHeight = 600, // Size of the visualization, including margins
        width, height; // Size of the main content, excluding margins

    /**
     * Accessors.
     */
    let colorScale;

    /**
     * Data binding to DOM elements.
     */
    let data;

    /**
     * DOM.
     */
    let visContainer, // Containing the entire visualization
        xAxisContainer;

    const axisScale = d3.scaleLinear(),
        xAxis = d3.axisBottom(axisScale).ticks(5).tickSize(25);

    /**
     * Main entry of the module.
     */
    function module(selection) {
        selection.each(function(_data) {
            // Initialize
            if (!this.visInitialized) {
                visContainer = d3.select(this).append('g').attr('class', 'pv-legend');
                visContainer.append('defs')
                    .append('linearGradient')
                    .attr('id', 'linear-gradient');
                xAxisContainer = visContainer.append('g').attr('class', 'x-axis');

                this.visInitialized = true;
            }

            data = _data;
            update();
        });
    }

    /**
     * Updates the visualization when data or visual properties change.
     */
    function update() {
        /**
         * Display area.
         */
        width = visWidth - margin.left - margin.right;
        height = visHeight - margin.top - margin.bottom;
        visContainer.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        axisScale.domain(colorScale.domain())
            .range([0, width]);

        /**
         * Draw.
         */
        visContainer.select('linearGradient').selectAll('stop')
            .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale(t) })))
            .join('stop')
                .attr('offset', d => d.offset)
                .attr('stop-color', d => d.color);
        
        visContainer.selectAll('rect')
            .data([0])
            .join('rect')
            .attr('width', width)
            .attr('height', height / 2)
            .style('fill', 'url(#linear-gradient)');
        
        xAxisContainer.call(xAxis);
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