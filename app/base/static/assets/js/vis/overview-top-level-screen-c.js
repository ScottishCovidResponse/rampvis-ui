// Alfie
const BOX_CHART_WIDTH = 90;
const BOX_CHART_HEIGHT = 200;

class TopLevelOverviewScreenC {

    boards = Common.scotlandBoards

    constructor(options) {
        console.log('TopLevelOverviewScreenC: options = ', options);

        this.createGridLayout(options.chartElement, options.chartElement);
        this.createBoxPlot(options.data, options.chartElement);
    }

    createGridLayout(grid, chart_type) {
        var main_grid = document.getElementById(grid);
        $(main_grid).css( {"max-width": "390px", "display": "grid", "grid-template-columns": "auto auto auto auto", "padding": "10px", "margin-left": "auto", "margin-right": "auto"})

        $.each(this.boards, (index, item) => {

            console.log('index = ', index, 'item = ', item);

            var div = '<div class="col item" id="grid-' + chart_type + '-' + index + '">' +
                '<p class="title-text"><a href="' + item.regional_overview + '">' + item.abbr + '</a></p>' +
                '<div class="div-svg" id="boxplot-' + chart_type + '-' +  index + '" onclick="window.location=\'' + '\';"></div>'
            '</div>';
            main_grid.innerHTML += div;
        });
    }

    createBoxPlot(data, chart_type) {

        console.log('createBoxPlot: ', data, chart_type);

        var max_value = 0;
        var min_value = 0;
        var row;
        for (var i = 0; i < data.length; i++) {
            row = data[i];
            for (var key in row) {
                if (key !== 'date') {
                    var vals = this.cleanValue(row[key]);
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

        $.each(this.boards, function(index, item) {
            var svg = d3.select('#boxplot-' + chart_type + '-' +  index).append("svg")
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
    }

    cleanValue(string) {
        if(string === '*' || string === 'N/A') {
            return 0;
        } else {
            return parseInt(string.replace(',',''));
        }
    }
}
