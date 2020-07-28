// Alfie
const CHART_WIDTH = 350;
const CHART_HEIGHT = 180;

var TopLevelOverviewScreenA = {};

TopLevelOverviewScreenA.variables = {
    boards: Common.scotlandBoards
};

TopLevelOverviewScreenA.prototype = {
    init: function(options) {

        console.log('TopLevelOverviewScreenA: init: options = ');

        TopLevelOverviewScreenA.prototype.createGridLayout(options.chartElement, options.links);
        TopLevelOverviewScreenA.prototype.createTimeSeries(options.data);

         $(document.getElementById(options.bookmarkElement)).on('click', ()=> {
            console.log('TopLevelOverviewScreenA: onClickBookmark: ');
        });
    },


    createGridLayout: function(element, links) {
        var main_grid = document.getElementById(element);

        let regionalLinks = links['regional']
        console.log('overviewLinks = ', regionalLinks)

        let boardLinks = links['board']

        let row;
        $.each(TopLevelOverviewScreenA.variables.boards, function(index, item) {
            if (index === 0 || index % 3 === 0) {
                row = document.createElement('div');
                $(row).addClass('row');
                main_grid.append(row);
            }

            var div = '<div class="col item text-center" id="grid-' + index + '">' +
                '<p class="title-text"><a href="' + boardLinks[index] + '">' + item.board + '</a></p>' +
                '<div class="div-svg" id="timeseries-' + index + '" onclick="window.location=\'' + regionalLinks[index] + '\';"></div>'
                '</div>';

            row.innerHTML += div;
        });
    },

    createTimeSeries: function(data) {
        var max_value = 0;
        var min_value = 0;
        var row;
        for (var i = 0; i < data.length; i++) {
            row = data[i];
            for(var key in row){
                if(key !== 'date') {
                    var vals = TopLevelOverviewScreenA.prototype.cleanValue(row[key]);
                    if (vals < min_value) {
                        min_value = vals;
                    }
                    if (vals > max_value) {
                        max_value = vals;
                    }
                    data[i][key] = vals;
                }
            }
        }

        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 55, left: 40},
            width = CHART_WIDTH - margin.left - margin.right,
            height = CHART_HEIGHT - margin.top - margin.bottom;

        // parse the date / time
        var parser = d3.timeParse("%d/%m/%Y");

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // format the data
        data.forEach(function(d) {
            d.date = parser(d.date);
        });

        $.each(TopLevelOverviewScreenA.variables.boards, function(index, item) {
            // define the line
            var valueline = d3.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d[item.key]); });

            var svg = d3.select("#timeseries-"+index).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // format the data
            data.forEach(function(d) {
                d[item.key] = +d[item.key];
            });

            // Scale the range of the data
            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain([min_value, max_value]);

            // Add the valueline path.
            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", valueline);

            // Add the x Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x)
                    .tickFormat(d3.timeFormat("%d-%b-%y")))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");

            // Add the y Axis
            svg.append("g")
                .call(d3.axisLeft(y));
        });
    },

    cleanValue: function(string) {
        if(string === '*' || string === 'N/A') {
            return 0;
        } else {
            return parseInt(string.replace(',',''));
        }
    }
}
