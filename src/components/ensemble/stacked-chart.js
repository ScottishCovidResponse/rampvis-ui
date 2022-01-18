import * as d3 from "d3";
import { pv } from "src/lib/vis/pv";

export class StackedChart {

    constructor(options) {

        if (options.intersectionPoints.length == 0){
            options.intersectionPoints = Array.from({length: options.data.length}, (x, i) => i)
        }

        const margin = { top: 30, right: 30, bottom: 30, left: 30 },
            width = 800 - margin.left - margin.right,
            height = (options.intersectionPoints.length) * 20;

        const container = d3.select("#" + options.chartElement);
        const svg = container
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        var controller = options.controller;
        const columns = options.columns;

        const intersectionPoints = options.intersectionPoints;

        let values = [];

        let maxValues = [];
        let minValues = [];

        for (var j = 0; j < columns.length; j++) {
            maxValues.push(Number.MIN_VALUE);
            minValues.push(Number.MAX_VALUE);
        }


        // find minimum and maximum
        for (var i = 0; i < options.data.length; i++) {
            var row = (options.data)[i];

            for (var j = 0; j < columns.length; j++) {
                var column = columns[j]
                var value = row[column]
                maxValues[j] = Math.max(maxValues[j], value);
                minValues[j] = Math.min(minValues[j], value);
            }
        }


        // get list of indices and scaledValue
        const indices = [];
        const arrayValues = [];

        for (var i = 0; i < intersectionPoints.length; i++) {
            var intersectionIndex = intersectionPoints[i];
            var row = (options.data)[intersectionIndex];
            var index = row["Index"];

            indices.push(index);
            var arrayValue = {};
            arrayValue["index"] = index;

            for (var j = 1; j < columns.length; j++) {
                var column = columns[j]
                var value = row[column]
                var scaledValue = ((value - minValues[j]) / (maxValues[j] - minValues[j])) * 30;
                values.push({ index: index, group: column, value: scaledValue });

                arrayValue[column] = scaledValue;
            }
            arrayValues.push(arrayValue);
        }

        const subcolumns = columns.slice(1)

        const stackedData = d3.stack().keys(subcolumns)(arrayValues);

        // color palette = one color per subgroup
        const colors = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f', '#af8dc3', '#7fbf7b']


        // Add x axis
        const x = d3.scaleLinear()
            .domain([0, 300])
            .range([0, width]);

        svg.append("g")
            .attr("transform", `translate(-2, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");


        // Add y axis
        const y = d3.scaleBand()
            .domain(intersectionPoints)
            .range([0, height])
            .padding([0.02])

        svg.append("g")
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("transform", "rotate(-15)");


        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .join("g")
            .attr("fill", function (d, i) {
                return colors[i];
            })
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(d => d)
            .join("rect")
            .attr("x", d => x(d[0]))
            .attr("y", d => y(d.data.index))
            .attr("height", y.bandwidth())
            .attr("width", d => x(d[1]) - x(d[0]))

        const legendData = subcolumns;
        const legendContainer = container.append("div").lower();
        const legend = pv
            .legend()
            .margin({ top: 3, right: 0, bottom: 3, left: 80 })
            .colorScale(d3.scaleOrdinal().domain(legendData).range(colors));
        legendContainer.datum(legendData).call(legend);


        this.removeContainer = async function () {
            container.selectAll("*").remove();
            return this.getController();
        };

        this.getController = function () {
            return controller;
        };

    }

}