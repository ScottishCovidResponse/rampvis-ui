import * as d3 from "d3";
import { pv } from "../../../lib/vis/pv";
import { Controller } from "./controller";

// mercilessly copied from https://www.d3-graph-gallery.com/graph/parallel_basic.html
// brush: https://bl.ocks.org/jasondavies/1341281

export class ParallelChart {
  constructor(options) {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 10, bottom: 10, left: 20 },
      width = 800 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const container = d3.select("#" + options.chartElement);
    const svg = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    var controller = options.controller;
    var data = options.data[0].values;
    var displayedDimensions = options.data[0].displayedDimensions;
    var removedDimensions = options.data[0].removedDimensions;
    var additionalData = options.data[0].additionalData;
    let hasAdditionalData = additionalData !== undefined;
    let hasRemovedDimensions = removedDimensions !== undefined;
    let hasDisplayedDimensions = displayedDimensions !== undefined;
    let dimensions;

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    // Adhitya: In an ideal world, I wouldn't put this function at the top, but anyway
    this.path = function (d) {
      return d3.line()(
        dimensions.map(function (p) {
          return [x(p), y[p](d[p])];
        }),
      );
    };

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

    // For each dimension, I build a linear scale. I store all in a y object
    const y = {};
    for (var i in dimensions) {
      var name = dimensions[i];
      if (hasAdditionalData) {
        y[name] = d3
          .scaleLinear()
          .domain(
            d3.extent(data.concat(additionalData), function (d) {
              return +d[name];
            }),
          )
          .range([height, 0]);
      } else {
        y[name] = d3
          .scaleLinear()
          .domain(
            d3.extent(data, function (d) {
              return +d[name];
            }),
          )
          .range([height, 0]);
      }
    }

    // Build the X scale -> it find the best position for each Y axis
    var x = d3.scalePoint().range([0, width]).padding(1).domain(dimensions);

    // Draw the lines
    var background = svg
      .append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(data)
      .join("path")
      .attr("d", this.path)
      .style("fill", "none")
      .attr("class", "background")
      .style("stroke", "lightgrey")
      .style("opacity", 0.3)
      .style("shape-rendering", "crispEdges");

    var foreground = svg
      .append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(data)
      .join("path")
      .attr("d", this.path)
      .style("fill", "none")
      .style("stroke", "steelblue")
      .style("opacity", 0.3)
      .style("shape-rendering", "crispEdges");

    // Handles a brush event, toggling the display of foreground lines.
    function brushed() {
      let actives = [];
      let display = [];
      let local_selected = [];

      svg
        .selectAll(".brush")
        .filter(function (d, i, nodes) {
          var selectedNode = d3.select(nodes[i]).node();
          y[d].brushSelectionValue = d3.brushSelection(selectedNode);
          return d3.brushSelection(selectedNode);
        })
        .each(function (d, i, nodes) {
          var selectedNode = d3.select(nodes[i]).node();
          // Get extents of brush along each active selection axis (the Y axes)
          actives.push({
            dimension: d,
            extent: d3.brushSelection(selectedNode).map(y[d].invert),
          });
        });

      // Update foreground to only display selected values
      foreground.style("display", function (d) {
        return actives.every(function (active) {
          let result =
            active.extent[1] <= d[active.dimension] &&
            d[active.dimension] <= active.extent[0];
          if (result) {
            local_selected.push(d);
          }
          return result;
        })
          ? null
          : "none";
      });

      local_selected.forEach((l) => {
        if (
          local_selected.filter((s) => s.Index === l.Index).length ===
          actives.length
        ) {
          display.push(l);
        }
      });

      let display_indices = [];
      for (var index in display) {
        display_indices.push(display[index].Index);
      }

      return display_indices;
    }

    function endbrush() {
      var display_indices = brushed();

      if (!hasAdditionalData) {
        controller.setParallelPoints(display_indices);
      }
    }

    // Draw the axis:
    var axes = svg
      .selectAll("axis")
      // For each dimension of the dataset I add a 'g' element:
      .data(dimensions)
      .enter()
      .append("g")
      // I translate this element to its right position on the x axis
      .attr("transform", function (d) {
        return "translate(" + x(d) + ")";
      })
      // And I build the axis with the call function
      .each(function (d, i, nodes) {
        var currentNode = d3.select(nodes[i]).node();

        d3.select(currentNode).call(d3.axisLeft().scale(y[d]));
      });

    // Add axis title
    axes
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function (d) {
        return d;
      })
      .style("fill", "black")
      .style("font-weight", "bolder")
      .style("font-weight", "bolder")
      .style("font-size", "1.4rem!important");

    axes
      .append("g")
      .attr("class", "brush")
      .each(function (d, i, nodes) {
        d3.select(nodes[i]).call(
          (y[d].brush = d3
            .brushY()
            .extent([
              [-10, 0],
              [10, height],
            ])
            .on("brush", brushed)
            .on("end", endbrush)),
        );
      })
      .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

    if (hasAdditionalData) {
      additionalData = additionalData.filter((d) => d.type === "average");

      const legendData = additionalData.map((d) => d.age_group);
      const colors = d3.schemeDark2;

      // Legend
      const legendContainer = container.append("div");
      const legend = pv
        .legend()
        .margin({ top: 3, right: 0, bottom: 3, left: 0 })
        .colorScale(d3.scaleOrdinal().domain(legendData).range(colors));
      legendContainer.datum(legendData).call(legend);

      svg
        .selectAll("additionalData")
        .data(additionalData)
        .join("path")
        .attr("d", this.path)
        .style("fill", "none")
        .style("stroke", function (d, i) {
          return colors[i];
        })
        .style("opacity", 0.8)
        .style("stroke-width", "2px");
    }

    this.scatterFilter = function (scatteredPoints) {
      if (controller.hasScatterPoints()) {
        var intersectionPoints = controller.getIntersectionPoints();
        foreground.style("display", function (d) {
          return intersectionPoints.includes(d.Index) ? null : "none";
        });
      }
    };

    this.scatterRemoved = function () {
      if (!controller.hasParallelPoints()) {
        foreground.style("display", function (d) {
          return null;
        });
      } else {
        foreground.style("display", function (d) {
          return controller.parallelPoints.includes(d.Index) ? null : "none";
        });
      }
    };

    this.removeContainer = async function () {
      container.selectAll("*").remove();
      return this.getController();
    };

    this.getController = function () {
      return controller;
    };
  }
}
