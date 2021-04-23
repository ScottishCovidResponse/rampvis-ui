var height = 150;
var width = 510;
var baseline_title = 22
var baseline_label = height - 30;
var top_content = baseline_title + 30;
var MODE_DAILY = 0
var MODE_CURRENT = 1
var MODE_CUMULATIVE = 2
var MODE_WEEKLY = 3

var LINK_CASES = 'link-to-plot-with-all-scotland-cases';
var LINK_DEATH = 'link-to-plot-with-all-scotland-coviddeaths';
var LINK_ICU = 'link-to-plot-with-all-scotland-icu';
var PATH_NHSBOARD = 'path-to-nhsboarddashboards/';

var LINE_1 = 17;
var LINE_2 = 40;

var COLOR_CASES = '#e93516';    // orange
var COLOR_DEATHS = '#f0852d';   // orange
var COLOR_TESTS = '#2a9d8f';    // green
var COLOR_HOSPITAL = '#264653'; // blue

var TILE_WIDTH = 40;
var TILE_HEIGHT = 40;
var TILE_GAP = 4;

var NHSBOARD = 'Lothian';

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
    td2.append('h2').text('Testing')
    td2.append('div').attr('id', 'covid-deaths')
    td2.append('div').attr('id', 'all-deaths')

} 

var visualizeAllStreams = function(data)
{
    var field = 'Lothian'

    visualizeDataStream(
        "#board-hospital-normalized",
        DATASTREAM_0,
        field,
        d3.rgb(COLOR_HOSPITAL).brighter(1),
        data[0].values,
        MODE_CURRENT,
        true);

    visualizeDataStream(
        "#board-hospital",
        DATASTREAM_1,
        field,
        d3.rgb(COLOR_HOSPITAL).brighter(2),
        data[1].values,
        MODE_CURRENT);

    visualizeDataStream(
        "#board-covid-icu",
        DATASTREAM_2,
        field,
        d3.rgb(COLOR_HOSPITAL).brighter(2.5),
        data[2].values,
        MODE_CURRENT);

    visualizeDataStream(
        "#tests",
        DATASTREAM_3,
        field,
        COLOR_TESTS,
        data[3].values,
        MODE_DAILY);

    visualizeDataStream(
        "#covid-deaths",
        DATASTREAM_4,
        field,
        COLOR_DEATHS,
        data[4].values,
        MODE_WEEKLY);

    visualizeDataStream(
        "#all-deaths",
        DATASTREAM_5,
        field,
        d3.rgb(COLOR_DEATHS).darker(.5),
        data[5].values,
        MODE_WEEKLY);


}


// visualizes a dataset for a dashboard with number, trend, and chart
var visualizeDataStream = function (id, title, field, color, dataStream, mode, normalized) {
    

    var svg = d3.select(id)
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    setVisTitle(svg, title)
    visualizeNumber(svg, dataStream, 0, field, color, mode, normalized)
    visualizeTrendArrow(svg, dataStream, 250, field, color, mode)
    visualizeMiniChart(svg, dataStream, 400, field, color, mode);
}

var visualizeNumber = function (svg, data, xOffset, field, color, mode, normalized) {

    var g = svg.append("g")
        .attr("transform", "translate(" + xOffset + ",0)")

    if (mode == MODE_DAILY) {
        setVisLabel(g, 'Today')
    } else if (mode == MODE_CURRENT) {
        setVisLabel(g, 'Current')
    } else if (mode == MODE_WEEKLY) {
        setVisLabel(g, 'This week')
    } else {
        setVisLabel(g, 'Total')
    }

    var val = Math.round(data[data.length - 1][field] * 10) / 10;
    val = val.toLocaleString(
        undefined)

    var bigNumber = {}
    var t = g.append('text')
        .text(val)
        .attr('y', top_content + 40)
        .attr('class', 'bigNumber')
        .style('fill', color)
        .each(function () {
            bigNumber.width = this.getBBox().width;
        })


    if (normalized) {
        g.append('text')
            .text('per')
            .attr('x', bigNumber.width + 10)
            .attr('y', top_content + LINE_1)
            .attr('class', 'thin')
        g.append('text')
            .text('100,000')
            .attr('x', bigNumber.width + 10)
            .attr('y', top_content + LINE_2)
            .attr('class', 'thin')
    } 
    // else {
    //     // show rank
    //     var values = data[data.length - 1];
    //     var array = []
    //     for (var v in values) {
    //         array.push([v, values[v]])
    //     }
    //     array.sort(function (a, b) {
    //         return a[1] - b[1];
    //     })

    //     var rank;
    //     for (var i = 1; i < array.length - 1; i++) {
    //         if (array[i][0] == field) {
    //             rank = i;
    //             break;
    //         }
    //     }


    //     if (rank) {
    //         g.append('text')
    //             .text(function () {
    //                 if (rank == 1) return '1st';
    //                 else if (rank == 2) return '2nd';
    //                 else if (rank == 3) return '3rd';
    //                 else return rank + 'th';
    //             })
    //             .attr('x', bigNumber.width + 10)
    //             .attr('y', top_content + LINE_1)
    //             .attr('class', 'thin')
    //         g.append('text')
    //             .text('Scotland')
    //             .attr('x', bigNumber.width + 10)
    //             .attr('y', top_content + LINE_2)
    //             .attr('class', 'thin')
    //     }
    // }

}



var visualizeTrendArrow = function (svg, data, xOffset, field, color, mode) {

    var g = svg.append("g")
        .attr("transform", "translate(" + xOffset + ",0)")

    if (mode == MODE_WEEKLY)
        setVisLabel(g, "From last week")
    else
        setVisLabel(g, "From yesterday")

    var secondLast = parseInt(data[data.length - 2][field])
    var last = parseInt(data[data.length - 1][field])
    v = last - secondLast;
    r = 0
    if (v < 0) r = 45;
    if (v > 0) r = -45;

    g.append('text')
        .text(function () {
            if (v > 0) {
                return 'up by';
            } else
                if (v < 0) {
                    return 'down by';
                } else {
                    return 'no ';
                }
        })
        .attr('x', 45)
        .attr('y', top_content + LINE_1)
        .attr('class', 'thin')

    if (v == 0) {
        g.append('text')
            .text('change')
            .attr('x', 45)
            .attr('y', top_content + LINE_2)
            .attr('class', 'thin')
    } else {
        g.append('text')
            .text(Math.abs(v))
            .attr('x', 45)
            .attr('y', top_content + LINE_2)
            .style('fill', color)
    }


    var g2 = g.append('g')
        .attr('transform',
            function () {
                return 'translate(17,' + (top_content + 22) + '),rotate(' + r + ')';
            }
        );

    g2.append('line')
        .attr('x1', -15)
        .attr('x2', 15)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('class', 'arrow')
        .attr('stroke', color);
    g2.append('line')
        .attr('x1', 15)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', -15)
        .attr('class', 'arrow')
        .attr('stroke', color);
    g2.append('line')
        .attr('x1', 15)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', 15)
        .attr('class', 'arrow')
        .attr('stroke', color);

}


var visualizeMiniChart = function (svg, data, xOffset, field, color, mode) {

    var chartWidth = 100;
    var chartHeight = 35;
    var trendWindow = 14 // days
    if (mode == MODE_WEEKLY)
        trendWindow = 8

    var barWidth = (chartWidth - 10) / trendWindow;


    var gg = svg.append('g')
        .attr("transform", "translate(" + xOffset + ",0)")

    if (mode == MODE_WEEKLY) {
        setVisLabel(gg, 'Last ' + trendWindow + ' Weeks ')
    } else {
        setVisLabel(gg, 'Last ' + trendWindow + ' Days')
    }

    var g = gg.append("g")
        .attr("transform", "translate(0," + (top_content + 5) + ")")


    var x = d3.scaleLinear()
        .domain([0, trendWindow - 1])
        .range([0, chartWidth - barWidth])

    // get 7 last entries
    data = data.slice(data.length - trendWindow)

    var max = d3.max(data, function (d) {
        return parseInt(d[field]);
    })
    var y = d3.scaleLinear()
        .domain([0, max])
        .range([chartHeight, 0]);

    if (mode == MODE_CUMULATIVE
        || mode == MODE_CURRENT) {
        g.append("path")
            .datum(data)
            .attr("fill", color)
            .style('opacity', .4)
            .attr("d", d3.area()
                .x(function (d, i) { 
                    return x(i) })
                .y0(35)
                .y1(function (d) { 
                    return y(d[field]); })
            )

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(function (d, i) { return x(i) })
                .y(function (d) { return y(d[field]); })
            )

        g.append("circle")
            .attr("fill", color)
            .attr("r", 3)
            .attr("cx", x(data.length - 1))
            .attr("cy", y(data[data.length - 1][field]))
    } else {
        g.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .style("fill", function (d, i) {
                var c = color;
                if (i == 13)
                    c = d3.rgb(c).darker(1)
                return c;
            })
            .attr("x", function (d, i) {
                return x(i);
            })
            .attr("width", barWidth)
            .attr("y", function (d) { return y(d[field]); })
            .attr("height", function (d) { return chartHeight - y(d[field]); });

    }

    if (mode == MODE_DAILY
        || mode == MODE_CUMULATIVE
        || mode == MODE_CURRENT) {
        g.append('line')
            .attr('x1', x(6.9))
            .attr('x2', x(7.1))
            .attr('y1', 37)
            .attr('y2', 37)
            .attr('class', 'weekBar')
    }

}

var setVisTitle = function (g, text) {
    g.append('line')
        .attr('x1', 0)
        .attr('x2', 10000)
        .attr('y1', baseline_title + 7)
        .attr('y2', baseline_title + 7)
        .attr('class', 'separator')

    g.append('text')
        .text(text)
        .attr('class', 'title')
        .attr('y', baseline_title)
}

var setVisLabel = function (g, text) {
    g.append('text')
        .text(text)
        .attr('class', 'label')
        .attr('y', baseline_label)
}

var setVisLabelRow2 = function (g, text) {
    g.append('text')
        .text(text)
        .attr('class', 'label')
        .attr('y', baseline_label + 15)
}