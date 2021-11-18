import * as d3 from "d3";

export function FullMultiLinePlot(response, firstRunForm) {
  //add rectangles to the matched regions//

  d3.select("#charts").html(""); //clear charts
  d3.select("#title").html(""); //clear legends

  const parseTime = d3.timeParse("%Y-%m-%d"); // date parser (str to date)
  const formatTime = d3.timeFormat("%b %d"); // date formatter (date to str)

  //--- Graph Formatting ---//

  const width = 960;
  const height = 500;
  const margin = 5;
  const padding = 100;
  const adj = 100;

  //------------------------//

  const queryColor = "#FF6600";
  const otherColor = "#9ea2a5";
  const queryStrokeWidth = 8;
  const otherStrokeWidth = 4;

  const data = response.data; // data including all values from 01-01-2021 for the data stream

  const max = Math.max(
    ...data.map((streams) =>
      Math.max(...streams.values.map((values) => values.value)),
    ),
  ); //get max value for y range
  const min = Math.min(
    ...data.map((streams) =>
      Math.min(...streams.values.map((values) => values.value)),
    ),
  ); //get min value for x range
  const dateRange = data
    .filter((streams) => streams.isQuery)[0]
    .values.map((values) => values.date)
    .map(parseTime); // get query dates and parse

  const xScale = d3.scaleTime().range([0, width]).domain(d3.extent(dateRange)); //xscale for dates
  const yScale = d3.scaleLinear().rangeRound([height, 0]).domain([min, max]); //yscale for measurements

  const yaxis = d3.axisLeft(yScale); //y-axis on the left
  const xaxis = d3.axisBottom(xScale); //x-axis on the bottom
  xaxis.tickFormat((d, i) => dateRange[i]); //x-ticks alignment with data
  xaxis.tickFormat(formatTime); //x-ticks formating

  const keyDomain = data.map((d) => d.key); // list of group names
  const colorRange = data
    .map((streams) => streams.isQuery)
    .map((bools) => (bools ? queryColor : otherColor)); //color picking for query and other streams
  const strokeRange = data
    .map((streams) => streams.isQuery)
    .map((bools) => (bools ? queryStrokeWidth : otherStrokeWidth)); //stroke width picking

  const color = d3.scaleOrdinal().domain(keyDomain).range(colorRange); // color picker
  const strokeWidth = d3.scaleOrdinal().domain(keyDomain).range(strokeRange); // stroke width picker

  const indicator = firstRunForm.indicator
    .split("_")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" "); // string parsing (new_cases) to (New Cases)
  const targetCountry = firstRunForm.targetCountry;
  const firstDate = firstRunForm.firstDate;
  const lastDate = firstRunForm.lastDate;

  //chart AREA
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

  //x-axis
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis)
    .selectAll("text")
    .attr("transform", "translate(0,20)")
    .style("font-size", "10px")
    .style("color", queryColor);

  //y-axis
  svg
    .append("g")
    .attr("class", "axis")
    .call(yaxis)
    .selectAll("text")
    .style("font-size", "10px");

  //multi-line drawer
  svg
    .selectAll(".line")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "multiline")
    .attr("id", (d) => d.key)
    .attr("fill", "none")
    .attr("stroke", (d) => color(d.key))
    .attr("stroke-width", (d) => strokeWidth(d.key))
    .attr("stroke-opacity", (d) => d.transparency)
    .attr("d", (d) =>
      d3
        .line()
        .x((d) => xScale(parseTime(d.date)))
        .y((d) => yScale(d.value))(d.values),
    );

  d3.selectAll("#" + data[0].key).on("mouseover", function () {
    console.log("success");
  });

  const title = d3.select("#title");

  title
    .append("text")
    .text(
      indicator +
        " matches for " +
        targetCountry +
        " from " +
        formatTime(parseTime(firstDate)) +
        " to " +
        formatTime(parseTime(lastDate)),
    );

  svg
    .selectAll("myLabels")
    .data(data)
    .enter()
    .append("g")
    .append("text")
    .attr("class", "myLabels")
    .attr("id", (d) => d.key)
    .datum(function (d) {
      return { name: d.key, value: d.values[d.values.length - 1] };
    }) // keep only the last value of each time series
    .attr("transform", function (d) {
      return (
        "translate(" +
        xScale(parseTime(d.value.date)) +
        "," +
        yScale(d.value.value) +
        ")"
      );
    }) // Put the text at the position of the last point
    .attr("x", 12) // shift the text a bit more right
    .text(function (d) {
      return d.name;
    })
    .style("fill", function (d) {
      return color(d.name);
    })
    .style("font-size", "10px");

  // Highlighting matched region //

  const dataFiltered = data.map(function (streams) {
    // data filter for matched periods
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

  const relCoef = 0.1;

  const RectCoords = dataFiltered.map(function (streams) {
    // get rectangulaar coordinates
    return {
      key: streams.key,
      startRectCoords: [
        {
          x: streams.values[0].date,
          y: streams.values[0].value * (1 - relCoef),
        },
        {
          x: streams.values[0].date,
          y: streams.values[0].value * (1 + relCoef),
        },
      ],
      endRectCoords: [
        {
          x: streams.values[streams.values.length - 1].date,
          y: streams.values[streams.values.length - 1].value * (1 - relCoef),
        },
        {
          x: streams.values[streams.values.length - 1].date,
          y: streams.values[streams.values.length - 1].value * (1 + relCoef),
        },
      ],
    };
  });

  svg
    .selectAll(".line")
    .data(RectCoords)
    .enter()
    .append("path")
    .attr("class", "rectlines")
    .attr("id", (d) => d.key)
    .attr("stroke", (d) => color(d.key))
    .attr("fill", "none")
    .attr("d", (d) =>
      d3
        .line()
        .x((d) => xScale(parseTime(d.x)))
        .y((d) => yScale(d.y))(d.startRectCoords),
    );

  svg
    .selectAll(".line")
    .data(RectCoords)
    .enter()
    .append("path")
    .attr("class", "rectlines")
    .attr("id", (d) => d.key)
    .attr("stroke", (d) => color(d.key))
    .attr("fill", "none")
    .attr("d", (d) =>
      d3
        .line()
        .x((d) => xScale(parseTime(d.x)))
        .y((d) => yScale(d.y))(d.endRectCoords),
    );

  const lineMouseEnter = (d) => {
    svg.selectAll(".multiline").attr("visibility", "hidden");
    svg.selectAll(".myLabels").attr("visibility", "hidden");
    svg.selectAll(".rectlines").attr("visibility", "hidden");

    svg
      .selectAll(".multiline")
      .filter(function () {
        return (
          d3.select(this).attr("id") == d.key ||
          d3.select(this).attr("id") == targetCountry
        );
      })
      .attr("visibility", "visible");

    svg
      .selectAll(".myLabels")
      .filter(function () {
        return (
          d3.select(this).attr("id") == d.key ||
          d3.select(this).attr("id") == targetCountry
        );
      })
      .attr("visibility", "visible");

    svg
      .selectAll(".rectlines")
      .filter(function () {
        return (
          d3.select(this).attr("id") == d.key ||
          d3.select(this).attr("id") == targetCountry
        );
      })
      .attr("visibility", "visible");
  };

  const lineMouseLeave = (d) => {
    svg.selectAll(".multiline").attr("visibility", "visible");
    svg.selectAll(".myLabels").attr("visibility", "visible");
    svg.selectAll(".rectlines").attr("visibility", "visible");
  };

  svg
    .selectAll(".multiline")
    .on("mouseenter", lineMouseEnter)
    .on("mouseleave", lineMouseLeave);

  console.log(RectCoords);
}
