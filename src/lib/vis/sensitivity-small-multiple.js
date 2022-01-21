import * as d3 from "d3";
import Common from "./common";

export class SensitivitySmallMultiple {
  GAP = 10;


  constructor(options) {
    //Optional input arguments and their default values
    let heightfactor = options.heightfactor ? options.heightfactor : 1
    let widthfactor = options.widthfactor ? options.widthfactor : 1
    let meanLineColor = options.meanLineColor ? options.meanLineColor : "#E00015";
    let sampleLineColor = options.sampleLineColor ? options.sampleLineColor : "#A6CCD8";
    let sampleDotColor = options.sampleDotColor ? options.sampleDotColor : "#4171D9";
    let containerChart = options.containerChart ? options.containerChart : "charts";
    let yMax = options.yMax ? options.yMax : 0;
    console.log("sensitivity small-multiple")
    //Color scheme
    const baseColor = options.baseColor ? options.baseColor : ["#4f4f4f"];
    const textColor = options.textColor ? options.textColor : ["#4f4f4f"];
    const textWeight = options.textWeight ? options.textWeight : 700;
    
    
    //Load JSON containing all time series and mean time serie
    const data = options.data[0].values;
    //unpack the data for all the time series and for the mean time series 
    const dataAll = data.dataAll;
    const dataMean = data.dataMean;
    const runName = "iter" //Name of column denoting the different runs
    const timeName = data.timeName //Name of column with the time unit
    const quantityName = data.quantityName //Name of column with the quantity of interest
        
    const sumstattop = d3.nest() // nest function allows to group the calculation per level of a factor
      .key(d => d["parameter"])
      .entries(data);

    const allKeys = sumstattop.map((d) => d.key)
    const smallPlotHeight = 175;

    const CHART_WIDTH = document.getElementById(containerChart).offsetWidth * widthfactor;

    const n_rows = Math.floor(CHART_WIDTH/smallPlotHeight)
    const n_columns = Math.ceil(allKeys.length/(n_rows-1))
    let CHART_HEIGHT = (window.innerHeight - Common.MAIN_CONTENT_GAP) * heightfactor;
    CHART_HEIGHT < (CHART_WIDTH)/(n_rows-1) ? CHART_HEIGHT =  CHART_HEIGHT : CHART_HEIGHT = ((CHART_WIDTH)/(n_rows-1))*n_columns
    //To avoid loading multiple times
    d3.select("#" + options.chartElement).html("");
    d3.select("#" + options.chartElement)
      .append("div")
      .attr("class", "vis-example-container")
      .attr("id", "vis-example-container")
      .style("width", (CHART_WIDTH) + "px")
      .style("height", (CHART_HEIGHT)+ "px")

    let canvas = document.getElementById("vis-example-container");
    // set the dimensions and margins of the graph
    
    let margin = { top: 20, right: 10, bottom: 45, left: 70 },
      width = smallPlotHeight*1.15 - margin.left - margin.right,
      height = smallPlotHeight - margin.top - margin.bottom;
    console.log("CHARTHEIGHT ", CHART_HEIGHT)
    console.log("height ", height)

    // Handmade legend
    
    let svgLegend = d3.select(canvas)
    .selectAll("legend")
    .data([1])
    .enter()
    .append("svg")
    .attr("width", CHART_WIDTH)
    .attr("height", 30)
    .append("g")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");
    
    svgLegend.append("circle").attr("cx",30).attr("cy",20).attr("r", 3.5).style("fill", sampleDotColor)
    svgLegend.append("line").attr("x1", 125).attr("x2",140).attr("y1", 20).attr("y2",20).style("stroke", meanLineColor).attr("stroke-width", 3.9)
    svgLegend.append("line").attr("x1", 330).attr("x2",345).attr("y1", 20).attr("y2",20).style("stroke", sampleLineColor).attr("stroke-width", 3.9)
    svgLegend.append("text").attr("x", 40).attr("y", 20).text("Data Points").style("font-size", "15px").attr("alignment-baseline","middle")
    svgLegend.append("text").attr("x", 145).attr("y", 20).text("Mean of Emulated Curves").style("font-size", "15px").attr("alignment-baseline","middle")
    svgLegend.append("text").attr("x", 350).attr("y", 20).text("Emulated Curves").style("font-size", "15px").attr("alignment-baseline","middle")

    let svg = d3.select(canvas)
      .selectAll("uniqueChart")
      .data(sumstattop)
      .enter()
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    let x_temp = (dIn) => d3.scaleLinear()
      .domain(d3.extent(dIn.values[0].dataPoints, (d) => d.x))
      .range([0, width]).nice();
    // set Y scales
    let y_temp = (dIn) => d3.scaleLinear()
      .domain(d3.extent(dIn.values[0].dataPoints, (d) => d.y))
      .range([height, 0]).nice();
      console.log("sumstattop[0]", sumstattop[0])
      console.log("x inside range", x_temp(sumstattop[0])(10000))
      console.log("x outside range", Math.max(x_temp(sumstattop[0])(-10000),0))
        // Add all lines
        svg
        .append("g")
        .selectAll(".line")
        .data(d => {
          const sumstat = d3.nest()
            .key(d => d[runName])
            .entries(d.values[0].dataAll);
          return sumstat
        })
        .join("path")
        .attr("fill", "none")
        .attr("stroke", sampleLineColor)
        .style('stroke-opacity', '0.4')
        .attr("stroke-width", 2.0)
        .attr("d", function (d) {
          return d3.line()
            .x(d => {return Math.min(width, Math.max(x_temp(d3.select(this.parentNode.parentNode.parentNode).datum())(d.x),0));})
            .y(d => {return Math.min(height, Math.max(y_temp(d3.select(this.parentNode.parentNode.parentNode).datum())(d.y),0));})
            (d.values)
        });


    // Add dots
    svg
      .append("g")
      .selectAll("dot")
      .data(d => { return d.values[0].dataPoints; })
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x_temp(d3.select(this.parentNode.parentNode.parentNode).datum())(d.x); })
      .attr("cy", function (d) { return y_temp(d3.select(this.parentNode.parentNode.parentNode).datum())(d.y); })
      .attr("r", 2.5)
      .style("fill", sampleDotColor) //"#69b3a2"


        //Add mean lines
        svg
          .append("path")
          .attr("fill", "none")
          .attr("stroke", meanLineColor)
          .attr("stroke-width", 3.9)
          .attr("d", function (d) {

            let dIn = d
            let thisSvg = (d3.select(this.parentNode.parentNode))
            thisSvg.append("g")
              .call(d3.axisBottom(x_temp(dIn)).ticks(3))
              .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
            thisSvg.append("g")
              .call(d3.axisLeft(y_temp(dIn)).ticks(5))
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            thisSvg.selectAll("text").attr("font-size", "11").attr("font-weight", 400)
            return d3.line()
              .x(function (d) {
                return x_temp(dIn)(d.x);
              })
              .y(function (d) {
                return y_temp(dIn)(+d.y);
              })
              (d.values[0].dataMean)
          })
        
        // Add labels
        svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("y", + (smallPlotHeight - margin.top - margin.bottom) + 32)
        .attr("x", (smallPlotHeight - margin.left - margin.right)/2 - 20 )
        .text(function(d){ return(d.key)})
        .style("fill", textColor )
        .attr("font-size", "14")
        .attr("font-weight", textWeight)
        
        svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("y", -52)
        .attr("x", -120)
        .text(function(d){ return(d.values[0].scalarFeature + " of " + d.values[0].quantityName)})
        .attr("transform", "rotate(-90)")
        .style("fill", textColor )
        .attr("font-size", "12")
        .attr("font-weight", 400)
      }
}
