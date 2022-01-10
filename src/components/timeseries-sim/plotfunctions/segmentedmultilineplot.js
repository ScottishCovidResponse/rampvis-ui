import * as d3 from "d3";

export function SegmentedMultiLinePlot(response, firstRunForm) {
  // align labels

  d3.select("#segmentedchart").html(""); //clear charts
  d3.select("#chartTitle").html(""); //clear charts title
  d3.select("#vis-example-container").html("");
  const parseTime = d3.timeParse("%Y-%m-%d"); // date parser (str to date)
  const formatTime = d3.timeFormat("%b %d"); // date formatter (date to str)
  const strTime = d3.timeFormat("%Y-%m-%d");

  //--- Graph Formatting ---//

  const width = 1400;
  const height = 600;
  const margin = 50;
  const adj = 50;

  //------------------------//

  const queryColor = "#FF6600";
  const otherColor = "#9ea2a5";
  const queryStrokeWidth = 8;
  const otherStrokeWidth = 4;

  const dataSegmented = Array.from(response); // data including all values from 01-01-2021 for the data stream

  let dataFiltered = Array.from(dataSegmented);
  dataFiltered = dataFiltered.map(function (streams) {
    // data for matched period
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

  const max = Math.max(
    ...dataFiltered.map((streams) =>
      Math.max(...streams.values.map((values) => values.value)),
    ),
  ); //get max value for y range
  const min = Math.min(
    ...dataFiltered.map((streams) =>
      Math.min(...streams.values.map((values) => values.value)),
    ),
  ); //get min value for x range
  const dateRange = dataFiltered
    .filter((streams) => streams.isQuery)[0]
    .values.map((values) => values.date)
    .map(parseTime); // get query dates and parse

  const xScale = d3.scaleTime().range([0, width]).domain(d3.extent(dateRange)); //xscale for dates
  const yScale = d3.scaleLinear().rangeRound([height, 0]).domain([min, max]); //yscale for measurements

  const yaxis = d3.axisLeft(yScale); //y-axis on the left
  const xaxis = d3.axisBottom(xScale); //x-axis on the bottom
  xaxis.tickFormat((d, i) => dateRange[i]); //x-ticks alignment with data
  xaxis.tickFormat(formatTime); //x-ticks formating

  const keyDomain = dataFiltered.map((d) => d.key); // list of group names
  const colorRange = dataFiltered
    .map((streams) => streams.isQuery)
    .map((bools) => (bools ? queryColor : otherColor)); //color picking for query and other streams
  const strokeRange = dataFiltered
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

  d3.select("#segmentedchart")
    .append("div")
    .attr("class", "vis-example-container")
    .attr("id", "vis-example-container")
    .style("width", "100%")
    .style("height", "100%")
    .style("margin", margin);

  let canvas = document.getElementById("vis-example-container");
  const svg = d3
    .select(canvas)
    .append("svg")
    .attr("preserveAspectRatio", "xMaxYMax meet")
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

  //x-axis
  svg
    .append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis)
    .selectAll("text")
    .attr("transform", "translate(0,20)")
    .style("font-size", "20px")
    .style("color", queryColor);

  //y-axis
  svg
    .append("g")
    .attr("class", "yaxis")
    .call(yaxis)
    .selectAll("text")
    .style("font-size", "20px");

  //multi-line drawer
  svg
    .selectAll(".line")
    .data(dataFiltered)
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
        .x(function (d, i) {
          return xScale(dateRange[i]);
        })
        .y((d) => yScale(d.value))(d.values),
    );

  // add labels at the end of lines (!!OVERLAY ALGORITHM WILL BE IMPLEMENTED!!) //

  svg
    .selectAll("myLabels")
    .data(dataFiltered)
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
        xScale(dateRange[dateRange.length - 1]) +
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
    .style("font-size", "20px");

  //line interaction for changing visibility

  const lineMouseEnter = (d) => {
    svg.selectAll(".multiline").attr("visibility", "hidden");
    svg.selectAll(".myLabels").attr("visibility", "hidden");

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

    axisChange(d.key);
  };

  const lineMouseLeave = () => {
    svg.selectAll(".multiline").attr("visibility", "visible");
    svg.selectAll(".myLabels").attr("visibility", "visible");
    axisChange(targetCountry);
  };

  //add interaction to all lines

  svg
    .selectAll(".multiline")
    .on("mouseenter", lineMouseEnter)
    .on("mouseleave", lineMouseLeave);

  // add title

  document.getElementById(
    "chartTitle",
  ).innerHTML = `${indicator} matches for ${targetCountry} from ${formatTime(
    parseTime(firstDate),
  )} to ${formatTime(parseTime(lastDate))}`;
  document.getElementById("chartTitle").style.textAlign = "center";

  // --- CONSOLE / PROT --- //

  const xticks = d3.select(".xaxis");
  const dateArray = Array.prototype.slice
    .call(xticks._groups[0][0].childNodes)
    .filter((nodes) => nodes.nodeName === "g")
    .map((nodes) => nodes.__data__); // get dates on the axis smart
  const dateIndex = dateArray.map(strTime).map((date) =>
    dataFiltered
      .filter((streams) => streams.isQuery)[0]
      .values.map((values) => values.date)
      .indexOf(date),
  ); // get index of those date from data
  const dateObj = dataFiltered.map(function (streams) {
    // create object to store date labels for all lines for mouse interaction
    return {
      key: streams.key,
      xLabels: dateIndex.map((i) => streams.values[i].date),
    };
  });

  const axisChange = (d) => {
    //mouse interaction to change x-axis dates by manipulating .text() of parsed ticks above
    const filter = d;
    const filteredDateObj = dateObj.filter(
      (streams) => streams.key === filter,
    )[0];
    let count = 0;
    d3.select(".xaxis")
      .selectAll("g")
      .selectAll("text")
      .each(function () {
        d3.select(this).text(
          formatTime(parseTime(filteredDateObj.xLabels[count])),
        );
        d3.select(this).style("color", color(d));
        count = count + 1;
      });
  };
  d3.select("#segmentedcard").style("visibility","visible")
}
