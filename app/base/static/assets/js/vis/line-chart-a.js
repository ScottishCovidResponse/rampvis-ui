class LineChartA {

    constructor(options) {
        console.log('LineChartA: constructor:', options);
        let data = options.data;
        let canvas = document.getElementById(options.chartElement);

        let CHART_WIDTH = 500;
        let CHART_HEIGHT = 250;
        if(canvas.clientWidth > 0) CHART_WIDTH = canvas.clientWidth ;
        if (canvas.clientHeight > 0) CHART_HEIGHT = canvas.clientHeight;
        console.log(canvas.clientWidth, canvas.clientHeight)

        var min_value = data.reduce((min, p) => p.value < min ? p.value : min, data[0].value);
        var max_value = data.reduce((max, p) => p.value > max ? p.value : max, data[0].value);

        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 50, bottom: 100, left: 60},
            width = CHART_WIDTH - margin.left - margin.right,
            height = CHART_HEIGHT - margin.top - margin.bottom;

        // parse the date / time
        var parser = d3.timeParse("%d/%m/%Y");

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
            .attr("viewBox", '0 0' +(CHART_WIDTH + margin.left + margin.right) + ' ' + (CHART_HEIGHT))
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
            .attr("d", valueline);

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
    }
}