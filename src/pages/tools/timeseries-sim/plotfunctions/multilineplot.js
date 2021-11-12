import * as d3 from "d3";
import { findMaxValue, findMinValue } from "./miscfuncs";

export function MultiLinePlot(response, firstRunForm) {
  const data = response.data;
  const width = 960;
  const height = 500;
  const margin = 5;
  const padding = 100;
  const adj = 100;
  d3.select("#charts").html("");
  d3.select("#legend").html("");
  d3.select("#slider-range").html("");
  const svg = d3
    .select("#charts")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr(
      "viewBox",
      "-" +
        adj +
        " -" +
        adj +
        " " +
        (width + adj * 3) +
        " " +
        (height + adj * 3),
    )
    .style("padding", padding)
    .style("margin", margin)
    .classed("svg-content", true);

  const parseTime = d3.timeParse("%Y-%m-%d");
  const formatTime = d3.timeFormat("%B %d, %Y");

  const minValue = findMinValue(data);
  const maxValue = findMaxValue(data);
  const targetID = firstRunForm.targetCountry + " " + firstRunForm.lastDate;
  const target = data[targetID];
  var date_lst = [];
  for (const i in target) {
    date_lst.push(target[i]["date"]);
  }
  const dateRange = date_lst.map(parseTime);

  const xScale = d3.scaleTime().range([0, width]).domain(d3.extent(dateRange));
  const yScale = d3
    .scaleLinear()
    .rangeRound([height, 0])
    .domain([minValue, maxValue]);

  const yaxis = d3.axisLeft(yScale);

  const xaxis = d3.axisBottom(xScale);
  xaxis.tickFormat((d, i) => dateRange[i]);
  xaxis.tickFormat(formatTime);

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis)
    .selectAll("text")
    .attr("transform", "translate(0,60) rotate(-45)")
    .style("font-size", "20px");

  svg
    .append("g")
    .attr("class", "axis")
    .call(yaxis)
    .selectAll("text")
    .style("font-size", "20px");

  const line = d3
    .line()
    .x(function (d) {
      return xScale(parseTime(d.date));
    }) // set the x values for the line generator
    .y(function (d) {
      return yScale(d.measurement);
    });

  let color = d3
    .scaleOrdinal()
    .domain(data)
    .range([
      "#a6cee3",
      "#1f78b4",
      "#b2df8a",
      "#33a02c",
      "#fb9a99",
      "#e31a1c",
      "#fdbf6f",
      "#ff7f00",
      "#cab2d6",
      "#6a3d9a",
      "#ffff99",
    ]);
  let count = 0;
  let legends = Object.keys(data);
  const legendsbox = d3
    .select("#legend")
    .append("div")
    .attr("background-color", "#9ea2a5")
    .append("ul");

  for (const i in data) {
    svg
      .append("path")
      .datum(data[i])
      .attr("fill", "none")
      .attr("stroke", color(count))
      .attr("stroke-width", 5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);

    legendsbox
      .append("li")
      .style("color", color(count))
      .style("font-size", "20px")
      .append("span")
      .style("color", "black")
      .style("font-size", "10px")
      .text(legends[count].split(" ")[0]);
    count += 1;
  }
}
