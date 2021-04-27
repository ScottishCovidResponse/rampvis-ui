var COLOR_CASES = '#e93516';    // orange
var COLOR_DEATHS = '#f0852d';   // orange
var COLOR_TESTS = '#2a9d8f';    // green
var COLOR_HOSPITAL = '#264653'; // blue

var nhsBoardField = '';
var latestUpdateTime = '';

// DATA STREAMS 
var DATASTREAM_0 = "Covid19 Patients in Hospital, Normalized";
var DATASTREAM_1 = "Covid19 Patients in Hospital";
var DATASTREAM_2 = "Covid19 Patients in ICU";
var DATASTREAM_3 = "Daily Tests";
var DATASTREAM_4 = "Covid19 related deaths (weekly)";
var DATASTREAM_5 = "'All Deaths (weekly)";

class HealthBoardOverview {
    constructor(options) 
    {
        console.log('--> OPTIONs:', options);
        console.log('--> Input data:', options.data);

        var div = d3.select('#' + options.chartElement)
            .append('div')
                .attr('class', 'vis-example-container')
                // .style('width', '400px')
                // .style('height', '1000px')
        
        ///  NEW CODE ///
        nhsBoardField = Object.keys(options.data[0].values[0])[1];
    
        latestUpdateTime = console.log(options.data[0].values[options.data[0].values.length-1].index);
     
        createDashboardLayout(div);
        visualizeAllStreams(options.data)
    }
}

var createDashboardLayout = function(div)
{
    var tr = div.append('table')
    .attr('class', 'vis-example-container')
    .append('tr')

    var td1 = tr.append('td')
    td1.append('h2').text('Hospital')
    td1.append('div').attr('id', 'board-covid-icu')
    td1.append('div').attr('id', 'board-hospital')
    td1.append('div').attr('id', 'board-hospital-normalized')

    var td2 = tr.append('td')
    td2.append('h2').text('Testing')
    td2.append('div').attr('id', 'tests')

    td2.append('h2').text('Deaths')
    td2.append('div').attr('id', 'covid-deaths')
    td2.append('div').attr('id', 'all-deaths')
} 

var visualizeAllStreams = function(data)
{
    dashboard.visualizeDataStream(
        "#board-hospital-normalized",
        DATASTREAM_0,
        nhsBoardField,
        d3.rgb(COLOR_HOSPITAL).brighter(1),
        data[0].values,
        dashboard.MODE_CURRENT,
        true);

    dashboard.visualizeDataStream(
        "#board-hospital",
        DATASTREAM_1,
        nhsBoardField,
        d3.rgb(COLOR_HOSPITAL).brighter(2),
        data[1].values,
        dashboard.MODE_CURRENT);

    dashboard.visualizeDataStream(
        "#board-covid-icu",
        DATASTREAM_2,
        nhsBoardField,
        d3.rgb(COLOR_HOSPITAL).brighter(2.5),
        data[2].values,
        dashboard.MODE_CURRENT);

    dashboard.visualizeDataStream(
        "#tests",
        DATASTREAM_3,
        nhsBoardField,
        COLOR_TESTS,
        data[3].values,
        dashboard.MODE_DAILY);
        
    dashboard.visualizeDataStream(
        "#covid-deaths",
        DATASTREAM_4,
        nhsBoardField,
        COLOR_DEATHS,
        data[4].values,
        dashboard.MODE_WEEKLY);

    dashboard.visualizeDataStream(
        "#all-deaths",
        DATASTREAM_5,
        nhsBoardField,
        d3.rgb(COLOR_DEATHS).darker(.5),
        data[5].values,
        dashboard.MODE_WEEKLY);
}