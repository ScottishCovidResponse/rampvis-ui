class CouncilOverview {
    CHART_WIDTH = 1000
    CHART_HEIGHT = 400

    constructor(options) {
        console.log('Input data', options.data);
        d3.select('#' + options.chartElement)
            .append('div')
                .attr('class', 'vis-example-container')
                .style('width', this.CHART_WIDTH + 'px')
                .style('height', this.CHART_HEIGHT + 'px')
                .text('an awesome visualisation');

        // This could be a way to get data without relying on stream order.
        const allDeathData = Data.from(options.data, Data.Fields.COUNCIL_ALL_DEATHS);
        const covidDeathData = Data.from(options.data, Data.Fields.COUNCIL_COVID_DEATHS);
        console.log('allDeathData', allDeathData);
        console.log('covidDeathData', covidDeathData);
    }
}