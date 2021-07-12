class SimpleBarChart {
    /*
    CHART_WIDTH = 1000;
    CHART_HEIGHT = 600;
    */
    CHART_WIDTH = window.innerWidth - 260;//side bar width is 260
    CHART_HEIGHT = window.innerHeight;
    GAP = 10;

    constructor(options) {
        console.log('Input data', options.data);
        d3.select('#' + options.chartElement)
            .append('div')
                .attr('class', 'vis-example-container')
                .attr('id', 'vis-example-container')
                .style('width', this.CHART_WIDTH + 'px')
                .style('height', this.CHART_HEIGHT + 'px');

        let gap = this.GAP; //pass gap to resize function

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

        //declare xAxis and xAxisE element variable to be used in resize function
        let xAxis = d3.axisBottom(x)
                      .tickFormat(d3.timeFormat("%Y-%m-%d")).tickValues(x.domain().filter(function (d, i) {
                            return !(i % 10)
                        }));
        let xAxisEL=g.append("g")
                     .call(xAxis);

        xAxisEL.attr("class", "axis axis--x")
               .attr("transform", "translate(0," + height + ")")
               .selectAll("text")
               .style("text-anchor", "end")
               .attr("dx", "-.8em")
               .attr("dy", ".15em")
               .attr("transform", "rotate(-65)");


        //declare yAxis and yAxis element variable to be used in resize function
        let yAxis = d3.axisLeft().scale(y);
        let yAxisEL=g.append("g")
            .call(yAxis);
        yAxisEL.attr("class", "axis axis--y")
               .append("text")
               .attr("class", "axis-title");

       //declare bar variable to be used in resize function
       let bar=g.selectAll(".bar")
                .data(data)
                .enter().append("rect");

        bar.attr("x", function (d) {
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
            bar.attr("x", function (d) {
                return x(d.index);
            })
            .attr("y", function (d) {
                return y(d[field]);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return h - y(d[field]);
            })
        }

        // resize when window size changes
        d3.select(window).on('resize', resize);
    }
}