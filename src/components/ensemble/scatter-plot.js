import * as d3 from "d3";

export class ScatterPlot {
  constructor(options) {
    const margin = { top: 40, right: 30, bottom: 30, left: 250 };
    const width = 300;
    const height = 300;

    const container = d3.select("#" + options.chartElement);
    const svg = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(0,${margin.top})`);

    const color = d3.scaleSequential(d3.interpolateTurbo);

    var controller = options.controller;
    var data = options.data[0].values;

    const yMin = d3.min(data, (d) => d.y);
    const yMax = d3.max(data, (d) => d.y);

    const colorScale = yMax + Math.abs(yMin);

    const x = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function (d) {
          return +d.x;
        }),
      )
      .range([margin.left, width + margin.left]);

    const y = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function (d) {
          return +d.y;
        }),
      )
      .range([height, margin.top / 2]);

    const xAxis = (g) =>
      g
        .call(d3.axisBottom(x).ticks(20))
        .attr("transform", `translate(0,${height})`)
        .call((g) => g.select(".domain").remove())
        .call((g) => g.selectAll(".tick line").attr("stroke", "#ddd"));

    const yAxis = (g) =>
      g
        .call(d3.axisLeft(y).ticks(20))
        .attr("transform", `translate(${margin.left},0)`)
        .call((g) => g.select(".domain").remove())
        .call((g) => g.selectAll(".tick line").attr("stroke", "#ddd"));

    const dots = svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d["x"]))
      .attr("cy", (d) => y(d["y"]))
      .attr("r", 8)
      .attr("fill", function (d) {
        if (d.y >= 0) {
          return color((d.y + Math.abs(yMin)) / colorScale);
        } else {
          return color(Math.abs(yMin - d.y) / colorScale);
        }
      })
      .attr("r", 3);

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    const brush = d3
      .brush()
      .extent([
        [margin.left, 0],
        [width + margin.left + margin.right, height],
      ])
      .on("start end", brushed);

    svg.append("g").call(brush);

    function brushed() {
      var extent = d3.event.selection;

      if (extent === null) {
        controller.scatterRemoved();
        return;
      }

      controller.scatterStarted();

      dots.classed("scatterselected", function (d) {
        var brushedPoint = isBrushed(extent, x(d.x), y(d.y));

        if (brushedPoint) {
          controller.scattered(d.simu);
        }

        if (!controller.hasParallelPoints()) {
          return brushedPoint;
        } else {
          return controller.parallelPoints.includes(d.simu);
        }
      });

      let intersection = controller.getIntersectionPoints();
      let hasIntersectionPoints = controller.hasIntersectionPoints();

      fillColor(intersection, hasIntersectionPoints);

      controller.scatterFinished();
    }

    function isBrushed(brush_coords, cx, cy) {
      var x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }

    function fillColor(points, hasPoints) {
      dots.attr("fill", function (d) {
        if (points.includes(d.simu) || !hasPoints) {
          if (d.y >= 0) {
            return color((d.y + Math.abs(yMin)) / colorScale);
          } else {
            return color(Math.abs(yMin - d.y) / colorScale);
          }
        } else {
          return "lightgray";
        }
      });
    }

    this.parallelFilter = function (parallelPoints) {
      let intersection = controller.getIntersectionPoints();
      let hasIntersectionPoints = controller.hasIntersectionPoints();

      dots.classed("scatterselected", function (d) {
        return intersection.includes(d.simu);
      });

      fillColor(intersection, hasIntersectionPoints);
    };
  }
}
