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
 * Stacked Area Chart with a mirror along horizontal axis.
 */
export function mirroredStackedAreaChart() {
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
  let time = (d) => d.time;

  /**
   * Data binding to DOM elements.
   */
  let data, splitAttribute;

  /**
   * DOM.
   */
  let visContainer,
    itemContainer,
    xAxisContainer,
    yAxisContainerTop,
    yAxisContainerBottom;

  /**
   * D3.
   */
  const xScale = d3.scaleTime(),
    yScaleTop = d3.scaleLinear(),
    yScaleBottom = d3.scaleLinear(),
    xAxis = d3.axisBottom().scale(xScale).ticks(d3.timeWeek),
    yAxisTop = d3.axisLeft().scale(yScaleTop).ticks(5),
    yAxisBottom = d3.axisLeft().scale(yScaleBottom).ticks(5),
    areaTop = d3
      .area()
      .x((d) => xScale(time(d.data)))
      .y0((d) => yScaleTop(d[0]))
      .y1((d) => yScaleTop(d[1])),
    areaBottom = d3
      .area()
      .x((d) => xScale(time(d.data)))
      .y0((d) => yScaleBottom(d[0]))
      .y1((d) => yScaleBottom(d[1]));
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
          .attr("class", "pv-stacked-area-chart");
        xAxisContainer = visContainer.append("g").attr("class", "x-axis");
        yAxisContainerTop = visContainer.append("g").attr("class", "y-axis");
        yAxisContainerBottom = visContainer.append("g").attr("class", "y-axis");
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
    height = (visHeight - margin.top - margin.bottom) / 2;
    visContainer.attr(
      "transform",
      "translate(" + margin.left + "," + margin.top + ")",
    );
    xAxisContainer.attr("transform", "translate(0," + height * 2 + ")");

    /**
     * Computation.
     */
    const seriesTop = d3.stack().keys(data.columns)(data.top);
    const seriesBottom = d3.stack().keys(data.columns)(data.bottom);

    xScale.domain(d3.extent(data.top, time)).range([0, width]);
    yScaleTop
      .domain([0, d3.max(seriesTop, (d) => d3.max(d, (d) => d[1]))])
      .nice()
      .range([height, 0]);
    yScaleBottom
      .domain([0, d3.max(seriesBottom, (d) => d3.max(d, (d) => d[1]))])
      .nice()
      .range([height, height * 2]);

    /**
     * Draw.
     */
    itemContainer
      .selectAll("path.top")
      .data(seriesTop)
      .join("path")
      .attr("class", "top")
      .attr("fill", ({ key }) => colorScale(key))
      .attr("d", areaTop)
      .append("title")
      .text(({ key }) => key);

    itemContainer
      .selectAll("path.bottom")
      .data(seriesBottom)
      .join("path")
      .attr("class", "bottom")
      .attr("fill", ({ key }) => colorScale(key))
      .attr("d", areaBottom)
      .append("title")
      .text(({ key }) => key);

    // Section labels and separator line
    const topSectionLabel = data.top[0][splitAttribute];
    const bottomSectionLabel = data.bottom[0][splitAttribute];
    visContainer
      .selectAll("text.section")
      .data([
        { label: topSectionLabel, y: 20 },
        { label: bottomSectionLabel, y: height * 2 - 20 },
      ])
      .join("text")
      .attr("class", "section")
      .text((d) => d.label)
      .style("fill", "black")
      .style("font-size", "14px")
      .attr("x", 10)
      .attr("y", (d) => d.y);

    visContainer
      .selectAll("line.sep")
      .data([0])
      .join("line")
      .attr("class", "sep")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", height)
      .attr("y2", height)
      .style("stroke", "black");

    xAxisContainer
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .attr("dx", "-.5em")
      .attr("dy", "1em");
    yAxisContainerTop.call(yAxisTop);
    yAxisContainerBottom.call(yAxisBottom);
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

  /**
   * Sets/gets the attribute that is split horizontally.
   */
  module.splitAttribute = function (value) {
    if (!arguments.length) return splitAttribute;
    splitAttribute = value;
    return this;
  };

  return module;
}
