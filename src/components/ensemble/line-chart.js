import * as d3 from "d3";
import { pv } from "src/lib/vis/pv";

// mercilessly copied from https://www.d3-graph-gallery.com/graph/line_several_group.html

export class LineChart {
  constructor(options) {
    // set the dimensions and margins of the graph
    const margin = { top: 15, right: 15, bottom: 30, left: 100 },
      width = 700 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    var lineColors = d3.schemeDark2;

    var controller = options.controller;
    var data = options.data;
    var currentSelection = options.currentSelection;
    var svg;

    // clear anything in the container
    var container = d3.select("#" + options.chartElement);

    this.displayData = function (data) {
      container.innerHTML = "";

      // legend
      const legendData = data[0].ys.map((d) => d.label);
      const legendContainer = container.append("div");
      const legend = pv
        .legend()
        .margin({ top: 3, right: 0, bottom: 3, left: 0 })
        .colorScale(d3.scaleOrdinal().domain(legendData).range(lineColors));
      legendContainer.datum(legendData).call(legend);

      // slider
      const slideContainer = container.append("div");
      const slider = slideContainer
        .append("input")
        .attr("id", "line-slider")
        .attr("type", "range")
        .attr("min", 0)
        .attr("max", data.length - 1)
        .attr("value", 0);

      // actual visualization
      svg = container
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // data processing
      var dashed_index = data[0].ys.findIndex(
        (obj) => data[0].dashed === obj.label,
      );

      data = data.map((ageData) =>
        ageData.ys.map(({ label, values }) =>
          ageData.x.values.map((x, i) => ({
            x: x,
            y: values[i],
          })),
        ),
      );

      var yMin = d3.min(data, (f) => d3.min(f, (d) => d3.min(d, (e) => e.y)));
      var yMax = d3.max(data, (f) => d3.max(f, (d) => d3.max(d, (e) => e.y)));
      var xMin = d3.min(data, (f) => d3.min(f, (d) => d3.min(d, (e) => e.x)));
      var xMax = d3.max(data, (f) => d3.max(f, (d) => d3.max(d, (e) => e.x)));

      var x = d3.scaleLinear().domain([xMin, xMax]).range([0, width]).nice();

      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));

      var y = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]).nice();

      svg.append("g").call(d3.axisLeft(y));

      const line = d3
        .line()
        .x((d) => x(d.x))
        .y((d) => y(d.y));

      updateChart(data, currentSelection, dashed_index, line);

      d3.select("#line-slider").on("change", function (d) {
        var selectedValue = document.getElementById("line-slider").value;
        updateChart(data, selectedValue, dashed_index, line);
        controller.setAgeIndex(parseInt(selectedValue));
      });
    };

    function updateChart(data, currentSelection, dashed_index, line) {
      svg.selectAll("path.linechart").remove();

      data.map((_data, lineindex) =>
        svg
          .selectAll(".line")
          .data(_data)
          .enter()
          .append("path")
          .attr("class", "linechart")
          .attr("fill", "none")
          .style("opacity", 0.5)
          .attr("stroke", (d, i) =>
            lineindex == currentSelection ? lineColors[i] : "lightgrey",
          )
          .attr("stroke-dasharray", (d, i) =>
            i == dashed_index ? "3 3" : null,
          )
          .style("stroke-width", (d) =>
            lineindex == currentSelection ? "4px" : "2px",
          )
          .attr("d", line),
      );
    }

    this.removeContainer = function () {
      container.selectAll("*").remove();
    };

    this.displayData(data);
  }
}
