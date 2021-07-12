class SimpleLineChart {
    /*
    CHART_WIDTH = 1000;
    CHART_HEIGHT = 600;
    */
    CHART_WIDTH = window.innerWidth - 260;//side bar width is 260
    CHART_HEIGHT = window.innerHeight;
    GAP = 10;

    constructor(options) {
        let gap = this.GAP; //pass gap to resize function
       
        d3.select('#' + options.chartElement)
            .append('div')
                .attr('class', 'vis-example-container')
                .attr('id', 'vis-example-container')
                .style('width', this.CHART_WIDTH + 'px')
                .style('height', this.CHART_HEIGHT + 'px');
        
        let data = options.data[0].values;
        const field = Common.getValueField(data[0]);
        
        let canvas = document.getElementById("vis-example-container");
        const min_value = Math.min.apply(Math, data.map(function(o) { return o[field]; }));
        const max_value = Math.max.apply(Math, data.map(function(o) { return o[field]; }));
        
        // set the dimensions and margins of the graph
        let margin = {top: 20, right: 50, bottom: 100, left: 60},
            width = this.CHART_WIDTH - margin.left - margin.right,
            height = this.CHART_HEIGHT - margin.top - margin.bottom;

        const tooltip_linechart = d3.select("body").append("div").attr("class", "tool-tip-line-chart");

        // parse the date / time
        const parser = d3.timeParse("%Y-%m-%d");
        let bisectDate = d3.bisector(function(d) { return d.index; }).left;

        // set the ranges
        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        // define the line
        let valueline = d3.line()
            .x(function(d) { return x(d.index); })
            .y(function(d) { return y(d[field]); });

        let svg = d3.select(canvas).append("svg")
            .attr("width", this.CHART_WIDTH)
            .attr("height", this.CHART_HEIGHT - this.GAP);

        svg.append("rect")
            .attr("fill", "#ffffff")
            .attr("width", this.CHART_WIDTH)
            .attr("height", this.CHART_HEIGHT);

        let g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // format the data        
        data.forEach(function(d) {
            d.index = parser(d.index);
            d[field] = +d[field];
        });
        
        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.index; }));
        y.domain([min_value, max_value]);
        
        //declare path variable to be used in resize function
        let path=g.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline)
            .on("mousemove", function(d){
                tooltip_linechart
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(d[field]);
            })
            .on("mouseout", function(d){ tooltip_linechart.style("display", "none");});

        //declare xAxis and xAxis element variable to be used in resize function
        let xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d"));
        let xAxisEL=g.append("g")
            .call(xAxis);

         xAxisEL.attr("transform", "translate(0," + height + ")")
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        //declare yAxis and yAxis element variable to be used in resize function
        let yAxis = d3.axisLeft(y);
        let yAxisEL = g.append("g")
                     .call(yAxis);

        let focus = g.append("g")
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

        const format_date = d3.timeFormat("%d-%b-%y");
        function mousemove() {
            let x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.index > d1.index - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.index) + "," + y(d[field]) + ")");
            focus.select("text").text(function () {
                return format_date(d.index) + '-> ' + d[field];
            });
            focus.select(".x-hover-line").attr("y2", height - y(d[field]));
            focus.select(".y-hover-line").attr("x2", width + width);
        }

        //declare resize function
        function resize() {

            let w=window.innerWidth - 260 - margin.left - margin.right;
            let h=window.innerHeight - margin.top - margin.bottom;
     
            //resize canvas size
            canvas.style.width=(window.innerWidth - 260) +"px";
            canvas.style.height=(window.innerHeight+gap)+"px";

            //resize svg size
            svg.attr("width", (window.innerWidth - 260))
               .attr("height", (window.innerHeight - gap));

            svg.attr("width", w + margin.left + margin.right);
  
            //update x and y range
            x.range([0, w]);
            y.range([h, 0]);

            //resize xAxis and yAxis based on x and y range
            xAxis.scale(x);
            yAxis.scale(y);

            //update axis element
            xAxisEL.attr("transform", "translate(0," + h + ")")
                   .call(xAxis);
            yAxisEL.call(yAxis);
             
            //update data
            valueline.x(function(d) { return x(d.index); })
                     .y(function(d) { return y(d[field]); });

            path.attr('d', valueline);   

        }

        // resize when window size changes
        d3.select(window).on('resize', resize);

    }
}