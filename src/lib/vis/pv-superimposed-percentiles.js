/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable spaced-comment */
/* eslint-disable one-var */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-const */
/* eslint-disable func-names */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as d3 from "d3";
//import "./css/pv-legend.css";

/**
 * A superimposed visualisation of percentiles for uncertainty.
 */
export function superimposedPercentiles() {
  /**
   * Visual configs.
   */
  const margin = { top: 15, right: 15, bottom: 30, left: 50 };

  let visWidth = 960,
    visHeight = 600, // Size of the visualization, including margins
    width,
    height; // Size of the main content, excluding margins

  /**
   * Data binding to DOM elements.
   */
  let data;

  /**
   * DOM.
   */
  let visContainer, xAxisContainer, yAxisContainer;

  let medColors = d3.schemeDark2;

  /**
   * D3.
   */
  const xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear(),
    xAxis = d3.axisBottom().scale(xScale),
    yAxis = d3.axisLeft().scale(yScale),
    medLine = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y)),
    q75Area = d3
      .area()
      .x((d) => xScale(d.x))
      .y0((d) => yScale(d.q25))
      .y1((d) => yScale(d.q75)),
    q95Area = d3
      .area()
      .x((d) => xScale(d.x))
      .y0((d) => yScale(d.q5))
      .y1((d) => yScale(d.q95)),
    q75Colors = medColors.map((c) => d3.color(c).brighter(0.25).toString()),
    q95Colors = medColors.map((c) => d3.color(c).brighter(0.5).toString());

  /**
   * Main entry of the module.
   */
  function module(selection) {
    selection.each(function (_data) {
      // Initialize
      if (!this.visInitialized) {
        visContainer = d3.select(this).append("g").attr("class", "pv-template");
        xAxisContainer = visContainer.append("g").attr("class", "x-axis");
        yAxisContainer = visContainer.append("g").attr("class", "y-axis");

        this.visInitialized = true;
      }

      data = process(_data);

      update();
    });
  }

  function process(data) {
    return data.ys.map(({ label, values }) =>
      data.x.values.map((x, i) => ({
        x: x,
        y: values[2][i],
        q95: values[0][i],
        q75: values[1][i],
        q25: values[3][i],
        q5: values[4][i],
      })),
    );
  }

  /**
   * Updates the visualization when data or display attributes changes.
   */
  function update() {
    /**
     * Display area.
     */
    width = visWidth - margin.left - margin.right;
    height = visHeight - margin.top - margin.bottom;
    visContainer.attr(
      "transform",
      "translate(" + margin.left + "," + margin.top + ")",
    );
    xAxisContainer.attr("transform", "translate(0," + height + ")");

    /**
     * Computation.
     */
    xScale
      .domain(d3.extent(data[0], (d) => d.x))
      .range([0, width])
      .nice();
    const yMin = d3.min(data, (d) => d3.min(d, (e) => e.q5));
    const yMax = d3.max(data, (d) => d3.max(d, (e) => e.q95));
    yScale.domain([yMin, yMax]).range([height, 0]).nice();

    /**
     * Draw.
     */
    const items = visContainer.selectAll("g.item").data(data);
    items
      .enter()
      .append("g")
      .attr("class", "item")
      .call(enterItems)
      .merge(items)
      .call(updateItems);
    items.exit().transition().remove();

    xAxisContainer.call(xAxis);
    yAxisContainer.call(yAxis);
  }

  /**
   * Called when new items added.
   */
  function enterItems(selection) {
    selection
      .append("path")
      .attr("class", "q95-area")
      .attr("fill", (d, i) => q95Colors[i])
      .style("opacity", 0.5)
      .attr("stroke", "none")
      .attr("d", q95Area);

    selection
      .append("path")
      .attr("class", "q75-area")
      .attr("fill", (d, i) => q75Colors[i])
      .style("opacity", 0.5)
      .attr("stroke", "none")
      .attr("d", q75Area);

    selection
      .append("path")
      .attr("class", "med-line")
      .attr("fill", "none")
      .style("opacity", 0.5)
      .attr("stroke", (d, i) => medColors[i])
      .style("stroke-width", "2px")
      .attr("d", medLine);
  }

  /**
   * Called when items updated.
   */
  function updateItems(selection) {
    selection.each(function (d) {
      const container = d3.select(this);
      container.select(".q95-area").attr("d", q95Area);
      container.select(".q75-area").attr("d", q75Area);
      container.select(".med-line").attr("d", medLine);
    });
  }

  /**
   * Sets/gets the width of the visualization.
   */
  module.width = function (value) {
    if (!arguments.length) return visWidth;
    visWidth = value;
    return this;
  };

  /**
   * Sets/gets the height of the visualization.
   */
  module.height = function (value) {
    if (!arguments.length) return visHeight;
    visHeight = value;
    return this;
  };

  /**
   * Sets/gets the colors of median lines.
   */
  module.medColors = function (value) {
    if (!arguments.length) return medColors;
    medColors = value;
    return this;
  };

  return module;
}
