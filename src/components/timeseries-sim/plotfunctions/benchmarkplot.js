import * as d3 from "d3";
export function benchmarkPlot(data) {
  //------ DATA and Graph Functions ------//

  console.log("benchmarkPlot: data = ", data);

  d3.select("#countryCompare").html(""); //clear charts

  const parseTime = d3.timeParse("%Y-%m-%d"); // date parser (str to date)
  const formatTime = d3.timeFormat("%b %d"); // date formatter (date to str)

  const dataTime = data.filter((item) => item.key !== "categorical_variables");

  const width = 1275.5;
  const height = 400;
  const margin = 5;
  const adj = 50;
  const fontSize = 20;
  const labelStretch = 20;

  const spaceRemove = (key) => {
    if (key.split(" ").length === 1) {
      return key;
    } else {
      return key.split(" ").join("");
    }
  };

  const labelYPoints = (height, font, n, minLabel, maxLabel) => {
    let arr = [];
    let count = n;
    let min = 0;
    let max = height;
    let top = Math.max(maxLabel - (maxLabel - min) / 2, min);
    let bottom = Math.min(minLabel + (max - minLabel) / 2, max);
    let remainingArea = bottom - top - 2 * font;
    let remainingFill = (n - 2) * font;
    let gap = remainingArea - remainingFill;
    if (gap < 0) {
      font -= 1;
      return labelYPoints(height, font, n, minLabel, maxLabel);
    } else {
      let stretch = gap / (n - 2) + font;
      while (count > 1) {
        arr.push(top);
        top += stretch;
        count -= 1;
      }
      arr.push(bottom);

      return { font: font, points: arr };
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

  const colorRange = [
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
  ];
  const countries = Object.keys(dataTime[0].value);
  const color = d3.scaleOrdinal().domain(countries).range(colorRange);
  const otherStrokeWidth = 4;

  const dateRanges = dataTime
    .map((item) => item.value)
    .map((item) => Object.entries(item))
    .map((item) => item.map((stream) => stream[1]))
    .map((dates) => Object.keys(dates[0]))
    .map((dates) => dates.map((date) => parseTime(date))); // get dates for each graph
  const xScales = dateRanges.map((dateRange) =>
    d3.scaleTime().range([0, width]).domain(d3.extent(dateRange)),
  );
  const xAxes = xScales.map((xScale, i) =>
    d3.axisBottom(xScale).tickFormat((d, j) => dateRanges[i][j]),
  );
  xAxes.map((xAxis) => xAxis.tickFormat(formatTime));

  const maxes = dataTime
    .map((item) => item.value)
    .map((item) => Object.entries(item))
    .map((item) =>
      Math.max(...item.map((stream) => Math.max(...Object.values(stream[1])))),
    );

  const mins = dataTime
    .map((item) => item.value)
    .map((item) => Object.entries(item))
    .map((item) =>
      Math.min(...item.map((stream) => Math.min(...Object.values(stream[1])))),
    );

  const yScales = maxes.map((max, i) =>
    d3.scaleLinear().rangeRound([height, 0]).domain([mins[i], max]),
  );

  const yAxes = yScales.map((yScale) => d3.axisLeft(yScale).ticks(3));

  dataTime.map((streams, i) => {
    d3.select("#xaxis" + spaceRemove(streams.key)).call(xAxes[i]);
    d3.select("#yaxis" + spaceRemove(streams.key)).call(yAxes[i]);

    const linedata = streams.value;
    const countries = Object.keys(linedata);

    const graphObj = countries.map((country) => {
      const linedatum = linedata[country];
      const dates = Object.keys(linedatum);
      const values = Object.values(linedatum);
      const d3Obj = dates.map((date, i) => {
        return { date: date, value: values[i] };
      });

      return { key: country, data: d3Obj };
    });

    const xScale = xScales[i];
    const yScale = yScales[i];

    d3.select("#graph" + spaceRemove(streams.key))
      .selectAll(".line")
      .data(graphObj)
      .enter()
      .append("path")
      .attr("class", "multiline")
      .attr("id", (d) => spaceRemove(streams.key) + "/" + spaceRemove(d.key))
      .attr("fill", "none")
      .attr("stroke", (d) => color(d.key))
      .attr("stroke-width", otherStrokeWidth)
      .attr("d", (d) =>
        d3
          .line()
          .x((d) => xScale(parseTime(d.date)))
          .y((d) => yScale(d.value))(d.data),
      );
    d3.select("#graph" + spaceRemove(streams.key))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(
        streams.key
          .split("_")
          .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
          .join(" "),
      );

    // playground //

    let labelArray = graphObj.map((streams) => {
      const country = streams.key;
      const lastValue = streams.data[streams.data.length - 1].value;
      return { key: country, end: lastValue };
    });

    const lastDate = graphObj[0].data[graphObj[0].data.length - 1].date;

    labelArray.sort((a, b) => (a.end < b.end ? 1 : -1)); // sort array by descending of endpoint

    console.log("array", labelArray);
    const minLabel = yScale(labelArray[labelArray.length - 1].end);
    const maxLabel = yScale(labelArray[0].end);
    console.log(minLabel, maxLabel);
    const yPoints = labelYPoints(
      height,
      fontSize,
      labelArray.length,
      minLabel,
      maxLabel,
    ); // calculate ypoints of labels

    let labelData = labelArray.map((streams, i) => ({
      ...streams,
      yPoint: yPoints.points[i],
      line: labelLinePoints(
        xScale(parseTime(lastDate)),
        yScale(streams.end),
        labelStretch,
        yPoints.points[i],
        yPoints.font,
      ),
    }));

    //console.log(labelData)

    d3.select("#graph" + spaceRemove(streams.key))
      .selectAll(".myLabels")
      .data(labelData)
      .enter()
      .append("g")
      .append("text")
      .attr("class", "myLabels")
      .attr("id", (d) => spaceRemove(streams.key) + "/" + spaceRemove(d.key))
      .attr("transform", function (d) {
        return (
          "translate(" + xScale(parseTime(lastDate)) + "," + d.yPoint + ")"
        );
      }) // Put the text at the position of the last point
      .attr("x", labelStretch) // shift the text a bit more right
      .text(function (d) {
        return d.key;
      })
      .style("fill", function (d) {
        return color(d.key);
      })
      .style("font-size", yPoints.font + "px");

    d3.select("#graph" + spaceRemove(streams.key))
      .selectAll(".line")
      .data(labelData)
      .enter()
      .append("path")
      .attr("class", "labelLine")
      .attr("id", (d) => spaceRemove(streams.key) + "/" + spaceRemove(d.key))
      .attr("fill", "none")
      .attr("stroke", (d) => color(d.key))
      .attr("stroke-width", 2)
      .attr("d", (d) =>
        d3
          .line()
          .x((d) => d[0])
          .y((d) => d[1])(d.line),
      )
      .style("stroke-dasharray", "3,3");

    d3.select("#graph" + streams.key)
      .selectAll(".multiline")
      .on("mouseenter", function (d) {
        const [stream, country] = d3
          .select(this)
          ["_groups"][0][0]["attributes"]["id"]["nodeValue"].split("/");

        console.log(country);
        d3.select("#graph" + stream)
          .selectAll(".multiline")
          .filter(function () {
            return d3.select(this).attr("id") != stream + "/" + country;
          })
          .attr("visibility", "hidden");
        d3.select("#graph" + stream)
          .selectAll(".labelLine")
          .filter(function () {
            return d3.select(this).attr("id") != stream + "/" + country;
          })
          .attr("visibility", "hidden");

        d3.select("#graph" + stream)
          .selectAll(".myLabels")
          .filter(function () {
            return d3.select(this).attr("id") !== stream + "/" + country;
          })
          .attr("visibility", "hidden");
      })
      .on("mouseleave", function (d) {
        const [stream, country] = d3
          .select(this)
          ["_groups"][0][0]["attributes"]["id"]["nodeValue"].split("/");
        d3.select("#graph" + stream)
          .selectAll(".multiline")
          .attr("visibility", "visible");
        d3.select("#graph" + stream)
          .selectAll(".labelLine")
          .attr("visibility", "visible");
        d3.select("#graph" + stream)
          .selectAll(".myLabels")
          .attr("visibility", "visible");
      });

    d3.select("#graph" + streams.key)
      .selectAll(".myLabels")
      .on("mouseenter", function (d) {
        const [stream, country] = d3
          .select(this)
          ["_groups"][0][0]["attributes"]["id"]["nodeValue"].split("/");

        d3.select("#graph" + stream)
          .selectAll(".multiline")
          .filter(function () {
            return d3.select(this).attr("id") != stream + "/" + country;
          })
          .attr("visibility", "hidden");
        d3.select("#graph" + stream)
          .selectAll(".labelLine")
          .filter(function () {
            return d3.select(this).attr("id") != stream + "/" + country;
          })
          .attr("visibility", "hidden");

        d3.select("#graph" + stream)
          .selectAll(".myLabels")
          .filter(function () {
            return d3.select(this).attr("id") !== stream + "/" + country;
          })
          .attr("visibility", "hidden");
      })
      .on("mouseleave", function (d) {
        const [stream, country] = d3
          .select(this)
          ["_groups"][0][0]["attributes"]["id"]["nodeValue"].split("/");
        d3.select("#graph" + stream)
          .selectAll(".multiline")
          .attr("visibility", "visible");
        d3.select("#graph" + stream)
          .selectAll(".labelLine")
          .attr("visibility", "visible");
        d3.select("#graph" + stream)
          .selectAll(".myLabels")
          .attr("visibility", "visible");
      });
  });
}
