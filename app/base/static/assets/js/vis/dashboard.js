/* Namespace for dashboard functions 
author: Benjamin Bach, bbach@ed.ac.uk*/
dashboard = {}

dashboard.height = 150;
dashboard.width = 510;

var baseline_title = 22
var baseline_label = dashboard.height - 30;
var top_content = baseline_title + 30;

LINE_HIGHT= 20;

dashboard.MODE_DAILY = 0
dashboard.MODE_CURRENT = 1
dashboard.MODE_CUMULATIVE = 2
dashboard.MODE_WEEKLY = 3

var LINE_1 = 17;
var LINE_2 = 40;

// Cartogram/Tilemap
var TILE_WIDTH = 40;
var TILE_HEIGHT = 40;
var TILE_GAP = 4;

var TILEMAP_LAYOUT_SCOTLAND = {
    'Ayrshire and Arran': [5, 1],
    'Borders': [6, 3],
    'Dumfries and Galloway': [6, 1],
    'Fife': [4, 2],
    'Forth Valley': [4, 1],
    'Grampian': [3, 2],
    'Greater Glasgow and Clyde': [5, 2],
    'Highland': [2, 1],
    'Lanarkshire': [6, 2],
    'Lothian': [5, 3],
    'Orkney': [1, 2],
    'Shetland': [0, 2],
    'Tayside': [3, 1],
    'Western Isles': [2, 0]
}



dashboard.createDashboard = function(div, config){

    var tr = div.append('table')
        .attr('class', 'dashboardLayout')
        .append('tr')
    var layout = config.layout;
    
    // CREATE GROUP LAYOUT
    var tdId
    for(var col=0 ; col < layout.length ; col++)
    {
        var td = tr.append('td').attr('class', 'layout')
        tdId = canonizeNames(config.layout[col]) 
        td.attr('id', tdId)

        if( typeof(layout[col]) == "string")
        {    
            addGroup(tdId, layout[col], config)
        }
        else
        {
            for(var row=0 ; row < layout[col].length ; row++)
            {
                if( typeof(layout[col][row]) == "string")
                {    
                    addGroup(tdId, layout[col][row], config)
                    tr.append('br')
                }else{
                    // for(var col2 = 0 ; col2 < layout[col][row].length ; col2++){
                    //     addGroup(tdId, layout[col][row], config)
                    // }
                }
            }    
        }
    }

    // CREATE PANEL LAYOUTS
}

var addGroup = function(parentHTMLElementId, name, config){

    console.log('\tAttach Group', name, '--> ', parentHTMLElementId)
    var group = config.groups.filter(function (el) {
        return el.name == name
    })[0];

    var divId = 'div_'+ group.name;
    var div = d3.select('#' + parentHTMLElementId)
        .append('div')
        .attr('id', divId)
        .attr('class', 'dashboard')

    // show group title
    div.append('h3')
        .attr('class', 'dashboard')
        .text(group.title)

    var layout = group.layout;
    for(var col = 0 ; col < layout.length ; col++)
    {
        if( typeof(layout[col]) == "string")
        {
            addPanel(divId, layout[col], config)  
        }else
        {
            for(var row = 0 ; row < layout[col].length ; row++)
            {
                if( typeof(layout[col][row]) == "string"){
                    addPanel(divId, layout[col][row], config)
                }else{
                    for(var col2 = 0 ; col2 < layout[col][row].length ; col2++){
                        addPanel(divId, layout[col][row][col2], config)
                    }
                }
                d3.select('#' + divId).append('br')   
            }
        }
    }
       
        // // var firstElement = group.layout[0]
        // if(typeof(firstElement) == 'string'){
        //     // new horizontal layout
        //     for(var row = 0 ; row< group.layout.length ; row++){
        //         addPanel(parentHTMLElementId, group.layout[row], config) 
        //     }
        // }else{
        //     // simple vertical layout
        //     for(var row = 0 ; row< group.layout.length ; row++){
        //         addPanel(parentHTMLElementId, group.layout[row], config) 
        //         d3.select('#' + parentHTMLElementId).append('br')
        //     }
        // }
}

var addPanel = function(parentHtmlElementId, name, config){
    
    console.log('\t\tAttach Panel: ', name, '-->', parentHtmlElementId)
    var panels = config.panels.filter(function (el) {
        return el.name == name
    });

    if (panels.length == 0){
        console.log('NO PANEL FOUND WITH NAME:', name)
        return;
    }
    var panel = panels[0];
        

    var normalized = false || (panel && panel.normalized);
    if(panel.type == 'cartogram'){
        dashboard.visulizeScotlandNHSBoardCartogram(
            parentHtmlElementId,
            panel.title, 
            panel.color, 
            panel.data,
            panel.normalized ? panel.normalized : false
        )
    }else if(panel.type == 'stats')
    {
        dashboard.visualizeDataStream(
            parentHtmlElementId,
            panel.title,
            panel.dataField,
            panel.color,
            panel.data,
            panel.mode,
            normalized);    
    }
}

var canonizeNames = function(s){
    return (String(s)).toLowerCase()
        .replaceAll(',', '-')
        .replaceAll('[', '-')
        .replaceAll(']', '-')
}


// visualizes a dataset for a dashboard with number, trend, and chart
dashboard.visualizeDataStream = function (id, title, field, color, dataStream, mode, normalized) {
    
    console.log('\t\t\tVisualizeDataStream', title, '-->', id)
    var svg = d3.select('#' + id)
        .append("svg")
        .attr("width", dashboard.width)
        .attr("height", dashboard.height)

    setVisTitle(svg, title)
    visualizeNumber(svg, dataStream, 0, field, color, mode, normalized)
    visualizeTrendArrow(svg, dataStream, 150, field, color, mode)
    visualizeMiniChart(svg, dataStream, 300, field, color, mode);
}

var visualizeNumber = function (svg, data, xOffset, field, color, mode, normalized) {

    var g = svg.append("g")
        .attr("transform", "translate(" + xOffset + ",0)")

    if (mode == dashboard.MODE_DAILY) {
        setVisLabel(g, 'Today')
    } else if (mode == dashboard.MODE_CURRENT) {
        setVisLabel(g, 'Current')
    } else if (mode == dashboard.MODE_WEEKLY) {
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

    if (mode == dashboard.MODE_WEEKLY)
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
    if (mode == dashboard.MODE_WEEKLY)
        trendWindow = 8

    var barWidth = (chartWidth - 10) / trendWindow;


    var gg = svg.append('g')
        .attr("transform", "translate(" + xOffset + ",0)")

    if (mode == dashboard.MODE_WEEKLY) {
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

    if (mode == dashboard.MODE_CUMULATIVE
        || mode == dashboard.MODE_CURRENT) 
    {
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
    } 
    else 
    {
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
            .attr("height", function (d) { return chartHeight - y(d[field]); })

    }

    if (mode == dashboard.MODE_DAILY
        || mode == dashboard.MODE_CUMULATIVE
        || mode == dashboard.MODE_CURRENT) {
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


dashboard.visulizeScotlandNHSBoardCartogram = function (id, title, color, data, normalized) 
{
    // data comes in JSON
    var svg = d3.select('#' + id)
        .append("svg")
        .attr("width", TILE_WIDTH * 4)
        .attr("height", 100 + TILE_HEIGHT * 7)

    setVisTitle(svg, title)
    svg.append('text')
        .attr('x', 0)
        .attr('y', baseline_title + 30)
        .attr('class', 'thin')
        .text('per NHS Board')

    if (normalized){
        svg.append('text')
        .attr('x', 0)
        .attr('y', baseline_title + 30 + LINE_HIGHT)
        .attr('class', 'thin')
        .text('per 1000 people')
    }

    var current = data[data.length - 1]
    var array = [];
    var max = 0
    var min = 10000000;

    for (r in current) {
        if (!(r == 'week commencing'
            || r == 'date'
            || r == 'index')) {
            array.push({ 'name': r, 'value': current[r] })
            max = Math.max(max, current[r])
            min = Math.min(min, current[r])
        }
    }
    console.log(array);

    var valueScale = d3.scaleLinear()
        .domain([0, max])
        .range([0, 1])

    svg.selectAll("rect")
        .data(array)
        .enter()
        .append('rect')
        .style('stroke', '#ccc')
        .style('fill', '#fff')
        .attr('x', function (d) {
            return TILEMAP_LAYOUT_SCOTLAND[d.name][1] * TILE_WIDTH;
        })
        .attr('y', function (d) {
            return 100 + TILEMAP_LAYOUT_SCOTLAND[d.name][0] * TILE_HEIGHT;
        })
        .attr('width', TILE_WIDTH - TILE_GAP)
        .attr('height', TILE_HEIGHT - TILE_GAP)
        .on('mouseclick', function (d) {
            window.open(PATH_NHSBOARD + d.name + ".html");
        })


    svg.selectAll(".rect")
        .data(array)
        .enter()
        .append('rect')
        .style('opacity', function (d) {
            return valueScale(d.value);
        })
        .style('fill', color)
        .attr('x', function (d) {
            return TILEMAP_LAYOUT_SCOTLAND[d.name][1] * TILE_WIDTH;
        })
        .attr('y', function (d) {
            return 100 + TILEMAP_LAYOUT_SCOTLAND[d.name][0] * TILE_HEIGHT;
        })
        .attr('width', TILE_WIDTH - TILE_GAP)
        .attr('height', TILE_HEIGHT - TILE_GAP)
    svg.selectAll("rect")

    svg.selectAll(".cartogramLabel")
        .data(array)
        .enter()
        .append('text')
        // .filter(function (d) {
        //     return d.value == max
        //         || d.value == min;
        // })
        .attr('class', 'cartogramLabel')
        .style('fill', function (d) {
            return valueScale(d.value) >= .6 ? '#fff' : '#000';
        })
        .attr('x', function (d) {
            return TILEMAP_LAYOUT_SCOTLAND[d.name][1] * TILE_WIDTH + TILE_HEIGHT * .05;
        })
        .attr('y', function (d) {
            return 100 + TILEMAP_LAYOUT_SCOTLAND[d.name][0] * TILE_HEIGHT + TILE_HEIGHT * .8;
        })
        .text(function (d) { 
            if(d.value < 9){
                return Math.round(d.value * 10) / 10
            }else if(d.value < 999){
                return Math.round(d.value)
            }else{
                return Math.round(Math.round(d.value) / 1000) + 'k'
            }
        })
        .filter(function (d) {
            return !(d.value == max
                || d.value == min);
        })
        .attr('class', 'cartogramLabel-nonextremes')

}
