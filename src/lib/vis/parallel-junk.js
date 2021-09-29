import * as d3 from "d3";
import { pv } from "./pv"

// mercilessly copied from https://www.d3-graph-gallery.com/graph/parallel_basic.html

export class ParallelJunk {

    constructor(options) {

        // set the dimensions and margins of the graph
        const margin = { top: 30, right: 10, bottom: 10, left: 20 },
            width = 1200 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const container = d3.select('#' + options.chartElement);
        const svg = container
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                `translate(${margin.left},${margin.top})`);

        var data = options.data[0].values
        var displayedDimensions = options.data[0].displayedDimensions
        var removedDimensions = options.data[0].removedDimensions
        var additionalData = options.data[0].additionalData
        let hasAdditionalData = (additionalData !== undefined);
        let hasRemovedDimensions = (removedDimensions !== undefined);
        let hasDisplayedDimensions = (displayedDimensions !== undefined);
        let dimensions;


        // if displayed dimensions are not defined, use all dimensions and filter
        if (hasDisplayedDimensions) {
            dimensions = displayedDimensions
        }
        else {
            dimensions = Object.keys(data[0])
            if (hasRemovedDimensions) {
                dimensions = dimensions.filter(function (d) { return !removedDimensions.includes(d) })
            }
        }

        // For each dimension, I build a linear scale. I store all in a y object
        const y = {}
        for (var i in dimensions) {
            var name = dimensions[i]
            if (hasAdditionalData) {
                y[name] = d3.scaleLinear()
                    .domain(d3.extent(data.concat(additionalData), function (d) { return +d[name]; }))
                    .range([height, 0])
            }
            else {
                y[name] = d3.scaleLinear()
                    .domain(d3.extent(data, function (d) { return +d[name]; }))
                    .range([height, 0])
            }
        }


        // Build the X scale -> it find the best position for each Y axis
        var x = d3.scalePoint()
            .range([0, width])
            .padding(1)
            .domain(dimensions);

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(dimensions.map(function (p) { return [x(p), y[p](d[p])]; }));
        }

        // Draw the lines
        svg
            .selectAll("path")
            .data(data)
            .join("path")
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", "steelblue")
            .style("opacity", 0.3)
            .style("shape-rendering", "crispEdges")

        // Draw the axis:
        svg.selectAll("axis")
            // For each dimension of the dataset I add a 'g' element:
            .data(dimensions).enter()
            .append("g")
            // I translate this element to its right position on the x axis
            .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
            // And I build the axis with the call function
            .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function (d) { return d; })
            .style("fill", "black")
            .style("font-weight", "bolder")
            .style("font-weight", "bolder")
            .style("font-size", "1.4rem!important");

        if (hasAdditionalData) {

            additionalData = additionalData.filter(d => d.type === "average")

            const legendData = additionalData.map(d => d.age_group);
            const colors = d3.schemeDark2;

            
            // Legend
            const legendContainer = container.append('div');
            const legend =  pv.legend()
                .margin({ top: 3, right: 0, bottom: 3, left: 0 })
                .colorScale(d3.scaleOrdinal()
                    .domain(legendData)
                    .range(colors));
            legendContainer.datum(legendData).call(legend);

            svg
                .selectAll("additionalData")
                .data(additionalData)
                .join("path")
                .attr("d", path)
                .style("fill", "none")
                .style("stroke", function(d, i){
                    return colors[i]
                })
                .style("opacity", 0.8)
                .style('stroke-width', '2px')

        }

    }
}