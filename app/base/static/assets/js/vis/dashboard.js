/* Namespace for dashboard functions */
dashboard = {}

var baseline_title = 22
var baseline_label = height - 30;
var top_content = baseline_title + 30;

dashboard.MODE_DAILY = 0
dashboard.MODE_CURRENT = 1
dashboard.MODE_CUMULATIVE = 2
dashboard.MODE_WEEKLY = 3

var LINE_1 = 17;
var LINE_2 = 40;
var TILE_WIDTH = 40;
var TILE_HEIGHT = 40;
var TILE_GAP = 4;


// visualizes a dataset for a dashboard with number, trend, and chart
dashboard.visualizeDataStream = function (id, title, field, color, dataStream, mode, normalized) {
    
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