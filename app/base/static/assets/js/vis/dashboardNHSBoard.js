/* 
author: Benjamin Bach, bbach@ed.ac.uk
*/
var COLOR_CASES = '#e93516';    // orange
var COLOR_DEATHS = '#f0852d';   // orange
var COLOR_TESTS = '#2a9d8f';    // green
var COLOR_HOSPITAL = '#264653'; // blue

var nhsBoardField = '';
var latestUpdateTime = '';

// DATA STREAM TITLES 

class HealthBoardOverview {
    constructor(options) 
    {
        console.log('--> OPTIONs:', options);
        console.log('--> Input data:', options.data);

        var div = d3.select('#' + options.chartElement)
            .append('div')
                .attr('class', 'vis-example-container')

        // Notes: please use these
        // console.log('HEALTH_BOARD_TESTS', Data.from(options.data, Data.Fields.HEALTH_BOARD_TESTS));
        // console.log('HEALTH_BOARD_TESTS_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_TESTS_NORMALIZED));
        // console.log('HEALTH_BOARD_HOSPITAL', Data.from(options.data, Data.Fields.HEALTH_BOARD_HOSPITAL));
        // console.log('HEALTH_BOARD_HOSPITAL_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_HOSPITAL_NORMALIZED));
        // console.log('HEALTH_BOARD_ICU', Data.from(options.data, Data.Fields.HEALTH_BOARD_ICU));
        // console.log('HEALTH_BOARD_ICU_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_ICU_NORMALIZED));
        // console.log('HEALTH_BOARD_COVID_DEATHS', Data.from(options.data, Data.Fields.HEALTH_BOARD_COVID_DEATHS));
        // console.log('HEALTH_BOARD_COVID_DEATHS_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_COVID_DEATHS_NORMALIZED));
        // console.log('HEALTH_BOARD_ALL_DEATHS', Data.from(options.data, Data.Fields.HEALTH_BOARD_ALL_DEATHS));
        // console.log('HEALTH_BOARD_ALL_DEATHS_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_ALL_DEATHS_NORMALIZED));
        console.log('HEALTH_BOARD_VACCINE_SEX_AGEGROUP', Data.from(options.data, Data.Fields.HEALTH_BOARD_VACCINE_SEX_AGEGROUP));
                
        ///  NEW CODE ///
        nhsBoardField = Object.keys(options.data[0].values[0])[1];
        latestUpdateTime = console.log(options.data[0].values[options.data[0].values.length-1].index);
        var data = options.data;

        var config = {  
            layout: [
                [
                    'testing', 
                    'vaccination'
                ], 
                [
                    'deaths',
                    'hospital'
                ],
                'vaccination-agegroups'
            ],
            groups: [
                {
                    id: 'hospital',
                    title: 'Covid19 in Hospital',
                    layout: ['icu', 'hospital2', 'hospital-normalized']
                }, 
                {
                    id: 'testing',
                    title: 'Testing',
                    layout: ['dailyTests']
                }, 
                {
                    id: 'deaths',
                    title: 'Deaths',
                    layout: [['deaths-weekly', 'deaths-all']]
                },
                {
                    id: 'vaccination',
                    title: 'Vaccinations Total',
                    layout: [
                        [
                            'vaccination-total-1st', 
                            'vaccination-agegroups-dose1',
                        ],[ 
                            'vaccination-total-2nd',
                            'vaccination-agegroups-dose2'
                        ]
                    ]
                },
                {
                }
            ], 
            widgets: [
                {
                    id: 'icu', 
                    title: 'In ICU',
                    dataField: nhsBoardField,
                    color: d3.rgb(COLOR_HOSPITAL).brighter(1),
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_ICU),
                    visualization: 'linechart',
                    mode: dashboard.MODE_CURRENT,
                    detail: 'medium',
                    normalized: true
                },{
                    id: 'hospital2',
                    title: "In Hospital",
                    dataField: nhsBoardField,
                    color: d3.rgb(COLOR_HOSPITAL).brighter(2),
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_HOSPITAL),
                    visualization: 'linechart',
                    detail: 'medium',
                    mode: dashboard.MODE_CURRENT
                }, {
                    id: 'hospital-normalized',
                    title: "In Hospital, Normalized",
                    dataField: nhsBoardField,
                    color: d3.rgb(COLOR_HOSPITAL).brighter(2.5),
                    visualization: 'linechart',
                    detail: 'medium',
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_HOSPITAL_NORMALIZED),
                    mode: dashboard.MODE_CURRENT
                },{
                    id: 'dailyTests',
                    title: "Daily Tests",
                    visualization: 'linechart',
                    dataField: nhsBoardField,
                    color: COLOR_TESTS,
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_TESTS),
                    mode: dashboard.MODE_DAILY
                },{
                    id: 'deaths-weekly', 
                    title: "Covid19 related deaths (weekly)",
                    visualization: 'linechart',
                    dataField: nhsBoardField,
                    color: COLOR_DEATHS,
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_COVID_DEATHS),
                    mode: dashboard.MODE_WEEKLY,
                    conditions:[
                        'index.length > 4'
                    ]
                },{
                    id: 'deaths-all', 
                    title: "All Deaths (weekly)",
                    dataField: nhsBoardField,
                    visualization: 'linechart',
                    color: d3.rgb(COLOR_DEATHS).darker(.5),
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_ALL_DEATHS),
                    mode: dashboard.MODE_WEEKLY,
                    conditions:[
                        'index.length > 4'
                    ]
                },
                {
                    id: 'vaccination-total-1st', 
                    title: 'Total Vaccination Dose 1',
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'linechart',
                    color: COLOR_VACCINATON,
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: 'low',
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "18 years and over"'
                    ]
                },{
                    id: 'vaccination-total-2nd', 
                    title: 'Total Vaccination Dose 2',
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'linechart',
                    color: d3.color(COLOR_VACCINATON).darker(.5),
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    detail: 'low',
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "18 years and over"'
                    ] 
                },{
                    id: 'vaccination-agegroups-dose1',
                    title: 'Dose 1', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'barchart',
                    color: COLOR_VACCINATON,
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'medium',
                    bars: 'AgeGroup', 
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup.indexOf("and over") < 0'
                    ]
                },{
                    id: 'vaccination-agegroups-dose2',
                    title: 'Dose 2', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'barchart',
                    color: COLOR_VACCINATON,
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'medium',
                    bars: 'AgeGroup', 
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup.indexOf("and over") < 0'
                    ]
                }
            ]
        }

        dashboard.createDashboard(div, config)
    }
}