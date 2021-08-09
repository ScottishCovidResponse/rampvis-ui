class SimpleBarChart {

    CHART_WIDTH = document.getElementById('charts').offsetWidth;
    CHART_HEIGHT = window.innerHeight - Common.MAIN_CONTENT_GAP;
    
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
            .attr("id", "rect")
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
        let xAxisEL = g.append("g")
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
        let yAxisEL = g.append("g")
            .call(yAxis);
        yAxisEL.attr("class", "axis axis--y")
            .append("text")
            .attr("class", "axis-title");

        //declare bar variable to be used in resize function
        let bar = g.selectAll(".bar")
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

        let gap = this.GAP;

        //declare resize function
        function resize() {

            let h = window.innerHeight - Common.MAIN_CONTENT_GAP - gap;
            let card = document.getElementById('charts');
            let w = card.offsetWidth;

            canvas.style.width = card.offsetWidth + "px";
            canvas.style.height = h + "px";

            //resize svg size
            svg.attr("width", card.offsetWidth)
                .attr("height", h);            

            //resize rect
            let rectEL = document.getElementById('rect');
            rectEL.setAttribute("width", w);
            rectEL.setAttribute("height", h);

            //update x and y range
            x.range([0, w - margin.left - margin.right]);
            y.range([h - margin.top - margin.bottom, 0]);

            //rescale
            xAxis.scale(x);
            yAxis.scale(y);

            //update axis element
            xAxisEL.attr("transform", "translate(0," + (h - margin.top - margin.bottom) + ")")
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
                return h - margin.top -margin.bottom - y(d[field]);
            })
        }

        // resize when window size changes
        d3.select(window).on('resize.updatesvg', resize);
    }
}
