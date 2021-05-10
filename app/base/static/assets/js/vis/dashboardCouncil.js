class CouncilOverview {
    CHART_WIDTH = 1000
    CHART_HEIGHT = 400

    // You can print each endpoint and select a unique part of the endpoint. 
    // Do NOT include stream-specific parts such as field=Aberdeen City.
    END_POINTS = {
        'all_deaths': 'component=council_area/week-all_deaths',
        'covid_deaths': 'component=council_area/week-covid_related_deaths'
    }

    constructor(options) {
        console.log('Input data', options.data);
        d3.select('#' + options.chartElement)
            .append('div')
                .attr('class', 'vis-example-container')
                .style('width', this.CHART_WIDTH + 'px')
                .style('height', this.CHART_HEIGHT + 'px')
                .text('an awesome visualisation');

        // This could be a way to get data without relying on stream order.
        const allDeathData = options.data.find(d => d.endpoint.includes(this.END_POINTS['all_deaths'])).values;
        const covidDeathData = options.data.find(d => d.endpoint.includes(this.END_POINTS['covid_deaths'])).values;
        console.log('allDeathData', allDeathData);
        console.log('covidDeathData', covidDeathData);
    }
}