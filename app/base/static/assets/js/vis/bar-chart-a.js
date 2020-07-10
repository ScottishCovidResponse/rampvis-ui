class BarChartA {

    constructor(options) {
        console.log('BarChartA: constructor:', options);
        let data = options.data;
        let canvas = document.getElementById(options.chartElement);

        let CHART_WIDTH = 500;
        let CHART_HEIGHT = 250;
        if (canvas.clientWidth > 0) CHART_WIDTH = canvas.clientWidth ;
        if (canvas.clientHeight > 0) CHART_HEIGHT = canvas.clientHeight;


        var max_value = data.reduce((max, p) => p.value > max ? p.value : max, data[0].value);


        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 45, bottom: 65, left: 60},
            width = CHART_WIDTH - margin.left - margin.right,
            height = CHART_HEIGHT - margin.top - margin.bottom;

        //
        // TODO - should not use a global selector/variable
        //
        var tooltip = d3.select("body").append("div").attr("class", "toolTip");

        var x = d3.scaleBand().rangeRound([0, width]).padding(0.2),
            y = d3.scaleLinear().rangeRound([height, 0]);

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

        x.domain(data.map(function (d) {
            return d.date;
        }));
        y.domain([0, max_value]);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickValues(x.domain().filter(function (d, i) {
                return !(i % 5)
            })))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");


        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("class", "axis-title");

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("x", function (d) {
                return x(d.date);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .attr("fill", '#4682B4');
    }


}