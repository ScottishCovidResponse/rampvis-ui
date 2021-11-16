import * as d3 from "d3";

export class MatrixChart {
  constructor(options) {
    var data = options.data[0].values;
    var displayedDimensions = options.data[0].displayedDimensions;
    var removedDimensions = options.data[0].removedDimensions;
    let hasRemovedDimensions = removedDimensions !== undefined;
    let hasDisplayedDimensions = displayedDimensions !== undefined;
    let dimensions;

    // if displayed dimensions are not defined, use all dimensions and filter
    if (hasDisplayedDimensions) {
      dimensions = displayedDimensions;
    } else {
      dimensions = Object.keys(data[0]);
      if (hasRemovedDimensions) {
        dimensions = dimensions.filter(function (d) {
          return !removedDimensions.includes(d);
        });
      }
    }

    const columns = dimensions;

    const padding = 20;
    const width = 400;
    const size =
      (width - (columns.length + 1) * 3 * padding) / columns.length +
      3 * padding;
    const margin = { top: 10, right: 10, bottom: 10, left: 100 };

    const svg = d3
      .select("#" + options.chartElement)
      .append("svg")
      .attr("width", `${width}px`)
      .attr("height", `${width}px`)
      .append("g")
      .attr("transform", `translate(0, ${margin.top})`);

    svg
      .append("style")
      .text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);

    const x = columns.map((c) =>
      d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d[c]))
        .rangeRound([padding / 2, size - padding / 2]),
    );

    const xAxis = () => {
      const axis = d3
        .axisBottom()
        .ticks(6)
        .tickSize(size * columns.length);
      return (g) =>
        g
          .selectAll("g")
          .data(x)
          .join("g")
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
      const axis = d3
        .axisLeft()
        .ticks(6)
        .tickSize(-size * columns.length);
      return (g) =>
        g
          .selectAll("g")
          .data(y)
          .join("g")
          .attr("transform", (d, i) => `translate(0,${i * size})`)
          .each(function (d) {
            return d3.select(this).call(axis.scale(d));
          })
          .call((g) => g.select(".domain").remove())
          .call((g) => g.selectAll(".tick line").attr("stroke", "#ddd"));
    };

    svg.append("g").call(yAxis());
    const z = d3.scaleSequential(d3.interpolatePiYG);

    const cell = svg
      .append("g")
      .selectAll("g")
      .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
      .join("g")
      .attr("transform", ([i, j]) => `translate(${i * size},${j * size})`);

    cell
      .append("rect")
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr("x", padding / 2 + 0.5)
      .attr("y", padding / 2 + 0.5)
      .attr("width", size - padding)
      .attr("height", size - padding);

    // cell.each(function ([i, j]) {
    //     d3.select(this)
    //         .selectAll("circle")
    //         .data(data.filter((d) => !isNaN(d[columns[i]]) && !isNaN(d[columns[j]])))
    //         .join("circle")
    //         .attr("cx", (d) => x[i](d[columns[i]]))
    //         .attr("cy", (d) => y[j](d[columns[j]]));
    // });

    const circle = cell
      .selectAll("circle")
      .attr("r", 3.5)
      .attr("fill-opacity", 0.7)
      .attr("fill", (d) => z(d.Index / data.length));

    cell.call(brush, circle, svg);

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

    function brush(cell, circle, svg) {
      const brush = d3
        .brush()
        .extent([
          [padding / 2, padding / 2],
          [size - padding / 2, size - padding / 2],
        ])
        .on("start", brushstarted)
        .on("brush", brushed)
        .on("end", brushended);

      cell.call(brush);

      let brushCell;

      // Clear the previously-active brush, if any.
      function brushstarted() {
        if (brushCell !== this) {
          d3.select(brushCell).call(brush.move, null);
          brushCell = this;
        }
      }

      // Highlight the selected circles.
      function brushed([i, j]) {
        var selection = d3.event.selection;
        let selected = [];
        if (selection) {
          const [[x0, y0], [x1, y1]] = selection;

          circle.classed(
            "hidden",
            (d) =>
              x0 > x[i](d[columns[i]]) ||
              x1 < x[i](d[columns[i]]) ||
              y0 > y[j](d[columns[j]]) ||
              y1 < y[j](d[columns[j]]),
          );
          selected = data.filter(
            (d) =>
              x0 < x[i](d[columns[i]]) &&
              x1 > x[i](d[columns[i]]) &&
              y0 < y[j](d[columns[j]]) &&
              y1 > y[j](d[columns[j]]),
          );
        }
        svg.property("value", selected).dispatch("input");
      }

      // If the brush is empty, select all circles.
      function brushended() {
        var selection = d3.event.selection;
        if (selection) return;
        svg.property("value", []).dispatch("input");
        circle.classed("hidden", false);
      }
    }
  }
}
