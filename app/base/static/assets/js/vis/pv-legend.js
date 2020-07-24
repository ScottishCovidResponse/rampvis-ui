/**
 * Categorical legend.
 */
pv.legend = function() {
    /**
    * Visual configs.
    */
    let margin = { top: 3, right: 3, bottom: 3, left: 3 };

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
        itemContainer;

    /**
     * Main entry of the module.
     */
    function module(selection) {
        selection.each(function(_data) {
            // Initialize
            if (!this.visInitialized) {
                visContainer = d3.select(this).append('div').attr('class', 'pv-legend');
                itemContainer = visContainer.append('div').attr('class', 'items');

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
        // Update according to possible config changes
        visContainer.style('margin', margin.top + 'px ' + margin.right + 'px ' + margin.bottom + 'px ' + margin.left + 'px');

        /**
         * Draw.
         */
        const items = itemContainer.selectAll('.item').data(data);
        items.enter().append('div').attr('class', 'item').call(enterItems)
            .merge(items).call(updateItems);
        items.exit().remove();
    }

    /**
     * Called when new items added.
     */
    function enterItems(selection) {
        selection.style('display', 'inline-block');
        selection.append('div')
            .attr('class', 'box')
            .style('width', '15px')
            .style('height', '15px')
            .style('display', 'inline-block')
            .style('position', 'relative')
            .style('top', '2px');
        selection.append('span')
            .style('margin-left', '3px')
            .style('margin-right', '15px');
    }

    /**
     * Called when items updated.
     */
    function updateItems(selection) {
        selection.each(function(d) {
            const container = d3.select(this);
            container.select('.box').style('background-color', colorScale(d.name || d));
            container.select('span').text(d.label || d);
        });
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
     * Sets/gets the color scale.
     */
    module.colorScale = function(value) {
        if (!arguments.length) return colorScale;
        colorScale = value;
        return this;
    };

    return module;
};