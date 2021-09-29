import * as d3 from "d3";

export class ScatterJunk {

    constructor(options) {
        
        const margin = { top: 30, right: 30, bottom: 30, left: 400 };
        const width = 400;
        const height = 300;

        const container = d3.select("#" + options.chartElement)
        const svg = container
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(0,${margin.top})`);

        const color = d3.scaleSequential(d3.interpolateTurbo);

        var data = options.data[0].values;

        const yMin = d3.min(data, (d) => d.y);
        const yMax = d3.max(data, (d) => d.y);

        const colorScale = yMax + Math.abs(yMin);

        const x = d3.scaleLinear()
                .domain(d3.extent(data, function (d) { return +d.x; }))
                .range([margin.left, width + margin.left])

        const y = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return +d.y; }))
            .range([height, margin.top / 2]);

        const xAxis = (g) => g.call(d3.axisBottom(x).ticks(20))
                .attr("transform", `translate(0,${height})`)
                .call((g) => g.select(".domain").remove())
                .call((g) => g.selectAll(".tick line").attr("stroke", "#ddd"));

        const yAxis = (g) => g.call(d3.axisLeft(y).ticks(20))   
                .attr("transform", `translate(${margin.left},0)`)
                .call((g) => g.select(".domain").remove())
                .call((g) => g.selectAll(".tick line").attr("stroke", "#ddd"));

        const dot = svg.append("g").selectAll("circle")
            .data(data.reverse())
            .join("circle")
            .attr("transform", (d) => `translate(${x(d["x"])},${y(d["y"])})`)
            .attr("fill", function(d){
                if (d.y >= 0){
                    return color((d.y + Math.abs(yMin)) / colorScale)
                }
                else{
                    return color(Math.abs(yMin - d.y) / colorScale)
                }    
            })
            .attr("r", 3);

        svg.append("g").call(xAxis);
        svg.append("g").call(yAxis);

    }
}
