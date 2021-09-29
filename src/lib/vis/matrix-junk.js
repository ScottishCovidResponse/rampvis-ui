import * as d3 from "d3";

export class MatrixJunk {

    constructor(options) {

        var data = options.data[0].values
        var displayedDimensions = options.data[0].displayedDimensions
        var removedDimensions = options.data[0].removedDimensions
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

        const columns = dimensions

        const padding = 20;
        const width = 1000;
        const size = (width - (columns.length + 1) * 3 * padding) / columns.length + 3 * padding;
        const margin = { top: 50, right: 10, bottom: 10, left: 100 }

        const svg = d3.select("#" + options.chartElement)
            .append("svg")
            .attr("width", `${width}px`)
            .attr("height", `${width}px`)
            .append("g")
            .attr("transform", `translate(0, ${margin.top})`);

        const x = columns.map((c) => d3.scaleLinear()
                .domain(d3.extent(data, (d) => d[c]))
                .rangeRound([padding / 2, size - padding / 2])
        );

        const xAxis = () => {
            const axis = d3.axisBottom().ticks(6).tickSize(size * columns.length);
            return (g) => g.selectAll("g").data(x).join("g")
                    .attr("transform", (d, i) => `translate(${i * size},0)`)
                    .each(function (d) {
                        return d3.select(this).call(axis.scale(d));
                    })
                    .call((g) => g.select(".domain").remove())
                    .call((g) => g.selectAll(".tick line").attr("stroke", "#ddd"));
        };

        svg.append("g").call(xAxis());
        const y = x.map((x) => x.copy().range([size - padding / 2, padding / 2]));

        const yAxis = () => {
            const axis = d3.axisLeft().ticks(6).tickSize(-size * columns.length);
            return (g) => g.selectAll("g").data(y).join("g")
                    .attr("transform", (d, i) => `translate(0,${i * size})`)
                    .each(function (d) {
                        return d3.select(this).call(axis.scale(d));
                    })
                    .call((g) => g.select(".domain").remove())
                    .call((g) => g.selectAll(".tick line").attr("stroke", "#ddd"));
        };

        svg.append("g").call(yAxis());
        const z = d3.scaleSequential(d3.interpolatePiYG);

        const cell = svg.append("g").selectAll("g")
            .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
            .join("g")
            .attr("transform", ([i, j]) => `translate(${i * size},${j * size})`);

        cell.append("rect")
            .attr("fill", "none")
            .attr("stroke", "#aaa")
            .attr("x", padding / 2 + 0.5)
            .attr("y", padding / 2 + 0.5)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.each(function ([i, j]) {
            d3.select(this)
                .selectAll("circle")
                .data(data.filter((d) => !isNaN(d[columns[i]]) && !isNaN(d[columns[j]])))
                .join("circle")
                .attr("cx", (d) => x[i](d[columns[i]]))
                .attr("cy", (d) => y[j](d[columns[j]]));
        });

        const circle = cell.selectAll("circle")
            .attr("r", 3.5)
            .attr("fill-opacity", 0.7)
            .attr("fill", (d) => z(d.Index / data.length));

        svg
            .append("g")
            .style("font", "bold 10px sans-serif")
            .style("pointer-events", "none")
            .selectAll("text")
            .data(columns)
            .join("text")
            .attr("transform", (d, i) => `translate(${i * size},${i * size})`)
            .attr("x", padding)
            .attr("y", padding)
            .attr("dy", ".71em")
            .text((d) => d);

        svg.property("value", []);

    }

}