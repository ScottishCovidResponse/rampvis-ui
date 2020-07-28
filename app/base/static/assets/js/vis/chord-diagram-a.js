class ChordDiagramA {
    CHART_WIDTH = 1200;
    CHART_HEIGHT = 1200;
    boards = Common.scotlandBoards;
    element = null;
    chartId = null;
    matrix = [];
    min = 0;
    max = 0;

    init(options) {

        this.element = options.chartElement;
        this.matrix = options.data.map(d => {
            let {name, ...d1} = d;
            let arr = Object.values(d1);
            let arrMax = Math.max(...arr);
            let arrMin = Math.min(...arr);

            if (this.min > arrMin) this.min = arrMin
            if (this.max < arrMax) this.max = arrMax

            return arr;
        });

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

        let colors = d3.scaleLinear()
            .domain([this.min, 0, this.max])
            .range(['#d73027', '#fee08b', '#1a9850'])
            .interpolate(d3.interpolateHcl); //interpolateHsl interpolateHcl interpolateRgb

        // set the dimensions and margins of the graph
        let margin = {top: 20, right: 45, bottom: 20, left: 60},
            width = this.CHART_WIDTH - margin.left - margin.right,
            height = this.CHART_HEIGHT - margin.top - margin.bottom;

        // clear the canvas first
        d3.select("svg").remove();

        let svg = d3.select(this.chartId).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        svg.append("rect")
            .attr("fill", "#ffffff")
            .attr("width", this.CHART_WIDTH)
            .attr("height", this.CHART_HEIGHT);

        let g = svg.append("g")
            .attr("transform", "translate(600, 600)");

        let res = d3.chord()
            .padAngle(gap)     // padding between entities (black arc)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending)
            (this.matrix);

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
                .radius(470)
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
                .innerRadius(470)
                .outerRadius(480)
            );


        // Add the ticks
        group.selectAll(".group-tick")
            .data(function (d) {
                return groupTicks(d);
            })                              // Controls the number of ticks: one tick each 25 here.
            .enter()
            .append("g")
            .attr("transform", function (d) {
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + 480 + ",0)";
            })
            .append("line")               // By default, x1 = y1 = y2 = 0, so no need to specify it.
            .attr("x2", 6)
            .attr("stroke", "black");

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
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + 480 + ",0)";
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

        let innerRadius = Math.min(width, height) * .4;

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
                    + "translate(" + (innerRadius + 55) + ")"
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