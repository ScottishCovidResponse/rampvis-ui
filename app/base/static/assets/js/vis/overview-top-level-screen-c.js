// Alfie
const BOX_CHART_WIDTH = 90;
const BOX_CHART_HEIGHT = 200;

let TopLevelOverviewScreenC = {};

TopLevelOverviewScreenC.variables = {
    boards: [
        {"board": "Scotland", "abbr": "SCO", "key": "scotland", "regional_overview": "/scotland/regional-overview/sco-regional.html", "icupatients": "/scotland/detailed/sco-icupatients.html", "hospconfirmed": "/scotland/detailed/sco-hospconfirmed.html", "hospsuspected": "/scotland/detailed/sco-hospsuspected.html"},
        {"board": "NHS Western Isles", "abbr": "WeI", "key": "nhs_western_isles_scotland", "regional_overview": "/scotland/regional-overview/wei-regional.html", "icupatients": "/scotland/detailed/wei-icupatients.html", "hospconfirmed": "/scotland/detailed/wei-hospconfirmed.html", "hospsuspected": "/scotland/detailed/wei-hospsuspected.html"},
        {"board": "NHS Highland", "abbr": "Hig", "key": "nhs_highland", "regional_overview": "/scotland/regional-overview/hig-regional.html", "icupatients": "/scotland/detailed/hig-icupatients.html", "hospconfirmed": "/scotland/detailed/hig-hospconfirmed.html", "hospsuspected": "/scotland/detailed/hig-hospsuspected.html"},
        {"board": "NHS Tayside", "abbr": "Tay", "key": "nhs_tayside", "regional_overview": "/scotland/regional-overview/tay-regional.html", "icupatients": "/scotland/detailed/tay-icupatients.html", "hospconfirmed": "/scotland/detailed/tay-hospconfirmed.html", "hospsuspected": "/scotland/detailed/tay-hospsuspected.html"},
        {"board": "NHS Grampian", "abbr": "Gra", "key": "nhs_grampian", "regional_overview": "/scotland/regional-overview/gra-regional.html", "icupatients": "/scotland/detailed/gra-icupatients.html", "hospconfirmed": "/scotland/detailed/gra-hospconfirmed.html", "hospsuspected": "/scotland/detailed/gra-hospsuspected.html"},
        {"board": "NHS Shetland", "abbr": "She", "key": "nhs_shetland", "regional_overview": "/scotland/regional-overview/she-regional.html", "icupatients": "/scotland/detailed/she-icupatients.html", "hospconfirmed": "/scotland/detailed/she-hospconfirmed.html", "hospsuspected": "/scotland/detailed/she-hospsuspected.html"},
        {"board": "NHS Forth Valley", "abbr": "Fov", "key": "nhs_forth_valley", "regional_overview": "/scotland/regional-overview/fov-regional.html", "icupatients": "/scotland/detailed/fov-icupatients.html", "hospconfirmed": "/scotland/detailed/fov-hospconfirmed.html", "hospsuspected": "/scotland/detailed/fov-hospsuspected.html"},
        {"board": "NHS Fife", "abbr": "Fif", "key": "nhs_fife", "regional_overview": "/scotland/regional-overview/fif-regional.html", "icupatients": "/scotland/detailed/fif-icupatients.html", "hospconfirmed": "/scotland/detailed/fif-hospconfirmed.html", "hospsuspected": "/scotland/detailed/fif-hospsuspected.html"},
        {"board": "NHS Orkney", "abbr": "Ork", "key": "nhs_orkney", "regional_overview": "/scotland/regional-overview/ork-regional.html", "icupatients": "/scotland/detailed/ork-icupatients.html", "hospconfirmed": "/scotland/detailed/ork-hospconfirmed.html", "hospsuspected": "/scotland/detailed/ork-hospsuspected.html"},
        {"board": "NHS Ayrshire & Arran", "abbr": "A&A", "key": "nhs_ayrshire_arran", "regional_overview": "/scotland/regional-overview/aa-regional.html", "icupatients": "/scotland/detailed/aa-icupatients.html", "hospconfirmed": "/scotland/detailed/aa-hospconfirmed.html", "hospsuspected": "/scotland/detailed/aa-hospsuspected.html"},
        {"board": "NHS Greater Glasgow & Clyde", "abbr": "G&C", "key": "nhs_greater_glasgow_clyde", "regional_overview": "/scotland/regional-overview/gc-regional.html", "icupatients": "/scotland/detailed/gc-icupatients.html", "hospconfirmed": "/scotland/detailed/gc-hospconfirmed.html", "hospsuspected": "/scotland/detailed/gc-hospsuspected.html"},
        {"board": "NHS Lothian", "abbr": "Lot", "key": "nhs_lothian", "regional_overview": "/scotland/regional-overview/lot-regional.html", "icupatients": "/scotland/detailed/lot-icupatients.html", "hospconfirmed": "/scotland/detailed/lot-hospconfirmed.html", "hospsuspected": "/scotland/detailed/lot-hospsuspected.html"},
        {"board": "NHS Dumfries & Galloway", "abbr": "D&G", "key": "nhs_dumfries_galloway", "regional_overview": "/scotland/regional-overview/dg-regional.html", "icupatients": "/scotland/detailed/dg-icupatients.html", "hospconfirmed": "/scotland/detailed/dg-hospconfirmed.html", "hospsuspected": "/scotland/detailed/dg-hospsuspected.html"},
        {"board": "NHS Lanarkshire", "abbr": "Lan", "key": "nhs_lanarkshire", "regional_overview": "/scotland/regional-overview/lan-regional.html", "icupatients": "/scotland/detailed/lan-icupatients.html", "hospconfirmed": "/scotland/detailed/lan-hospconfirmed.html", "hospsuspected": "/scotland/detailed/lan-hospsuspected.html"},
        {"board": "NHS Borders", "abbr": "Bpr", "key": "nhs_borders", "regional_overview": "/scotland/regional-overview/bpr-regional.html", "icupatients": "/scotland/detailed/bpr-icupatients.html", "hospconfirmed": "/scotland/detailed/bpr-hospconfirmed.html", "hospsuspected": "/scotland/detailed/bpr-hospsuspected.html"},
        {"board": "Golden Jubilee National Hospital", "abbr": "Golden", "key": "golden_jubilee_nationalhospital", "regional_overview": "/scotland/regional-overview/golden-regional.html", "icupatients": "/scotland/detailed/golden-icupatients.html", "hospconfirmed": "/scotland/detailed/golden-hospconfirmed.html", "hospsuspected": "/scotland/detailed/golden-hospsuspected.html"},
    ]
};


TopLevelOverviewScreenC.prototype = {
    init: function(options) {
        console.log(options);

        TopLevelOverviewScreenC.prototype.createGridLayout(options.chartElement);
        TopLevelOverviewScreenC.prototype.createBoxPlot(options.data);

    },

    createGridLayout: function(grid) {
        var main_grid = document.getElementById(grid);

        $.each(TopLevelOverviewScreenC.variables.boards, function(index, item) {
            var div = '<div class="col item" id="grid-' + index + '">' +
                '<p class="title-text"><a href="' + item.regional_overview + '">' + item.abbr + '</a></p>' +
                '<div class="div-svg" id="boxplot-' +  index + '" onclick="window.location=\'' + '\';"></div>'
            '</div>';
            main_grid.innerHTML += div;
        });
    },

    createBoxPlot: function(data, chart_type) {

        console.log('createBoxPlot: ', data, chart_type);

        var max_value = 0;
        var min_value = 0;
        var row;
        for (var i = 0; i < data.length; i++) {
            row = data[i];
            for (var key in row) {
                if (key !== 'date') {
                    var vals = TopLevelOverviewScreenC.prototype.cleanValue(row[key]);
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
        var margin = {top: 30, right: 20, bottom: 60, left: 35},
            width = BOX_CHART_WIDTH - margin.left - margin.right,
            height = BOX_CHART_HEIGHT - margin.top - margin.bottom;

        // parse the date / time
        var parser = d3.timeParse("%d/%m/%Y");
        var latest_date;

        // format the data
        data.forEach(function(d, index) {
            d.date = parser(d.date);
            // get the latest date
            if (index === 0) {
                latest_date = d.date;
            } else {
                if (d.date > latest_date) {
                    latest_date = d.date;
                }
            }
        });

        $.each(TopLevelOverviewScreenC.variables.boards, function(index, item) {
            var svg = d3.select('#boxplot-' +  index).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // arrow
            svg.append("svg:defs").append("svg:marker")
                .attr("id", "triangle-right")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 10)
                .attr("refY", 0)
                .attr("markerWidth", 10)
                .attr("markerHeight", 10)
                .attr("markerUnits","userSpaceOnUse")
                .attr("orient", "180")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .style("fill", "#8B0000");

            svg.append("svg:defs").append("svg:marker")
                .attr("id", "triangle-left")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 10)
                .attr("refY", 0)
                .attr("markerWidth", 10)
                .attr("markerHeight", 10)
                .attr("markerUnits","userSpaceOnUse")
                .attr("orient", "0")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .style("fill", "#8B0000");

            var holder = [];
            var latest_number;
            // format the data
            data.forEach(function(d) {
                if (d.date === latest_date) {
                    latest_number = d[item.key];
                }
                holder.push(d[item.key]);
            });

            // Compute summary statistics used for the box:
            var data_sorted = holder.sort(d3.ascending);
            var q1 = d3.quantile(data_sorted, .25);
            var median = d3.quantile(data_sorted, .5);
            var q3 = d3.quantile(data_sorted, .75);
            var interQuantileRange = q3 - q1;
            var min = q1 - 1.5 * interQuantileRange;
            var max = q1 + 1.5 * interQuantileRange;
            var mean = d3.mean(holder);

            // Show the Y scale
            var y = d3.scaleLinear()
                .domain([min_value, max_value])
                .range([height, 0]);
            svg.call(d3.axisLeft(y));

            // a few features for the box
            var center = Math.floor(width / 2);
            var box_width = 10;

            // Show the main vertical line
            svg.append("line")
                .attr("x1", center)
                .attr("x2", center)
                .attr("y1", y(min) )
                .attr("y2", y(max) )
                .attr("stroke-width", 2)
                .attr("stroke", "black");

            svg.append("rect")
                .attr("x", center - box_width/2)
                .attr("y", y(q3) )
                .attr("height", (y(q1)-y(q3)) )
                .attr("width", box_width )
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .style("fill", "#d3d3d3");

            svg.selectAll("toto")
                .data([min, median, max])
                .enter()
                .append("line")
                .attr("x1", center - box_width/2)
                .attr("x2", center + box_width/2)
                .attr("y1", function(d){
                    return(y(d));
                })
                .attr("y2", function(d){
                    return(y(d));
                })
                .attr("stroke-width", 2)
                .attr("stroke", "black");

            // show the latest value
            svg.selectAll("latestpoint")
                .data([latest_number])
                .enter()
                .append("line")
                .attr("x1", center - box_width/2)
                .attr("x2", center + box_width/2)
                .attr("y1", function(d){
                    return(y(d));
                })
                .attr("y2", function(d){
                    return(y(d));
                })
                .attr("stroke-opacity", 0)
                .attr("class", "arrow")
                .attr("marker-end", "url(#triangle-right)")
                .attr("marker-start", "url(#triangle-left)");
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
