import * as d3 from "d3";
import { pv } from "./pv"

// mercilessly copied from https://www.d3-graph-gallery.com/graph/line_several_group.html

export class LineJunk {

    constructor(options) {

        // set the dimensions and margins of the graph
        const margin = { top: 15, right: 15, bottom: 30, left: 200 },
            width = 850 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const container = d3.select('#' + options.chartElement);
        container.innerHTML = '';

        var lineColors = d3.schemeDark2;

        var data = options.data;
        var currentSelection = options.currentSelection;

        // legend
        const legendData = data[0].ys.map(d => d.label);
        const legendContainer = container.append('div');
        const legend = pv.legend()
            .margin({ top: 3, right: 0, bottom: 3, left: 0 })
            .colorScale(d3.scaleOrdinal()
                .domain(legendData)
                .range(lineColors));
        legendContainer.datum(legendData).call(legend);

        // slider
        const slideContainer = container.append('div');
        const slider = slideContainer.append('input')
            .attr("id", "line-slider")
            .attr("type", "range")
            .attr("min", 0)
            .attr("max", data.length)
            .attr("value", 0);

        // actual visualization
        const svg = container
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                `translate(${margin.left},${margin.top})`);


        // data processing

        var dashed_index = ((data[0].ys).findIndex(obj => (data[0].dashed) === (obj.label)));

        data = data.map(ageData => ((ageData.ys).map(({ label, values }) => ageData.x.values.map((x, i) => ({
            x: x,
            y: values[i]
        })))))

        var yMin = d3.min(data, f => d3.min(f, d => d3.min(d, e => e.y)));
        var yMax = d3.max(data, f => d3.max(f, d => d3.max(d, e => e.y)));
        var xMin = d3.min(data, f => d3.min(f, d => d3.min(d, e => e.x)));
        var xMax = d3.max(data, f => d3.max(f, d => d3.max(d, e => e.x)));

        var x = d3.scaleLinear()
            .domain([xMin, xMax])
            .range([0, width]).nice();

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(5));

        var y = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([height, 0]).nice();

        svg.append("g").call(d3.axisLeft(y));

        const line = d3.line().x(d => x(d.x)).y(d => y(d.y));

        data.map((_data, lineindex) => (
            svg.selectAll(".line")
                .data(_data)
                .enter()
                .append("path")
                .attr("class", "linechart")
                .attr("fill", "none")
                .style('opacity', 0.5)
                .attr('stroke', (d, i) => (lineindex == currentSelection) ? lineColors[i] : "lightgrey")
                .attr('stroke-dasharray', (d, i) => (i == dashed_index) ? '3 3' : null)
                .style('stroke-width', d => lineindex == currentSelection ? '4px' : '2px')
                .attr("d", line)
        ))

        d3.select("#line-slider").on("change", function (d) {
            var selectedValue = document.getElementById("line-slider").value
            console.log("selected value", selectedValue)
            updateChart(data, selectedValue)
        })

        function updateChart(data, currentSelection) {
            console.log("current selection", currentSelection)
            svg.selectAll("path.linechart").remove(); 

            data.map((_data, lineindex) => (
                svg.selectAll(".line")
                    .data(_data)
                    .enter()
                    .append("path")
                    .attr("class", "linechart")
                    .attr("fill", "none")
                    .style('opacity', 0.5)
                    .attr('stroke', (d, i) => (lineindex == currentSelection) ? lineColors[i] : "lightgrey")
                    .attr('stroke-dasharray', (d, i) => (i == dashed_index) ? '3 3' : null)
                    .style('stroke-width', d => lineindex == currentSelection ? '4px' : '2px')
                    .attr("d", line)
            ))
        }
    }








}