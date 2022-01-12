import * as d3 from "d3";
import Common from "./common";

export class UncertaintySampleAndMean {
  GAP = 10;


  constructor(options) {
    //Optional input arguments and their default values
    let heightfactor = options.heightfactor ? options.heightfactor : 1
    let widthfactor = options.widthfactor ? options.widthfactor : 1
    let meanLineColor = options.meanLineColor ? options.meanLineColor : "#E00015";
    let sampleLineColor = options.sampleLineColor ? options.sampleLineColor : "#A6CCD8";
    let containerChart = options.containerChart ? options.containerChart : "charts";
    let yMax = options.yMax ? options.yMax : 0;

    //Color scheme
    const baseColor = options.baseColor?  options.baseColor : ["#4f4f4f"];
    const textColor = options.textColor? options.textColor: ["#4f4f4f"];
    const textWeight = options.textWeight? options.textWeight: 700;

    const CHART_HEIGHT = (window.innerHeight - Common.MAIN_CONTENT_GAP) * heightfactor;
    const CHART_WIDTH = document.getElementById(containerChart).offsetWidth * widthfactor;
    //To avoid loading multiple times
    d3.select("#" + options.chartElement).html("");
    d3.select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container")
      .attr("id", "vis-example-container")
      .style("width", CHART_WIDTH + "px")
      .style("height", CHART_HEIGHT + "px");

    //Load JSON containing all time series and mean time serie
    const data = options.data[0].values;
    //unpack the data for all the time series and for the mean time series 
    const dataAll = data.dataAll;
    const dataMean = data.dataMean;
    const runName = data.runName //Name of column denoting the different runs
    const timeName = data.timeName //Name of column with the time unit
    const quantityName = data.quantityName //Name of column with the quantity of interest

    let canvas = document.getElementById("vis-example-container");
    // set the dimensions and margins of the graph
    let margin = { top: 5, right: 250, bottom: 55, left: 80 },
      width = CHART_WIDTH - margin.left - margin.right,
      height = CHART_HEIGHT - margin.top - margin.bottom;

    const sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
      .key(d => d[runName])
      .entries(dataAll);

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

    // Add X axis
    const x = d3.scaleLinear() //THE PLUS SIGN IS SUPER IMPORTANT IT MAKES THE VALUE BE TREATED AS A NUMBER!
      .domain(d3.extent(dataAll, d => +d[timeName]))
      .range([0, width]);
    const xAxis = d3.axisBottom(x).ticks(5);

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, Math.max(d3.max(dataAll, d => +d[quantityName]), yMax)])
      .range([height, 0]);

    const yAxis = d3.axisLeft(y).ticks(5);

    // Compute X axis values for the mean
    const xMean = d3.scaleLinear() //THE PLUS SIGN IS SUPER IMPORTANT IT MAKES THE VALUE BE TREATED AS A NUMBER!
      .domain(d3.extent(dataMean, d => +d[timeName]))
      .range([0, width]);

    // Compute Y axis values for the mean
    const yMean = d3.scaleLinear()
      .domain([0, Math.max(d3.max(dataAll, d => +d[quantityName]), yMax)])
      .range([height, 0]);

    //Axis Labels
    let yLabelContainer = g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(quantityName) //MAKE INPUT
      .attr("font-size", "18")
      .attr("font-weight", 500);

    let xLabelContainer = g.append("text")
      .attr("x", (width / 2))
      .attr("y", (height + margin.top + 35))
      .style("text-anchor", "middle")
      .text(timeName)
      .attr("font-size", "18")
      .attr("font-weight", 500);

    // Draw the line
    let allLines = g.selectAll(".line")
      .data(sumstat)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", sampleLineColor)
      .style('stroke-opacity', '0.2')
      .attr("stroke-width", 1.5)
      .attr("d", function (d) {
        return d3.line()
          .x(d => x(+d[timeName]))
          .y(d => y(+d[quantityName]))
          (d.values)
      });

    // Add the mean line
    let meanLine = g.append("path")
      .datum(dataMean)
      .attr("fill", "none")
      .attr("stroke", meanLineColor)
      .attr("stroke-width", 3.5)
      .attr("d", d3.line()
        .x(d => xMean(+d[timeName]))
        .y(d => yMean(+d[quantityName]))
      )


    //declare xAxis element variable to be used in resize function
    let xAxisEL = g.append("g").call(xAxis);
    xAxisEL
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("font-size", "15")
      .style("fill", textColor)
      .attr("font-weight", textWeight);

    //declare yAxis element variable to be used in resize function
    let yAxisEL = g.append("g").call(yAxis);
    yAxisEL
      .attr("class", "axis axis--y")
      .selectAll("text")
      .attr("class", "axis-title")
      .attr("font-size", "15")
      .style("fill", textColor)
      .attr("font-weight", textWeight);
    let gap = this.GAP;

    //declare resize function
    function resize() {
      let h = (window.innerHeight - Common.MAIN_CONTENT_GAP - gap) * heightfactor;
      let card = document.getElementById(containerChart);
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

      //update mean x and y range
      xMean.range([0, w - margin.left - margin.right]);
      yMean.range([h - margin.top - margin.bottom, 0]);

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

      //update all lines
      allLines.attr("d", function (d) {
        return d3.line()
          .x(d => x(+d[timeName]))
          .y(d => y(+d[quantityName]))
          (d.values)
      })
      //update mean linea
      meanLine.attr("d", d3.line()
        .x(d => xMean(+d[timeName]))
        .y(d => yMean(+d[quantityName]))
      )
      xLabelContainer
        .attr("x", ((w - margin.left - margin.right) / 2))
        .attr("y", (h - margin.top - margin.bottom + margin.top + 40))
      yLabelContainer
        .attr("y", - margin.left)
        .attr("x", 0 - ((h - margin.top - margin.bottom) / 2))
      console.log("resizing")
    }

    // resize when window size changes
    d3.select(window).on("resize", resize);
  }
}
