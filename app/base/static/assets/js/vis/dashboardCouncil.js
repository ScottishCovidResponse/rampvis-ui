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
        console.log(allDeathData);
        const covidDeathData = Data.from(options.data, Data.Fields.COUNCIL_COVID_DEATHS);
        const vaccineData = Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP);
        console.log(vaccineData);
        

        var config = {
            layout : [
                [
                    'council',
                    'vaccinations-total'
                ],
                'vaccinations-agegroup', 
                'vaccinations-agegroup-2'
            ], 
            groups : [
                {
                    name: 'council',
                    title: 'Deaths',
                    layout: [['covidDeathData', 'allDeathData']]        
                },{
                    name: 'vaccinations-total',
                    title: 'Vaccinations Total',
                    layout: [['vaccination-total-1st', 'vaccination-total-2nd']]        
                },{
                    name: 'vaccinations-agegroup',
                    title: 'Vaccination by Age (Dose 1)',
                    layout: [   
                        ['vaccination-1', 'vaccination-2','vaccination-3',
                        'vaccination-4', 'vaccination-5','vaccination-6',
                        'vaccination-7', 'vaccination-8','vaccination-9']
                    ]
                },{
                    name: 'vaccinations-agegroup-2',
                    title: 'Vaccination by Age (Dose 2)',
                    layout: [ 
                        ['vaccination-2-1', 'vaccination-2-2','vaccination-2-3',
                        'vaccination-2-4', 'vaccination-2-5','vaccination-2-6',
                        'vaccination-2-7', 'vaccination-2-8','vaccination-2-9']
                    ]              
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
                    mode: dashboard.MODE_DAILY,
                    conditions:[
                        'index.length > 4'
                    ]
                },
                {
                    name: 'allDeathData', 
                    title: 'All Deaths',
                    dataField: 'Aberdeen City',
                    type: 'stats',
                    color: d3.color(COLOR_DEATHS).brighter(.8),
                    data: Data.from(options.data, Data.Fields.COUNCIL_ALL_DEATHS),
                    mode: dashboard.MODE_DAILY,
                    conditions:[
                        'index.length > 4'
                    ]
                },
                {
                    name: 'vaccination-total-1st', 
                    title: 'Vaccination over 18 years (1st Dose)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: COLOR_VACCINATON,
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "18 years and over"'
                    ]
                },{
                    name: 'vaccination-total-2nd', 
                    title: 'Vaccination over 18 years (2nd Dose)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(.5),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "18 years and over"'
                    ] 
                },
                // per age group
                {
                    name: 'vaccination-1', 
                    title: 'Vaccination (18-29 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(1),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "18 - 29"'
                    ]
                },
                {
                    name: 'vaccination-2', 
                    title: 'Vaccination (30-39 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(1.5),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "30 - 39"'
                    ]
                },
                {
                    name: 'vaccination-3', 
                    title: 'Vaccination (40-49 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(2),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "40 - 49"'
                    ]
                },
                {
                    name: 'vaccination-4', 
                    title: 'Vaccination (50-54 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(2.5),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "50 - 54"'
                    ]
                },
                {
                    name: 'vaccination-5', 
                    title: 'Vaccination (60-64 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(3),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "60 - 64"'
                    ]
                },
                {
                    name: 'vaccination-6', 
                    title: 'Vaccination (65-69 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(3.5),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "65 - 69"'
                    ]
                },
                {
                    name: 'vaccination-7', 
                    title: 'Vaccination (70-74 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(4),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "70 - 74"'
                    ]
                }, {
                    name: 'vaccination-8', 
                    title: 'Vaccination (75-79 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(4.5),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_CUMULATIVE, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "75 - 79"'
                    ]
                }, {
                    name: 'vaccination-9', 
                    title: 'Vaccination (80+ years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(5),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "80 years and over"'
                    ]
                },
                // Dose 2
                {
                    name: 'vaccination-2-1', 
                    title: 'Vaccination (18-29 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(1),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    detail: dashboard.DETAIL_NARROW,
                    mode: dashboard.MODE_PERCENT, 
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "18 - 29"'
                    ]
                },
                {
                    name: 'vaccination-2-2', 
                    title: 'Vaccination (30-39 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(1.5),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "30 - 39"'
                    ]
                },
                {
                    name: 'vaccination-2-3', 
                    title: 'Vaccination (40-49 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(2),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "40 - 49"'
                    ]
                },
                {
                    name: 'vaccination-2-4', 
                    title: 'Vaccination (50-54 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(2.5),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "50 - 54"'
                    ]
                },
                {
                    name: 'vaccination-2-5', 
                    title: 'Vaccination (60-64 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(3),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "60 - 64"'
                    ]
                },
                {
                    name: 'vaccination-2-6', 
                    title: 'Vaccination (65-69 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(3.5),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "65 - 69"'
                    ]
                },
                {
                    name: 'vaccination-2-7', 
                    title: 'Vaccination (70-74 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(4),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "70 - 74"'
                    ]
                }, {
                    name: 'vaccination-2-8', 
                    title: 'Vaccination (75-79 years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(4.5),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    onditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "75 - 79"'
                    ]
                }, {
                    name: 'vaccination-2-9', 
                    title: 'Vaccination (80+ years)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(5),
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: dashboard.DETAIL_NARROW,
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "80 years and over"'
                    ]
                }
            ]
        }

        dashboard.createDashboard(div, config)
    }
}