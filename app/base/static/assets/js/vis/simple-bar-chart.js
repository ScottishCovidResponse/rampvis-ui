class SimpleBarChart {
    CHART_WIDTH = 1000;
    CHART_HEIGHT = 600;
    GAP = 10;

    constructor(options) {
        console.log('Input data', options.data);
        d3.select('#' + options.chartElement)
            .append('div')
                .attr('class', 'vis-example-container')
                .attr('id', 'vis-example-container')
                .style('width', this.CHART_WIDTH + 'px')
                .style('height', this.CHART_HEIGHT + 'px');
        
        let data = options.data[0].values;
        
        const field = Common.getValueField(data[0]);
        
        let canvas = document.getElementById("vis-example-container");
        
        let max_value = Math.max.apply(Math, data.map(function(o) { return o[field]; }));
        
        const parseDate = d3.timeParse("%Y-%m-%d");	
        
        // set the dimensions and margins of the graph
        let margin = {top: 20, right: 50, bottom: 80, left: 60},
            width = this.CHART_WIDTH - margin.left - margin.right,
            height = this.CHART_HEIGHT - margin.top - margin.bottom;
        
        data.forEach(function(d) {
           d.index = parseDate(d.index); 
        });

        //
        // TODO - should not use a global selector/variable
        //
        let tooltip_barchart = d3.select("body").append("div").attr("class", "tool-tip-bar-chart");

        let x = d3.scaleBand().range([0, width]).padding(0.2).domain(data.map(function (d) { return d.index; }));
        let y = d3.scaleLinear().rangeRound([height, 0]).domain([0, max_value]);

        let svg = d3.select(canvas).append("svg")
            .attr("width", this.CHART_WIDTH)
            .attr("height", this.CHART_HEIGHT - this.GAP);

        svg.append("rect")
            .attr("fill", "#ffffff")
            .attr("width", this.CHART_WIDTH)
            .attr("height", this.CHART_HEIGHT - this.GAP);

        let g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat("%Y-%m-%d")).tickValues(x.domain().filter(function (d, i) {
                 return !(i % 10)
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
                return x(d.index);
            })
            .attr("y", function (d) {
                return y(d[field]);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d[field]);
            })
            .attr("fill", '#4682B4')
            .on("mousemove", function(d){
                tooltip_barchart
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(d.index + '-> ' + d[field]);
            })
            .on("mouseout", function(d){ tooltip_barchart.style("display", "none");});
    }
}