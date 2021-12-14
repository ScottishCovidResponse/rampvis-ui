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

/**
 * Stacked Bar Chart.
 */
export function stackedBarChart() {
  /**
   * Visual configs.
   */
  let margin = { top: 10, right: 10, bottom: 10, left: 10 };

  let visWidth = 960,
    visHeight = 600, // Size of the visualization, including margins
    width,
    height; // Size of the main content, excluding margins

  /**
   * Accessors.
   */
  let label = (d) => d.label;

  /**
   * Data binding to DOM elements.
   */
  let data;

  /**
   * DOM.
   */
  let visContainer, itemContainer, xAxisContainer, yAxisContainer;

  /**
   * D3.
   */
  const xScale = d3.scaleBand().padding(0.1),
    yScale = d3.scaleLinear(),
    xAxis = d3.axisBottom().scale(xScale),
    yAxis = d3.axisLeft().scale(yScale).ticks(5);
  let colorScale;

  /**
   * Main entry of the module.
   */
  function module(selection) {
    selection.each(function (_data) {
      if (!this.visInitialized) {
        visContainer = d3
          .select(this)
          .append("g")
          .attr("class", "pv-stacked-bar-chart");
        xAxisContainer = visContainer.append("g").attr("class", "x-axis");
        yAxisContainer = visContainer.append("g").attr("class", "y-axis");
        itemContainer = visContainer.append("g").attr("class", "items");

        this.visInitialized = true;
      }

      data = _data;
      update();
    });
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
    const series = d3.stack().keys(data.columns)(data);
    series.forEach((d, i) => {
      d['url'] = data.urls[i];
    });

    xScale.domain(data.map(label)).range([0, width]);
    yScale
      .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
      .nice()
      .range([height, 0]);

    /**
     * Draw.
     */
    const g = itemContainer
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", ({ key }) => colorScale(key));
      
    g.selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => xScale(label(d.data)))
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .append("title")
      .text(function (d) {
        const key = d3.select(this.parentNode.parentNode).datum().key;
        return `${label(d.data)}: ${key} (${d.data[key]})`;
      });

    g.on('mouseover', function(d) {
      if (d.url) {
        this.style.cursor = 'pointer';
      }
    }).on('click', function(d) {
      if (d.url) {
        window.open(d.url);
      }
    });

    xAxisContainer
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
    yAxisContainer.call(yAxis);
  }

  /**
   * Sets/gets the margin of the visualization.
   */
  module.margin = function (value) {
    if (!arguments.length) return margin;
    margin = value;
    return this;
  };

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
   * Sets/gets the color scale.
   */
  module.colorScale = function (value) {
    if (!arguments.length) return colorScale;
    colorScale = value;
    return this;
  };

  return module;
}
