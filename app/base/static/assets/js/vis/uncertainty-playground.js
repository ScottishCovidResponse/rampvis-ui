class UncertaintyPlayground {
    CHART_WIDTH = 1000
    CHART_HEIGHT = 400

    constructor(options) {
        console.log('Input data', options.data[0]);
        d3.select('#' + options.chartElement)
            .append('div')
                .attr('class', 'vis-example-container')
                .style('width', this.CHART_WIDTH + 'px')
                .style('height', this.CHART_HEIGHT + 'px')
                .text('replace this with your visualisation of uncertainty in model runs');
    }
}