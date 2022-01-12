import * as d3 from "d3";
import Common from "./common";

export class SensitivityParameterRangeTickChart {
  GAP = 10;
  constructor(options) {

    // Setting default values of inputs using ? ternary operator.
    let heightfactor = options.heightfactor ? options.heightfactor : 1
    let widthfactor = options.widthfactor ? options.widthfactor : 1
    let divId = options.divId ? options.divId : 'charts';

    //Color scheme
    const baseColor = options.baseColor ? options.baseColor : ["#4f4f4f"];
    const textColor = options.textColor ? options.textColor : ["#4f4f4f"];
    const textWeight = options.textWeight ? options.textWeight : 700;
    const fillOpacity = 0.2;
    const tickWidthPx = 2;
    const tickOpacity = 0.6;

    const CHART_HEIGHT = (window.innerHeight - Common.MAIN_CONTENT_GAP) * heightfactor;
    const CHART_WIDTH = document.getElementById(divId).offsetWidth * widthfactor;
    //To avoid loading multiple times
    d3.select("#" + options.chartElement).html("");
    d3.select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container")
      .attr("id", "parameter-range-container")
      .style("width", CHART_WIDTH + "px")
      .style("height", CHART_HEIGHT + "px");

    //loading data from stream
    let data = options.data[0].values;
    //data.columns = Object.keys(data[0])
    let canvas = document.getElementById("parameter-range-container");
    // set the dimensions and margins of the graph
    let margin = { top: 20, right: 150, bottom: 100, left: 100 },
      width = CHART_WIDTH - margin.left - margin.right,
      height = CHART_HEIGHT - margin.top - margin.bottom;
    let svg = d3
      .select(canvas)
      .append("svg")
      .attr("width", CHART_WIDTH)
      .attr("height", CHART_HEIGHT - this.GAP);
    svg
      .append("rect")
      .attr("id", "rect")
      .attr("fill", "#ffffff")
      .attr("width", CHART_WIDTH)
      .attr("height", CHART_HEIGHT - this.GAP);
    let g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //set default values
    const defaultColors = ["#E69F00", "#009E73", "#DB4D56", "#0072B2", "#D55E00", "#F0E442", "#56B4E9"];
    let colors = options.colors ? options.colors : defaultColors;
    let parameterName = options.parameterName ? options.parameterName : ["name"];

    var groupData = data;
    var k = groupData.length;
    var subgroups = Array.from(Array(k).keys()) //Cluster labels
    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3
      .map(data[0], function (d, i) {
        return d[parameterName];
      })
      .keys();

    // Add X axis
    const y = d3.scaleBand().domain(groups).range([0, height]).padding([0.2]);

    const yAxis = d3.axisLeft(y).tickSizeOuter(0);
    // Add Y axis
    const x = d3
      .scaleLinear()
      .domain([0, 1]) //domain is from 0 to 1 or the the maximum sobol index if this is greater than 1
      .range([0, width]);

    const xAxis = d3.axisBottom(x).ticks(5);
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

    var stackedData = d3.stack().keys(subgroups)(data);
    var widthFactor = 1 / k
    // Draw bar chart
    var k_index = 0;
    groupData = groupData.map((obj, i) => ([...obj.map(d => ({ ...d, k: i }))]))
    // Create array with the data for plotting the ticks showing individual model runs
    let tickData = [].concat(...groupData.map((d, i) => {
      return [].concat(...d.map((obj) => { 
          return obj.rescaledTicks.map((tick) => {
              return { tickLoc: tick, k: i, parameterName: obj[parameterName] } }) || []; })) || [];
    }));
    let bars = g
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(groupData)
      .enter()
      .append("g")
      .attr("fill", function (d, i) {
        return color(i);
      })
      .attr("fill-opacity", fillOpacity)
      .attr("stroke", baseColor)
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function (d) {
        return d;
      })
      .enter()
      .append("rect")
      .attr("y", (d) => { return y(d[parameterName]) + d.k * y.bandwidth() * widthFactor; })
      .attr("x", (d) => x(d.rescaledStart))
      .attr("width", (d) => x(d.rescaledRange))
      .attr("height", y.bandwidth() * widthFactor);

    //Draw the ticks showing individual paramter values
    let ticks = g.selectAll("foo")
      .data(tickData)
      .enter()
      .append("rect")
      .attr("x", function (d) { return x(d.tickLoc) - tickWidthPx/2; })
      .attr("y", (d) => { return y(d.parameterName) + d.k * y.bandwidth() * widthFactor; })
      .attr("width", (d) => tickWidthPx)
      .attr("height", y.bandwidth() * widthFactor)
      .attr("fill-opacity", tickOpacity)
      .style("fill", (d) => color(d.k));

    //Axis Labels
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
      .text(" Normalised Paramter Range")
      .attr("font-size", "23");

    let xLabelContainer2 = g
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 60)
      .style("text-anchor", "middle")
      .text("(Lower/Upper Bounds at 0/1)")
      .attr("font-size", "23");
    //Add legend
    let legendX = (x) => x + 20;

    //Function to place the labels and dots vertically
    const yPlacement = (d, i) => i * 25;
    // Add one dot in the legend for each name.

    let legendDot = g
      .selectAll("mydots")
      .data(subgroups)
      .enter()
      .append("circle")
      .attr("cx", legendX(width))
      .attr("cy", yPlacement) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", (d) => color(d))
      .attr("stroke", baseColor);

    // Add one dot in the legend for each name.
    let legendText = g
      .selectAll("mylabels")
      .data(subgroups)
      .enter()
      .append("text")
      .attr("x", legendX(width) + 20)
      .attr("y", yPlacement) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", textColor)
      .attr("font-weight", textWeight)
      .attr("font-size", "15")
      .text((d) => "Cluster " + d)
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
      .style("fill", textColor);

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
      .style("fill", textColor);

    let gap = this.GAP;

    //declare resize function
    function resize() {
      let h = window.innerHeight - Common.MAIN_CONTENT_GAP - gap;
      let card = document.getElementById(divId);
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
        .attr("y", (d) => { return y(d[parameterName]) + d.k * y.bandwidth() * widthFactor; })
        .attr("x", (d) => x(d.rescaledStart))
        .attr("width", (d) => x(d.rescaledRange))
        .attr("height", y.bandwidth() * widthFactor);

      //update ticks
      ticks      
      .attr("x", function (d) { return x(d.tickLoc) - tickWidthPx/2; })
      .attr("y", (d) => { return y(d.parameterName) + d.k * y.bandwidth() * widthFactor; })
      .attr("width", (d) => tickWidthPx)
      .attr("height", y.bandwidth() * widthFactor)

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

      xLabelContainer
        .attr("x", (w - margin.left - margin.right) / 2)
        .attr("y", h - margin.top - margin.bottom + margin.top + 60);
      yLabelContainer
        .attr("y", -margin.left)
        .attr("x", 0 - (h - margin.top - margin.bottom) / 2);
    }

    // resize when window size changes
    d3.select(window).on("resize.updatesvg", resize);
  }
}
