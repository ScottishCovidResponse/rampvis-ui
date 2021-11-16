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

    //loading data from stream
    let data = options.data[0].values;
    data.forEach((d) => (d["SI"] = d["ST"] - d["S1"])); //Compute interaction
    //data.columns = Object.keys(data[0])
    let canvas = document.getElementById("vis-example-container");
    // set the dimensions and margins of the graph
    let margin = { top: 20, right: 250, bottom: 80, left: 110 },
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

    const parameterName = ["index"]; //name of columns with parameter name

    var subgroups = ["S1", "SI"];

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3
      .map(data, function (d) {
        return d[parameterName];
      })
      .keys();

    //Color scheme
    const colors = ["#0587AC", "#035870"];
    const baseColour = ["#4f4f4f"];
    const textColour = ["#4f4f4f"];
    const textWeight = 700;
    // Add X axis
    const y = d3.scaleBand().domain(groups).range([0, height]).padding([0.2]);

    const yAxis = d3.axisLeft(y).tickSizeOuter(0);
    // Add Y axis
    const x = d3
      .scaleLinear()
      .domain([0, d3.max([1, d3.max(data, (d) => d["ST"])])]) //domain is from 0 to 1 or the the maximum sobol index if this is greater than 1
      .range([0, width]);

    const xAxis = d3.axisBottom(x);
    var color = d3.scaleOrdinal().domain(subgroups).range(colors);
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
      tooltip
        .html("S1: " + d.data.S1 + "<br>" + "SI: " + d.data.SI)
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
      .attr("stroke", baseColour)
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
    //Axiis Labels
    let yLabelContainer = g
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Parameters") //MAKE INPUT
      .attr("font-size", "25");

    let xLabelContainer = g
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 40)
      .style("text-anchor", "middle")
      .text("Magnitude of Sobol Sensitivity Index")
      .attr("font-size", "25");
    //Add legend
    var keys = ["Main Effect", "Interaction"];
    //var legendcolor = d3.scaleOrdinal().domain(keys).range(colors);
    let legendX = (x) => x - 100;

    //Function to place the labels and dots vertically
    const yPlacement = (d, i) => i * 25;
    // Add one dot in the legend for each name.

    let legendDot = g
      .selectAll("mydots")
      .data(keys)
      .enter()
      .append("circle")
      .attr("cx", legendX(width))
      .attr("cy", yPlacement) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", (d) => color(d))
      .attr("stroke", baseColour);

    // Add one dot in the legend for each name.
    let legendText = g
      .selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
      .attr("x", legendX(width) + 20)
      .attr("y", yPlacement) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", textColour)
      .attr("font-weight", textWeight)
      .attr("font-size", "15")
      .text((d) => d)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");

    //declare xAxis element variable to be used in resize function
    let yAxisEL = g.append("g").call(yAxis);
    yAxisEL
      .attr("class", "axis axis--y")
      .selectAll("text")
      .attr("class", "axis-title")
      .attr("dx", "-0.2em")
      .attr("font-weight", textWeight)
      .attr("font-size", "15")
      .style("fill", textColour);

    //declare yAxis element variable to be used in resize function
    let xAxisEL = g.append("g").call(xAxis);
    xAxisEL
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dy", "1.25em")
      .attr("font-weight", textWeight)
      .attr("font-size", "15")
      .style("fill", textColour);

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

      //update legend
      legendDot
        .attr("cx", legendX(w - margin.left - margin.right))
        .attr("cy", yPlacement); // 100 is where the first dot appears. 25 is the distance between dots
      legendText
        .attr("x", legendX(w - margin.left - margin.right) + 20)
        .attr("y", yPlacement); // 100 is where the first dot appears. 25 is the distance between dots

      xLabelContainer
        .attr("x", (w - margin.left - margin.right) / 2)
        .attr("y", h - margin.top - margin.bottom + margin.top + 40);
      yLabelContainer
        .attr("y", -margin.left)
        .attr("x", 0 - (h - margin.top - margin.bottom) / 2);
    }

    // resize when window size changes
    d3.select(window).on("resize.updatesvg", resize);
  }
}
