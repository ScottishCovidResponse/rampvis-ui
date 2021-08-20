class ChordDiagram {
    CHART_WIDTH = 800;
    CHART_HEIGHT = 800;
    boards = Common.scotlandBoards;
    element = null;
    chartId = null;

    names = [];
    newData = null;
    radius = 200;
    

    constructor(options) {
        let values = options.data[0].values;
        let pearsonrItems = values.pearsonr;
        this.names = values.var1_names;        

        let name = {
            names: values.var1_names
        }
        this.newData = Object.assign(pearsonrItems,name);             

        this.element = options.chartElement;

        // add slider and chart element
        let chartsEl = document.getElementById(this.element);
        let divSlider =
            '<div>' +
            '   <input type="range" min="0.0" max="0.2" value="0.1" step="0.01" class="slider" id="slider-id"> ' +
            '   <label for="volume">Gap between boards</label>  '+
            '</div>' +
            '<div id = "chart">' +
            '</div>'

        $(chartsEl).append(divSlider);
        this.chartId = '#chart';

        let slider = $('#slider-id');

        // redraw when slider value changes
        slider.bind("change", (event, ui) => {
            this.chartId = '#chart';
            this.draw(slider.val())
        });

        this.draw(0.1);
    }


    draw(gap) {
        let step = 0;
        let maxL = Math.max(...this.names.map(el => el.length));  
        let colors = Common.Colors.CORRELATION_SCALE;

        // set the dimensions and margins of the graph
        let margin = {top: 20, right: 45, bottom: 20, left: 60},
            width = this.CHART_WIDTH - margin.left - margin.right,
            height = this.CHART_HEIGHT - margin.top - margin.bottom;

        // clear the canvas first
        d3.select("svg").remove();

        let svg = d3.select(this.chartId).append("svg")
            .attr("width", this.CHART_WIDTH)
            .attr("height", this.CHART_HEIGHT);

        svg.append("rect")
            .attr("fill", "#ffffff")
            .attr("width", this.CHART_WIDTH)
            .attr("height", this.CHART_HEIGHT);

        let g = svg.append("g")          
            .attr("transform", "translate(" + (this.CHART_WIDTH / 2) + ", " + (this.CHART_HEIGHT / 2.5) + ")");  

        let res = d3.chord()
            .padAngle(gap)     // padding between entities (black arc)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending)
            (this.newData);

        // Add the links between groups
        g.datum(res)
            .append("g")
            .selectAll("path")
            .data(function (d) {
                return d;
            })
            .enter()
            .append("path")
            .attr("d", d3.ribbon()
                .radius(this.radius)
            )
            .style("fill", function (d) {
                return colors(d.source.value);
            })
            .style("stroke", "#000000");

            
        // this group object use each group of the data.groups object
        let group = g.datum(res)
            .append("g")
            .selectAll("g")
            .data(function (d) {
                return d.groups;
            })
            .enter();

        // add the group arcs on the outer part of the circle
        group.append("g")
            .append("path")
            .style("fill", "grey")
            .style("stroke", "black")
            .attr("d", d3.arc()
                .innerRadius(this.radius - 15)
                .outerRadius(this.radius - 5)
            );


        // Add the ticks
        group.selectAll(".group-tick")
            .data(function (d) {
                return groupTicks(d);
            })                              // Controls the number of ticks: one tick each 25 here.
            .enter()
            .append("g")
            .attr("transform", function (d) {
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + maxL*12 + ",0)";
            })
            .append("line")               // By default, x1 = y1 = y2 = 0, so no need to specify it.
            .attr("x2", 6)
            .attr("stroke", "red");

        // Add the labels of a few ticks:
        group.selectAll(".group-tick-label")
            .data(function (d) {
                return groupTicks(d);
            })
            .enter()
            .filter(function (d) {
                return d.value % step === 0;
            })
            .append("g")
            .attr("transform", function (d) {
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + 480 + ",0)";//480
            })
            .append("text")
            .attr("x", 8)
            .attr("dy", ".35em")
            .attr("transform", function (d) {
                return d.angle > Math.PI ? "rotate(180) translate(-16)" : null;
            })
            .style("text-anchor", function (d) {
                return d.angle > Math.PI ? "end" : null;
            })
            .text(function (d) {
                return d.value
            })
            .style("font-size", 12);

        //let innerRadius = Math.min(width, height) * .4;
        let innerRadius = this.radius + 2;
        // Add the boards
        group.append("svg:text")
            .each(function (d) {
                d.angle = (d.startAngle + d.endAngle) / 2;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", function (d) {
                return d.angle > Math.PI ? "end" : null;
            })
            .attr("transform", function (d) {
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                    + "translate(" + innerRadius + ")"
                    + (d.angle > Math.PI ? "rotate(180)" : "");
            })
            .text((d, i) => {
                return this.boards[i].board;
            })
            .style("font-size", 12)
            .style("font-weight", "bold");


        // Returns an array of tick angles and values for a given group and step.
        function groupTicks(d) {
            let k = (d.endAngle - d.startAngle) / d.value;
            // console.log(d.startAngle, d.endAngle, d.value, k);
            return [{
                value: d.value,
                angle: d.value * k / 2 + d.startAngle,
            }];

        }
    }

}