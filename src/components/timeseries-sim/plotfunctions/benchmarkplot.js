import * as d3 from "d3";
export function benchmarkPlot(data) {
  //------ DATA and Graph Functions ------//

  console.log("benchmarkPlot: data = ", data);

  d3.select("#countryCompare").html(""); //clear charts

  const parseTime = d3.timeParse("%Y-%m-%d"); // date parser (str to date)
  const formatTime = d3.timeFormat("%b %d"); // date formatter (date to str)

  const dataTime = data.filter((item) => item.key !== "categorical_variables");

  const dataCat = data.filter((item) => item.key == "categorical_variables");

  const width = 1275.5;
  const height = 150;
  const margin = 5;
  const adj = 50;

  const spaceRemove = (key) => {
    if (key.split(" ").length == 1) {
      return key
    }
    else {
      return key.split(" ").join("")
    }
  }

  let layout = d3 // creating individual regions for comparison plots
    .select("#countryCompare")
    .selectAll("div")
    .data(dataTime)
    .enter()

    .append("div")
    .attr("id", (d) => spaceRemove(d.key))
    .style("width", "100%")
    .style("height", height * 2 + "px")
    .style("margin", margin) // add divs for individual alignment plots

    .append("svg")
    .attr("id", (d) => "graph" + spaceRemove(d.key))
    .attr("preserveAspectRatio", "xMidYMin")
    .attr(
      "viewBox",
      "-" +
      1.5 * adj +
      " -" +
      adj / 2 +
      " " +
      (width + adj * 5) +
      " " +
      (height + adj * 5),
    )
    .classed("svg-content", true);

  layout // add x-axis region to call xAxis func
    .append("g")
    .attr("class", "xaxis")
    .attr("id", (d) => "xaxis" + spaceRemove(d.key))
    .attr("transform", "translate(0," + height + ")")
    .style("font-size", "15px");

  layout // add y-axis region to call yAxis func
    .append("g")
    .attr("class", "yaxis")
    .attr("id", (d) => "yaxis" + spaceRemove(d.key))
    .style("font-size", "15px");

  layout // add path to each subplot for line drawing
    .append("path")
    .attr("class", "myline")
    .attr("id", (d) => "path" + spaceRemove(d.key));

  layout
    .append("g")
    .attr("class", "label")
    .attr("id", (d) => "label" + spaceRemove(d.key))
    .style("font-size", "15px");


  const queryColor = "#FF6600";
  const otherColor = "#9ea2a5";

  const queryStrokeWidth = 8;
  const otherStrokeWidth = 4;

  const dateRanges = dataTime.map((item) => item.value)
    .map((item) => Object.entries(item))
    .map((item) => item.map(stream => stream[1]))
    .map((dates) => Object.keys(dates[0]))
    .map((dates) => dates.map((date) => parseTime(date))); // get dates for each graph
  const xScales = dateRanges.map((dateRange) => d3.scaleTime().range([0, width]).domain(d3.extent(dateRange)));
  const xAxes = xScales.map((xScale, i) => d3.axisBottom(xScale).tickFormat((d, j) => dateRanges[i][j]));
  xAxes.map((xAxis) => xAxis.tickFormat(formatTime));

  const maxes = dataTime.map((item) => item.value)
    .map((item) => Object.entries(item))
    .map((item) => Math.max(...item.map(stream => Math.max(...Object.values(stream[1])))));

  const mins = dataTime.map((item) => item.value)
    .map((item) => Object.entries(item))
    .map((item) => Math.min(...item.map(stream => Math.min(...Object.values(stream[1])))));

  const yScales = maxes.map((max, i) => d3.scaleLinear()
    .rangeRound([height, 0])
    .domain([mins[i], max]));

  const yAxes = yScales.map(yScale => d3.axisLeft(yScale).ticks(3));

  dataTime.map((streams, i) => {
    d3.select("#xaxis" + spaceRemove(streams.key)).call(xAxes[i]);
    d3.select("#yaxis" + spaceRemove(streams.key)).call(yAxes[i]);
  })


}
