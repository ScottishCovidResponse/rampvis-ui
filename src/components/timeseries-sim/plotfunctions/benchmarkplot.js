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
  const height = 400;
  const margin = 5;
  const adj = 50;

  const spaceRemove = (key) => {
    if (key.split(" ").length === 1) {
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



  const colorRange = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a']
  const countries = Object.keys(dataTime[0].value)
  const color = d3.scaleOrdinal().domain(countries).range(colorRange)
  const queryColor = "#FF6600";
  const otherColor = "#9ea2a5";

  const queryStrokeWidth = 8;
  const otherStrokeWidth = 4;

  console.log(countries)

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

    const linedata = streams.value
    const countries = Object.keys(linedata)

    const graphObj = countries.map((country) => {

      const linedatum = linedata[country]
      const dates = Object.keys(linedatum)
      const values = Object.values(linedatum)
      const d3Obj = dates.map((date, i) => {
        return { date: date, value: values[i] }
      })

      return { key: country, data: d3Obj }



    })

    const xScale = xScales[i]
    const yScale = yScales[i]

    d3.select("#graph" + streams.key)
      .selectAll(".line")
      .data(graphObj)
      .enter()
      .append("path")
      .attr("class", "multiline")
      .attr("id", (d) => streams.key + '/' + spaceRemove(d.key))
      .attr("fill", "none")
      .attr("stroke", (d) => color(d.key))
      .attr("stroke-width", otherStrokeWidth)
      .attr("d", (d) =>
        d3
          .line()
          .x((d) =>
            xScale(parseTime(d.date)))
          .y((d) =>
            yScale(d.value))(d.data)

      );
    d3.select("#graph" + streams.key)
      .append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(streams.key.split("_")
        .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
        .join(" "));

    d3.select("#graph" + streams.key)
      .selectAll("myLabels")
      .data(graphObj)
      .enter()
      .append("g")
      .append("text")
      .attr("class", "myLabels")
      .attr("id", (d) => spaceRemove(d.key))
      .datum(function (d) {
        return { name: d.key, value: d.data[d.data.length - 1] };
      }) // keep only the last value of each time series
      .attr("transform", function (d) {
        return (
          "translate(" +
          xScale(dateRanges[0][dateRanges[0].length - 1]) +
          "," +
          yScale(d.value.value) +
          ")"
        );
      })
      .text(function (d) {
        return d.name;
      })
      .style("fill", function (d) {
        return color(d.name);
      })
      .style("font-size", "20px");

    d3.select("#graph" + streams.key).selectAll(".multiline")
      .on("mouseenter", function (d) {

        const [stream, country] = d3.select(this)["_groups"][0][0]["attributes"]["id"]["nodeValue"].split("/");

        d3.select("#graph" + stream).selectAll(".multiline").filter(function () {
          return (
            d3.select(this).attr("id") != stream + "/" + country
          )
        }).attr("visibility", "hidden")

        d3.select("#graph"+stream).selectAll(".myLabels").filter(function () {
          return (
            d3.select(this).attr("id") !== country
          )}).attr("visibility", "hidden")
        })
      .on("mouseleave",function (d) {

        const [stream, country] = d3.select(this)["_groups"][0][0]["attributes"]["id"]["nodeValue"].split("/")
        d3.select("#graph" + stream).selectAll(".multiline").attr("visibility","visible")
        d3.select("#graph"+stream).selectAll(".myLabels").attr("visibility","visible")
      })









  })










}
