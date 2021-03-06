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
        console.log('HEALTH_BOARD_TESTS', Data.from(options.data, Data.Fields.HEALTH_BOARD_TESTS));
        console.log('HEALTH_BOARD_TESTS_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_TESTS_NORMALIZED));
        console.log('HEALTH_BOARD_HOSPITAL', Data.from(options.data, Data.Fields.HEALTH_BOARD_HOSPITAL));
        console.log('HEALTH_BOARD_HOSPITAL_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_HOSPITAL_NORMALIZED));
        console.log('HEALTH_BOARD_ICU', Data.from(options.data, Data.Fields.HEALTH_BOARD_ICU));
        console.log('HEALTH_BOARD_ICU_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_ICU_NORMALIZED));
        console.log('HEALTH_BOARD_COVID_DEATHS', Data.from(options.data, Data.Fields.HEALTH_BOARD_COVID_DEATHS));
        console.log('HEALTH_BOARD_COVID_DEATHS_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_COVID_DEATHS_NORMALIZED));
        console.log('HEALTH_BOARD_ALL_DEATHS', Data.from(options.data, Data.Fields.HEALTH_BOARD_ALL_DEATHS));
        console.log('HEALTH_BOARD_ALL_DEATHS_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_ALL_DEATHS_NORMALIZED));
        console.log('HEALTH_BOARD_VACCINE_SEX_AGEGROUP', Data.from(options.data, Data.Fields.HEALTH_BOARD_VACCINE_SEX_AGEGROUP));
                
        ///  NEW CODE ///
        nhsBoardField = Object.keys(options.data[0].values[0])[1];
        latestUpdateTime = console.log(options.data[0].values[options.data[0].values.length-1].index);
        var data = options.data;

        var config = {  
            layout: [['testing', 'vaccination'], ['deaths','hospital']],
            groups: [
                {
                    name: 'hospital',
                    title: 'Covid19 in Hospital',
                    layout: ['icu', 'hospital2', 'hospital-normalized']
                }, 
                {
                    name: 'testing',
                    title: 'Testing',
                    layout: ['dailyTests']
                }, 
                {
                    name: 'deaths',
                    title: 'Deaths',
                    layout: [['deaths-weekly', 'deaths-all']]
                },
                {
                    name: 'vaccination',
                    title: 'Vaccination',
                    layout: [['vaccination-total-1st', 'vaccination-total-2nd']]
                }
            ], 
            panels:[
                {
                    name: 'icu', 
                    title: 'In ICU',
                    dataField: nhsBoardField,
                    color: d3.rgb(COLOR_HOSPITAL).brighter(1),
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_ICU),
                    type: 'stats',
                    mode: dashboard.MODE_CURRENT,
                    detail: 'compact',
                    normalized: true
                },{
                    name: 'hospital2',
                    title: "In Hospital",
                    dataField: nhsBoardField,
                    color: d3.rgb(COLOR_HOSPITAL).brighter(2),
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_HOSPITAL),
                    type: 'stats',
                    detail: 'compact',
                    mode: dashboard.MODE_CURRENT
                }, {
                    name: 'hospital-normalized',
                    title: "In Hospital, Normalized",
                    dataField: nhsBoardField,
                    color: d3.rgb(COLOR_HOSPITAL).brighter(2.5),
                    type: 'stats',
                    detail: 'compact',
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_HOSPITAL_NORMALIZED),
                    mode: dashboard.MODE_CURRENT
                },{
                    name: 'dailyTests',
                    title: "Daily Tests",
                    type: 'stats',
                    dataField: nhsBoardField,
                    color: COLOR_TESTS,
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_TESTS),
                    mode: dashboard.MODE_DAILY
                },{
                    name: 'deaths-weekly', 
                    title: "Covid19 related deaths (weekly)",
                    type: 'stats',
                    dataField: nhsBoardField,
                    color: COLOR_DEATHS,
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_COVID_DEATHS),
                    mode: dashboard.MODE_WEEKLY,
                    conditions:[
                        'index.length > 4'
                    ]
                },{
                    name: 'deaths-all', 
                    title: "All Deaths (weekly)",
                    dataField: nhsBoardField,
                    type: 'stats',
                    color: d3.rgb(COLOR_DEATHS).darker(.5),
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_ALL_DEATHS),
                    mode: dashboard.MODE_WEEKLY,
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
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_VACCINE_SEX_AGEGROUP),
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
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT, 
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "18 years and over"'
                    ] 
                },
            ]
        }

        dashboard.createDashboard(div, config)
    }
}