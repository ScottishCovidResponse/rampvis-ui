/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
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
/* eslint-disable no-multi-assign */
/* eslint-disable radix */

import * as d3 from "d3";
import Common from "./common";

export class SensitivityStackedBarChart {
  GAP = 10;
  CHART_WIDTH = document.getElementById("charts").offsetWidth;
  CHART_HEIGHT = window.innerHeight - Common.MAIN_CONTENT_GAP;

  constructor(options) {
    //To avoid loading multiple times
    d3.select("#" + options.chartElement).html("");
    d3.select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container")
      .attr("id", "vis-example-container")
      .style("width", this.CHART_WIDTH + "px")
      .style("height", this.CHART_HEIGHT + "px");
    let data = options.data;
    let canvas = document.getElementById("vis-example-container");

    // set the dimensions and margins of the graph
    let margin = { top: 20, right: 150, bottom: 80, left: 90 },
      width = this.CHART_WIDTH - margin.left - margin.right,
      height = this.CHART_HEIGHT - margin.top - margin.bottom;
    let svg = d3
      .select(canvas)
      .append("svg")
      .attr("width", this.CHART_WIDTH)
      .attr("height", this.CHART_HEIGHT - this.GAP);
    svg
      .append("rect")
      .attr("id", "rect")
      .attr("fill", "#ffffff")
      .attr("width", this.CHART_WIDTH)
      .attr("height", this.CHART_HEIGHT - this.GAP);

    let g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const parameterName = ["Parameter"]; //Of columns ith parameter names

    data.forEach((d) => (d["SI"] = d["ST"] - d["S1"])); //Compute interaction

    var subgroups = ["S1", "SI"];

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3
      .map(data, function (d) {
        return d[parameterName];
      })
      .keys();

    // Add X axis
    const y = d3.scaleBand().domain(groups).range([0, height]).padding([0.2]);

    const yAxis = d3.axisLeft(y).tickSizeOuter(0);
    // Add Y axis
    const x = d3
      .scaleLinear()
      .domain([0, d3.max([1, d3.max(data, (d) => d["ST"])])]) //domain is from 0 to 1 or the the maximum sobol index if this is greater than 1
      .range([0, width]);

    const xAxis = d3.axisBottom(x);
    var color = d3.scaleOrdinal().domain(subgroups).range(["blue", "red"]);

    // ----------------
    // Create a tooltip
    // ----------------
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tool-tip-bar-chart") //needs to be tool-tip-bar chart
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("text-align", "left");

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (d) {
      console.log("OVER!");
      var subgroupName = d3.select(this.parentNode).datum().key;
      var subgroupValue = d.data[subgroupName];
      tooltip
        .html(
          "Sensitivity index: " +
            subgroupName +
            "<br>" +
            "Value: " +
            subgroupValue,
        )
        .style("opacity", 1);
    };
    const mousemove = function (d) {
      tooltip
        .style("left", d3.event.pageX + 30 + "px")
        .style("top", d3.event.pageY - 10 + "px")
        .style("display", "inline-block");
    };
    const mouseleave = function (d) {
      tooltip.style("opacity", 0);
    };
    var stackedData = d3.stack().keys(subgroups)(data);
    // Draw bar chart
    let bars = g
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", function (d) {
        return color(d.key);
      })
      .attr("stroke", "black")
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function (d) {
        return d;
      })
      .enter()
      .append("rect")
      .attr("y", (d) => y(d.data[parameterName]))
      .attr("x", (d) => x(d[0]))
      .attr("width", (d) => d3.max([0, -x(d[0]) + x(d[1])]))
      .attr("height", y.bandwidth())
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    //declare xAxis element variable to be used in resize function
    let yAxisEL = g.append("g").call(yAxis);
    yAxisEL
      .attr("class", "axis axis--y")
      .selectAll("text")
      .attr("class", "axis-title")
      .attr("font-size", "15");

    //declare yAxis element variable to be used in resize function
    let xAxisEL = g.append("g").call(xAxis);
    xAxisEL
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)")
      .attr("font-size", "15");

    let gap = this.GAP;

    //declare resize function
    function resize() {
      let h = window.innerHeight - Common.MAIN_CONTENT_GAP - gap;
      let card = document.getElementById("charts");
      let w = card.offsetWidth;

      canvas.style.width = card.offsetWidth + "px";
      canvas.style.height = h + "px";

      //resize svg size
      svg.attr("width", card.offsetWidth).attr("height", h);

      //resize rect
      let rectEL = document.getElementById("rect");
      rectEL.setAttribute("width", w);
      rectEL.setAttribute("height", h);

      //update x and y range
      x.range([0, w - margin.left - margin.right]);
      y.range([h - margin.top - margin.bottom, 0]);

      //rescale
      xAxis.scale(x);
      yAxis.scale(y);

      //update axis element
      xAxisEL
        .attr(
          "transform",
          "translate(0," + (h - margin.top - margin.bottom) + ")",
        )
        .call(xAxis);
      yAxisEL.call(yAxis);

      //update bars
      bars
        .attr("y", (d) => y(d.data[parameterName]))
        .attr("x", (d) => x(d[0]))
        .attr("width", (d) => d3.max([0, -x(d[0]) + x(d[1])]))
        .attr("height", y.bandwidth());
    }

    // resize when window size changes
    d3.select(window).on("resize.updatesvg", resize);
  }
}
