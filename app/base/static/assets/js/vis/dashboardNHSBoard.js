var COLOR_CASES = '#e93516';    // orange
var COLOR_DEATHS = '#f0852d';   // orange
var COLOR_TESTS = '#2a9d8f';    // green
var COLOR_HOSPITAL = '#264653'; // blue

var nhsBoardField = '';
var latestUpdateTime = '';

// DATA STREAM TITLES 
var DATASTREAM_0 = "Covid19 Patients in Hospital, Normalized";
var DATASTREAM_1 = "Covid19 Patients in Hospital";
var DATASTREAM_2 = "Covid19 Patients in ICU";
var DATASTREAM_3 = "Daily Tests";
var DATASTREAM_4 = "Covid19 related deaths (weekly)";
var DATASTREAM_5 = "All Deaths (weekly)";


class HealthBoardOverview {
    constructor(options) 
    {
        console.log('--> OPTIONs:', options);
        console.log('--> Input data:', options.data);

        var div = d3.select('#' + options.chartElement)
            .append('div')
                .attr('class', 'vis-example-container')

                
        ///  NEW CODE ///
        nhsBoardField = Object.keys(options.data[0].values[0])[1];
        latestUpdateTime = console.log(options.data[0].values[options.data[0].values.length-1].index);
        var data = options.data;

        var config = {  
            layout: ['hospital',['testing', 'deaths']],
            groups: [
                {
                    name: 'hospital',
                    title: 'Hospital',
                    layout: [['icu','hospital2', 'hospital-normalized']]
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
                }
            ], 
            panels:[
                {
                    name: 'icu', 
                    title: DATASTREAM_0,
                    dataField: nhsBoardField,
                    color: d3.rgb(COLOR_HOSPITAL).brighter(1),
                    data: data[0].values,
                    type: 'stats',
                    mode: dashboard.MODE_CURRENT,
                    normalized: true
                },{
                    name: 'hospital2',
                    title: DATASTREAM_1,
                    dataField: nhsBoardField,
                    color: d3.rgb(COLOR_HOSPITAL).brighter(2),
                    data: data[1].values,
                    type: 'stats',
                    mode: dashboard.MODE_CURRENT
                }, {
                    name: 'hospital-normalized',
                    title: DATASTREAM_2,
                    dataField: nhsBoardField,
                    color: d3.rgb(COLOR_HOSPITAL).brighter(2.5),
                    type: 'stats',
                    data: data[2].values,
                    mode: dashboard.MODE_CURRENT
                },{
                    name: 'dailyTests',
                    title: DATASTREAM_3,
                    type: 'stats',
                    dataField: nhsBoardField,
                    color: COLOR_TESTS,
                    data: data[3].values,
                    mode: dashboard.MODE_DAILY
                },{
                    name: 'deaths-weekly', 
                    title: DATASTREAM_4,
                    type: 'stats',
                    dataField: nhsBoardField,
                    color: COLOR_DEATHS,
                    data: data[4].values,
                    mode: dashboard.MODE_WEEKLY
                },{
                    name: 'deaths-all', 
                    title: DATASTREAM_5,
                    dataField: nhsBoardField,
                    type: 'stats',
                    color: d3.rgb(COLOR_DEATHS).darker(.5),
                    data: data[5].values,
                    mode: dashboard.MODE_WEEKLY
                }
            ]
        }

        dashboard.createDashboard(div, config)
    }
}