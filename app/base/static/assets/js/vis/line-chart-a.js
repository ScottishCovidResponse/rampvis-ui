class LineChartA {

    constructor(options) {
        console.log('LineChartA: constructor:', options);
        let data = options.data;
        let canvas = document.getElementById(options.chartElement);

        let CHART_WIDTH = 500;
        let CHART_HEIGHT = 250;
        if (canvas.clientWidth > 0) CHART_WIDTH = canvas.clientWidth ;
        if (canvas.clientHeight > 0) CHART_HEIGHT = canvas.clientHeight;

        var min_value = data.reduce((min, p) => p.value < min ? p.value : min, data[0].value);
        var max_value = data.reduce((max, p) => p.value > max ? p.value : max, data[0].value);

        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 50, bottom: 100, left: 60},
            width = CHART_WIDTH - margin.left - margin.right,
            height = CHART_HEIGHT - margin.top - margin.bottom;

        var tooltip_linechart = d3.select("body").append("div").attr("class", "tool-tip-line-chart");

        // parse the date / time
        var parser = d3.timeParse("%d/%m/%Y");
        var bisectDate = d3.bisector(function(d) { return d.date; }).left;

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the line
        var valueline = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });

        var svg = d3.select(canvas).append("svg")
            .attr("width", CHART_WIDTH)
            .attr("height", CHART_HEIGHT)
            .attr("viewBox", '0 0 ' +(CHART_WIDTH + margin.left + margin.right) + ' ' + (CHART_HEIGHT))
            .attr("preserveAspectRatio", "xMinYMid meet")
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        svg.append("rect")
            .attr("fill", "#ffffff")
            .attr("width", CHART_WIDTH)
            .attr("height", CHART_HEIGHT);

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // format the data
        data.forEach(function(d) {
            d.date = parser(d.date);
            d.value = +d.value;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([min_value, max_value]);

        // Add the valueline path.
        g.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline)
            .on("mousemove", function(d){
                tooltip_linechart
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(d['value']);
            })
            .on("mouseout", function(d){ tooltip_linechart.style("display", "none");});

        // Add the x Axis
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%d-%b-%y")))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        // Add the y Axis
        g.append("g")
            .call(d3.axisLeft(y));

        var focus = g.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height);

        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", width)
            .attr("x2", width);

        focus.append("circle")
            .attr("r", 6);

        focus.append("text")
            .attr("x", 15)
            .attr("dy", ".31em");

        svg.append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        var format_date = d3.timeFormat("%d-%b-%y");
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.date) + "," + y(d['value']) + ")");
            focus.select("text").text(function () {
                return format_date(d.date) + '-> ' + d['value'];
            });
            focus.select(".x-hover-line").attr("y2", height - y(d['value']));
            focus.select(".y-hover-line").attr("x2", width + width);
        }
    }
}