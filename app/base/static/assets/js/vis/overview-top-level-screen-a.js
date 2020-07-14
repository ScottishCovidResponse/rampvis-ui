// Alfie
const CHART_WIDTH = 350;
const CHART_HEIGHT = 180;

var TopLevelOverviewScreenA = {};

TopLevelOverviewScreenA.variables = {
    boards: [
        {"board": "Scotland", "abbr": "SCO", "key": "scotland", "detailed_cumulative": "/scotland/detailed/sco-cumulative.html", "regional_overview": "/scotland/regional-overview/sco-regional.html"},
        {"board": "NHS Western Isles", "abbr": "WeI", "key": "nhs_western_isles_scotland", "detailed_cumulative": "/scotland/detailed/wei-cumulative.html", "regional_overview": "/scotland/regional-overview/wei-regional.html"},
        {"board": "NHS Highland", "abbr": "Hig", "key": "nhs_highland", "detailed_cumulative": "/scotland/detailed/hig-cumulative.html", "regional_overview": "/scotland/regional-overview/hig-regional.html"},
        {"board": "NHS Tayside", "abbr": "Tay", "key": "nhs_tayside", "detailed_cumulative": "/scotland/detailed/tay-cumulative.html", "regional_overview": "/scotland/regional-overview/tay-regional.html"},
        {"board": "NHS Grampian", "abbr": "Gra", "key": "nhs_grampian", "detailed_cumulative": "/scotland/detailed/gra-cumulative.html", "regional_overview": "/scotland/regional-overview/gra-regional.html"},
        {"board": "NHS Shetland", "abbr": "She", "key": "nhs_shetland", "detailed_cumulative": "/scotland/detailed/she-cumulative.html", "regional_overview": "/scotland/regional-overview/she-regional.html"},
        {"board": "NHS Forth Valley", "abbr": "Fov", "key": "nhs_forth_valley", "detailed_cumulative": "/scotland/detailed/fov-cumulative.html", "regional_overview": "/scotland/regional-overview/fov-regional.html"},
        {"board": "NHS Fife", "abbr": "Fif", "key": "nhs_fife", "detailed_cumulative": "/scotland/detailed/fif-cumulative.html", "regional_overview": "/scotland/regional-overview/fif-regional.html"},
        {"board": "NHS Orkney", "abbr": "Ork", "key": "nhs_orkney", "detailed_cumulative": "/scotland/detailed/ork-cumulative.html", "regional_overview": "/scotland/regional-overview/ork-regional.html"},
        {"board": "NHS Ayrshire & Arran", "abbr": "A&A", "key": "nhs_ayrshire_arran", "detailed_cumulative": "/scotland/detailed/aa-cumulative.html", "regional_overview": "/scotland/regional-overview/aa-regional.html"},
        {"board": "NHS Greater Glasgow & Clyde", "abbr": "G&C", "key": "nhs_greater_glasgow_clyde", "detailed_cumulative": "/scotland/detailed/gc-cumulative.html", "regional_overview": "/scotland/regional-overview/gc-regional.html"},
        {"board": "NHS Lothian", "abbr": "Lot", "key": "nhs_lothian", "detailed_cumulative": "/scotland/detailed/lot-cumulative.html", "regional_overview": "/scotland/regional-overview/lot-regional.html"},
        {"board": "NHS Dumfries & Galloway", "abbr": "D&G", "key": "nhs_dumfries_galloway", "detailed_cumulative": "/scotland/detailed/dg-cumulative.html", "regional_overview": "/scotland/regional-overview/dg-regional.html"},
        {"board": "NHS Lanarkshire", "abbr": "Lan", "key": "nhs_lanarkshire", "detailed_cumulative": "/scotland/detailed/lan-cumulative.html", "regional_overview": "/scotland/regional-overview/lan-regional.html"},
        {"board": "NHS Borders", "abbr": "Bpr", "key": "nhs_borders", "detailed_cumulative": "/scotland/detailed/bpr-cumulative.html", "regional_overview": "/scotland/regional-overview/bpr-regional.html"}
    ]
};

TopLevelOverviewScreenA.prototype = {
    init: function(options) {

        console.log('TopLevelOverviewScreenA: init: options = ');

        TopLevelOverviewScreenA.prototype.createGridLayout(options.chartElement);
        TopLevelOverviewScreenA.prototype.createTimeSeries(options.data);

         $(document.getElementById(options.bookmarkElement)).on('click', ()=> {
            console.log('onClickBookmark: ');
        });
    },


    createGridLayout: function(element) {
        var main_grid = document.getElementById(element);

        $.each(TopLevelOverviewScreenA.variables.boards, function(index, item) {
            var div = '<div class="col item text-center" id="grid-' + index + '">' +
                '<p class="title-text"><a href="' + item.regional_overview + '">' + item.board + '</a></p>' +
                '<div class="div-svg" id="timeseries-' + index + '" onclick="window.location=\'' + item.detailed_cumulative + '\';"></div>'
            '</div>';
            main_grid.innerHTML += div;
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
