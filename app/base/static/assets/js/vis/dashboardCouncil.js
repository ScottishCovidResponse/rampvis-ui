class CouncilOverview {
    CHART_WIDTH = 1000
    CHART_HEIGHT = 400

    constructor(options) {
        console.log('Input data', options.data);
        var div = d3.select('#' + options.chartElement)
            .append('div')
                .attr('class', 'vis-example-container')
                // .style('width', this.CHART_WIDTH + 'px')
                // .style('height', this.CHART_HEIGHT + 'px')
                // .text('an awesome visualisation');

        // This could be a way to get data without relying on stream order.
        const allDeathData = Data.from(options.data, Data.Fields.COUNCIL_ALL_DEATHS);
        const covidDeathData = Data.from(options.data, Data.Fields.COUNCIL_COVID_DEATHS);
        const vaccineData = Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP);
        console.log(vaccineData);
        

        var config = {
            layout : ['council'], 
            groups : [
                {
                    name: 'council',
                    title: 'Council data',
                    layout: ['covidDeathData', 'allDeathData']        
                }
            ],
            panels:[
                {
                    name: 'covidDeathData', 
                    title: 'Covid Deaths',
                    dataField: 'Aberdeen City',
                    type: 'stats',
                    color: COLOR_DEATHS,
                    data: Data.from(options.data, Data.Fields.COUNCIL_COVID_DEATHS),
                    mode: dashboard.MODE_DAILY
                },
                {
                    name: 'allDeathData', 
                    title: 'All Deaths',
                    dataField: 'Aberdeen City',
                    type: 'stats',
                    color: d3.color(COLOR_DEATHS).brighter(.8),
                    data: Data.from(options.data, Data.Fields.COUNCIL_ALL_DEATHS),
                    mode: dashboard.MODE_DAILY
                }
            ]
        }

        dashboard.createDashboard(div, config)
    }
}