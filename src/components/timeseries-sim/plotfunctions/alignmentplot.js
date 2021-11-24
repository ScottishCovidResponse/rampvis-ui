import * as d3 from "d3";
import { data } from "jquery";

export function alignmentPlot(response, firstRunForm) {
  //------ DATA and Graph Functions ------//

  const parseTime = d3.timeParse("%Y-%m-%d"); // date parser (str to date)
  const formatTime = d3.timeFormat("%b %d"); // date formatter (date to str)
  const strTime = d3.timeFormat("%Y-%m-%d");

  const width = 1400;
  const height = 200;
  const margin = 10;
  const adj = 50;

  const queryColor = "#FF6600";
  const otherColor = "#9ea2a5";

  const queryStrokeWidth = 8;
  const otherStrokeWidth = 4;

  d3.select("#alignmentchart").html(""); //clear charts

  // create individual containers for individual charts <div> <svg/> </div>

  const GraphData = [...response.data];
  GraphData.map(function (streams) {
    // Graph Data which includes additional attributes for drawing

    streams.maxValue = Math.max(
      ...streams.values.map((values) => values.value),
    );
    streams.minValue = Math.min(
      ...streams.values.map((values) => values.value),
    );
    streams.dateRange = streams.values
      .map((values) => values.date)
      .map(parseTime);
    streams.xScale = d3
      .scaleTime()
      .range([0, width])
      .domain(d3.extent(streams.dateRange));
    streams.yScale = d3
      .scaleLinear()
      .rangeRound([height, 0])
      .domain([streams.minValue, streams.maxValue]);
    streams.xAxis = d3
      .axisBottom(streams.xScale)
      .tickFormat((d, i) => streams.dateRange[i])
      .tickFormat(formatTime);
    streams.yAxis = d3.axisLeft(streams.yScale).ticks(3);

    return streams;
  });

  let layout = d3 // creating individual regions for alignment plots
    .select("#alignmentchart")
    .selectAll("div")
    .data(GraphData)
    .enter()

    .append("div")
    .attr("id", (d, i) => "container" + i)
    .style("width", "100%")
    .style("height", height * 1.5 + "px")
    .style("margin", margin) // add divs for individual alignment plots

    .append("svg")
    .attr("id", (d, i) => "graph" + i)
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

  layout // add x-axis region to call xAxis func
    .append("g")
    .attr("class", "xaxis")
    .attr("id", (d, i) => "xaxis" + i)
    .attr("transform", "translate(0," + height + ")");

  layout // add y-axis region to call yAxis func
    .append("g")
    .attr("class", "yaxis")
    .attr("id", (d, i) => "yaxis" + i);

  layout // add path to each subplot for line drawing
    .append("path")
    .attr("class", "myline")
    .attr("id", (d, i) => "path" + i);

  layout
    .append("g")
    .attr("class", "label")
    .attr("id", (d, i) => "label" + i);

  layout
    .append("path")
    .attr("class", "highlight")
    .attr("id", (d, i) => "highlight" + i);

  GraphData.map(function (streams, i) {
    d3.select("#xaxis" + i).call(streams.xAxis); // call individual xaxis properties
    d3.select("#yaxis" + i).call(streams.yAxis); // call individual yaxis properties
    d3.select("#path" + i) // add lines
      .datum(streams.values)
      .attr("fill", "none")
      .attr("stroke", otherColor)
      .attr("stroke-width", otherStrokeWidth)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return streams.xScale(parseTime(d.date));
          })
          .y(function (d) {
            return streams.yScale(d.value);
          }),
      );
    d3.select("#label" + i) // add labels at the end of the lines
      .append("text")
      .attr("id", "labeltext" + i)
      .datum(function (d) {
        return { name: d.key, value: d.values[d.values.length - 1] };
      })
      .attr("transform", function (d) {
        return (
          "translate(" +
          streams.xScale(streams.dateRange[streams.dateRange.length - 1]) +
          "," +
          streams.yScale(d.value.value) +
          ")"
        );
      })
      .attr("x", 12)
      .text(function (d) {
        return d.name;
      });
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

  dataFiltered.map(function (streams, i) {
    d3.select("#highlight" + i)
      .datum(streams.values)
      .attr("fill", queryColor)
      .attr(
        "d",
        d3
          .area()
          .x(function (d) {
            return streams.xScale(parseTime(d.date));
          })
          .y1(function (d) {
            return streams.yScale(d.value);
          })
          .y0(function () {
            return streams.yScale(streams.minValue);
          }),
      );
  });

  /*


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
        .style("font-size", "10px");

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

    document.getElementById("chartTitle").innerHTML = `${indicator} matches for ${targetCountry} from ${formatTime(parseTime(firstDate))} to ${formatTime(parseTime(lastDate))}`
    document.getElementById("chartTitle").style.textAlign = "center"

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




    */
}
