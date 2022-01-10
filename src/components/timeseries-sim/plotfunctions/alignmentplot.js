
import * as d3 from "d3";

export function alignmentPlot(data, timeSeriesBag, setTimeSeriesBag) {
  //------ DATA and Graph Functions ------//

  console.log("alignmentPlot: data = ", data);


  const spaceRemove = (key) => {
    if (key.split(" ").length === 1) {
      return key
    }
    else {
      return key.split(" ").join("")
    }
  }

  const parseTime = d3.timeParse("%Y-%m-%d"); // date parser (str to date)
  const formatTime = d3.timeFormat("%b %d"); // date formatter (date to str)

  const width = 1275.5;
  const height = 150;
  const margin = 5;
  const adj = 50;

  const queryColor = "#FF6600";
  const otherColor = "#9ea2a5";

  const queryStrokeWidth = 8;
  const otherStrokeWidth = 4;

  d3.select("#alignmentchart").html(""); //clear charts

  // create individual containers for individual charts <div> <svg/> </div>

  const GraphData = data;

  let checkState = {}
  GraphData.forEach((streams) => {
    const identifier = streams.key + " " + streams.matchedPeriodEnd
    checkState[identifier] = "false"
  });

  console.log(checkState)
  const dateRange = GraphData
    .filter((streams) => streams.isQuery)[0]
    .values.map((values) => values.date)
    .map(parseTime); // get query dates and parse

  const xScale = d3.scaleTime().range([0, width]).domain(d3.extent(dateRange)); //xscale for dates
  const xAxis = d3.axisBottom(xScale); //x-axis on the bottom
  xAxis.tickFormat((d, i) => dateRange[i]); //x-ticks alignment with data
  xAxis.tickFormat(formatTime); //x-ticks formating

  const max = Math.max(
    ...GraphData.map((streams) =>
      Math.max(...streams.values.map((values) => values.value)),
    ),
  ); //get max value for y range
  const min = Math.min(
    ...GraphData.map((streams) =>
      Math.min(...streams.values.map((values) => values.value)),
    ),
  );

  const yScale = d3.scaleLinear()
    .rangeRound([height, 0])
    .domain([min, max]);

  const yAxis = d3.axisLeft(yScale).ticks(3);

  let layout = d3 // creating individual regions for alignment plots
    .select("#alignmentchart")
    .selectAll("div")
    .data(GraphData)
    .enter()

    .append("div")
    .attr("id", (d) => "alignmentContainer" + spaceRemove(d.key))
    .style("width", "100%")
    .style("height", height*2 + "px")
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
    .style("font-size", "20px")

  layout // add y-axis region to call yAxis func
    .append("g")
    .attr("class", "yaxis")
    .attr("id", (d) => "yaxis" + spaceRemove(d.key))
    .style("font-size", "20px");

  layout // add path to each subplot for line drawing
    .append("path")
    .attr("class", "myline")
    .attr("id", (d) => "path" + spaceRemove(d.key));

  layout
    .append("g")
    .attr("class", "label")
    .attr("id", (d) => "label" + spaceRemove(d.key))
    .style("font-size", "20px");

  layout
    .append("path")
    .attr("class", "highlightLine")
    .attr("id", (d) => "highlightLine" + spaceRemove(d.key));


  layout
    .append("path")
    .attr("class", "highlightArea")
    .attr("id", (d) => "highlightArea" + spaceRemove(d.key));



  const updateTimeSeriesBag = (d) => {
    const identifier = d.key + " " + d.matchedPeriodEnd
    console.log(timeSeriesBag)
    if (!timeSeriesBag.includes(identifier) && checkState[identifier] === "false") {
      setTimeSeriesBag((old) => [...old, identifier]);
      checkState[identifier] = "true";
      timeSeriesBag.push(identifier);
      d3.select("#alignmentContainer" + spaceRemove(d.key)).attr("style", "outline: thin solid red;") 
    }
    else if (timeSeriesBag.includes(identifier) && checkState[identifier] === "true") {
      setTimeSeriesBag((old) => [...old.filter(item => item !== identifier)]);
      checkState[identifier] = "false";
      timeSeriesBag = timeSeriesBag.filter(item => item !== identifier);
      d3.select("#alignmentContainer" + spaceRemove(d.key)).attr("style", "outline: none;") 
    }

  }

  GraphData.map(function (streams) {
    d3.select("#xaxis" + spaceRemove(streams.key)).call(xAxis); // call individual xaxis properties
    d3.select("#yaxis" + spaceRemove(streams.key)).call(yAxis); // call individual yaxis properties
    d3.select("#path" + spaceRemove(streams.key)) // add lines
      .datum(streams.values)
      .attr("fill", "none")
      .attr("stroke", otherColor)
      .attr("stroke-width", otherStrokeWidth)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return xScale(parseTime(d.date));
          })
          .y(function (d) {
            return yScale(d.value);
          }),
      );
    d3.select("#label" + spaceRemove(streams.key)) // add labels at the end of the lines
      .append("text")
      .attr("id", "labeltext" + streams.key)
      .datum(function (d) {
        return { name: d.key, value: d.values[d.values.length - 1] };
      })
      .attr("transform", function (d) {
        return (
          "translate(" +
          xScale(dateRange[dateRange.length - 1]) +
          "," +
          yScale(d.value.value) +
          ")"
        );
      })
      .attr("x", 12)
      .text(function (d) {
        return d.name;
      });

    d3.select("#alignmentContainer" + spaceRemove(streams.key))
      .on("click", updateTimeSeriesBag)

  });



  let dataFiltered = Array.from(GraphData);
  dataFiltered = dataFiltered.map(function (streams) {
    let start = parseTime(streams.matchedPeriodStart);
    let end = parseTime(streams.matchedPeriodEnd);
    let values = streams.values;
    let filteredValues = values.filter(function (values) {
      if (start <= parseTime(values.date) && end >= parseTime(values.date)) {
        return values;
      }
    });
    streams.values = filteredValues;
    return streams;
  });


  dataFiltered.map(function (streams) {
    d3.select("#highlightLine" + spaceRemove(streams.key))
      .datum(streams.values)
      .attr("fill", "none")
      .attr("stroke", queryColor)
      .attr("stroke-width", queryStrokeWidth)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return xScale(parseTime(d.date));
          })
          .y(function (d) {
            return yScale(d.value);
          })

      );

    d3.select("#highlightArea" + spaceRemove(streams.key))
      .datum(streams.values)
      .attr("fill", "lightsteelblue")
      .attr("opacity", "0.2")
      .attr(
        "d",
        d3
          .area()
          .x(function (d) {
            return xScale(parseTime(d.date));
          })
          .y1(function () {
            return yScale(max);
          })
          .y0(function () {
            return yScale(min);
          }),
      );

  });

  d3.select("#alignmentcard").style("visibility", "visible");

}
