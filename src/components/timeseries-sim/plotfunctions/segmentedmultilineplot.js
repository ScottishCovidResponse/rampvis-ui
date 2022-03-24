import * as d3 from "d3";
import { lastIndexOf } from "lodash";

export function SegmentedMultiLinePlot(response, firstRunForm) {
  // align labels

  d3.select("#segmentedchart").html(""); //clear charts
  d3.select("#chartTitle").html(""); //clear charts title
  d3.select("#vis-example-container").html("");
  const parseTime = d3.timeParse("%Y-%m-%d"); // date parser (str to date)
  const formatTime = d3.timeFormat("%b %d"); // date formatter (date to str)
  const strTime = d3.timeFormat("%Y-%m-%d");

  const labelYPoints = (height, font, n) => {
    let arr = [];
    let count = n;
    let max = height;
    while (count > 0) {
      arr.push(max);
      max -= font;
      count -= 1;
    }

    if (arr.some((v) => v < 0)) {
      font -= 1;
      return labelYPoints(height, font, n);
    } else {
      return { font: font, points: arr.reverse() };
    }
  };

  const labelLinePoints = (lastDate, lastValue, labelStretch, yPoint, font) => {
    let arr = [];
    let noJumps = 5;
    let [count_x, count_y] = [
      labelStretch / noJumps,
      (yPoint - font / 3 - lastValue) / noJumps,
    ];

    while (noJumps >= 0) {
      arr.push([lastDate, lastValue]);
      lastDate += count_x;
      lastValue += count_y;
      noJumps -= 1;
    }
    return arr;
  };

  const kFormatter = (num) =>
    Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);

  //--- Graph Formatting ---//

  const width = 800;
  const height = 200;
  const margin = 0;
  const adj = 35;
  const fontSize = 12;
  const labelStretch = 20;

  //------------------------//

  const queryColor = "#FF6600";
  const otherColor = "#9ea2a5";
  const queryStrokeWidth = 4;
  const otherStrokeWidth = 2;
  const dataSegmented = Array.from(response); // data including all values from 01-01-2021 for the data stream
  console.log(dataSegmented.length);

  dataSegmented.map((response) => {
    const method = response.method;
    let dataFiltered = Array.from(response.data);
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

    const xScale = d3
      .scaleTime()
      .range([0, width])
      .domain(d3.extent(dateRange)); //xscale for dates
    const yScale = d3.scaleLinear().rangeRound([height, 0]).domain([min, max]); //yscale for measurements

    const yaxis = d3.axisLeft(yScale); //y-axis on the left
    const xaxis = d3.axisBottom(xScale); //x-axis on the bottom
    xaxis.tickFormat((d, i) => dateRange[i]); //x-ticks alignment with data
    xaxis.tickFormat(formatTime); //x-ticks formating
    xaxis.ticks(4);
    yaxis.ticks(4);
    yaxis.tickFormat(kFormatter);
    const keyDomain = dataFiltered.map((d) => d.key); // list of group names
    const colorRange = dataFiltered
      .map((streams) => streams.isQuery)
      .map((bools) => (bools ? queryColor : otherColor)); //color picking for query and other streams
    const strokeRange = dataFiltered
      .map((streams) => streams.isQuery)
      .map((bools) => (bools ? queryStrokeWidth : otherStrokeWidth)); //stroke width picking

    const color = d3.scaleOrdinal().domain(keyDomain).range(colorRange); // color picker
    const strokeWidth = d3.scaleOrdinal().domain(keyDomain).range(strokeRange); // stroke width picker

    const targetCountry = firstRunForm.targetCountry;

    d3.select("#segmentedchart")
      .append("div")
      .attr("class", "vis-example-container")
      .attr("id", "segmented" + " " + method)
      .style("width", "100%")
      .style("height", "100%")
      .style("margin", margin);

    let canvas = document.getElementById("segmented" + " " + method);
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
      .style("font-size", "14px")
      .style("color", queryColor);

    //y-axis
    svg
      .append("g")
      .attr("class", "yaxis")
      .call(yaxis)
      .selectAll("text")
      .style("font-size", "14px");

    //multi-line drawer

    const queryStream = dataFiltered.filter((stream) => stream.isQuery);
    const otherStreams = dataFiltered.filter((stream) => !stream.isQuery);
    svg
      .selectAll(".line")
      .data(otherStreams)
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

    svg
      .selectAll(".line")
      .data(queryStream)
      .enter()
      .append("path")
      .attr("class", "multiline")
      .attr("id", (d) => d.key)
      .attr("fill", "none")
      .attr("stroke", (d) => color(d.key))
      .attr("stroke-width", (d) => strokeWidth(d.key))
      .attr("d", (d) =>
        d3
          .line()
          .x(function (d, i) {
            return xScale(dateRange[i]);
          })
          .y((d) => yScale(d.value))(d.values),
      );
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text(`${method}`);

    let labelArray = dataFiltered.map((streams) => {
      const country = streams.key;
      const lastValue = streams.values[streams.values.length - 1].value;
      const isQuery = streams.isQuery;
      return { key: country, end: lastValue, isQuery: isQuery };
    });
    const lastDate = dateRange[dateRange.length - 1];

    labelArray.sort((a, b) => (a.end < b.end ? 1 : -1)); // sort array by descending of endpoint

    const yPoints = labelYPoints(height, fontSize, labelArray.length); // calculate ypoints of labels

    let labelData = labelArray.map((streams, i) => ({
      ...streams,
      yPoint: yPoints.points[i],
      line: labelLinePoints(
        xScale(lastDate),
        yScale(streams.end),
        labelStretch,
        yPoints.points[i],
        yPoints.font,
      ),
    }));

    svg
      .selectAll("myLabels")
      .data(labelData)
      .enter()
      .append("g")
      .append("text")
      .attr("class", "myLabels")
      .attr("id", (d) => d.key)
      .attr("transform", function (d) {
        return "translate(" + xScale(lastDate) + "," + d.yPoint + ")";
      }) // Put the text at the position of the last point
      .attr("x", labelStretch) // shift the text a bit more right
      .text(function (d) {
        return d.key;
      })
      .style("fill", function (d) {
        return color(d.key);
      })
      .style("font-size", yPoints.font + "px");

    svg
      .selectAll(".line")
      .data(labelData)
      .enter()
      .append("path")
      .attr("class", "multiline")
      .attr("id", (d) => d.key + "labelLine")
      .attr("fill", "none")
      .attr("stroke", (d) => color(d.key))
      .attr("stroke-width", 1)
      .attr("d", (d) =>
        d3
          .line()
          .x((d) => d[0])
          .y((d) => d[1])(d.line),
      )
      .style("stroke-dasharray", "3,3");

    const lineMouseEnter = (d) => {
      svg.selectAll(".multiline").attr("visibility", "hidden");
      svg.selectAll(".myLabels").attr("visibility", "hidden");

      svg
        .selectAll(".multiline")
        .filter(function () {
          return (
            d3.select(this).attr("id") == d.key ||
            d3.select(this).attr("id") == targetCountry ||
            d3.select(this).attr("id") == d.key + "labelLine" ||
            d3.select(this).attr("id") == targetCountry + "labelLine"
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
    svg
      .selectAll(".myLabels")
      .on("mouseenter", lineMouseEnter)
      .on("mouseleave", lineMouseLeave);

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

    // playground - label maker  //

    // exit  //
  });

  d3.select("#segmentedcard").style("visibility", "visible");
}
