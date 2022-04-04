import * as d3 from "d3";

export function alignmentPlot(
  response,
  indicator,
  timeSeriesBag,
  benchmarkCountries,
  setTimeSeriesBag,
  setBenchmarkCountries,
  setSuccessSnack,
  setSuccessMessage,
  setWarningSnack,
  setWarningMessage,
  setErrorSnack,
  setErrorMessage,
) {
  //------ DATA and Graph Functions ------//

  console.log("alignmentPlot: data = ", response);

  const kFormatter = (num) =>
    Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);

  const spaceRemove = (key) => {
    if (key.split(" ").length === 1) {
      return key;
    } else {
      return key.split(" ").join("");
    }
  };

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
  let checkCountry = [];

  d3.select("#alignmentchart").html(""); //clear charts
  const graphArea = d3.select("#alignmentchart");
  // create individual containers for individual charts <div> <svg/> </div>
  const data = Array.from(response);
  data.map((plots) => {
    const GraphData = Array.from(plots.data);
    const method = plots.method;
    graphArea.append("div").attr("id", (d) => "alignmentchart" + method);
    let checkStateTimeSeries = {};
    GraphData.forEach((streams) => {
      const identifier =
        streams.key +
        " " +
        streams.matchedPeriodEnd +
        " " +
        indicator
          .split("_")
          .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
          .join(" ");
      checkStateTimeSeries[identifier] = "false";
    });

    let checkStateBenchmarkCountries = {};
    GraphData.forEach((streams) => {
      const identifier = streams.key;
      checkStateBenchmarkCountries[identifier] = "false";
    });

    const dateRange = GraphData.filter((streams) => streams.isQuery)[0]
      .values.map((values) => values.date)
      .map(parseTime); // get query dates and parse

    const xScale = d3
      .scaleTime()
      .range([0, width])
      .domain(d3.extent(dateRange)); //xscale for dates
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

    const yScale = d3.scaleLinear().rangeRound([height, 0]).domain([min, max]);

    const yAxis = d3.axisLeft(yScale).ticks(3);
    yAxis.tickFormat(kFormatter);

    let layout = d3 // creating individual regions for alignment plots
      .select("#alignmentchart" + method)
      .selectAll("div")
      .data(GraphData)
      .enter()

      .append("div")
      .attr("id", (d) => "alignmentContainer" + method + spaceRemove(d.key))
      .style("width", width)
      .style("height", height * 2 + "px")
      .style("margin", margin) // add divs for individual alignment plots

      .append("svg")
      .attr("id", (d) => "graph" + method + spaceRemove(d.key))
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
      .attr("id", (d) => "xaxis" + method + spaceRemove(d.key))
      .attr("transform", "translate(0," + height + ")")
      .style("font-size", "20px");

    layout // add y-axis region to call yAxis func
      .append("g")
      .attr("class", "yaxis")
      .attr("id", (d) => "yaxis" + method + spaceRemove(d.key))
      .style("font-size", "20px");

    layout // add path to each subplot for line drawing
      .append("path")
      .attr("class", "myline")
      .attr("id", (d) => "path" + method + spaceRemove(d.key));

    layout
      .append("g")
      .attr("class", "label")
      .attr("id", (d) => "label" + method + spaceRemove(d.key))
      .style("font-size", "20px");

    layout
      .append("path")
      .attr("class", "highlightLine")
      .attr("id", (d) => "highlightLine" + method + spaceRemove(d.key));

    layout
      .append("path")
      .attr("class", "highlightArea")
      .attr("id", (d) => "highlightArea" + method + spaceRemove(d.key));

    const updateTimeSeriesBag = (d) => {
      const identifier =
        d.key +
        " " +
        d.matchedPeriodEnd +
        " " +
        indicator
          .split("_")
          .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
          .join(" ");

      if (
        !timeSeriesBag.includes(identifier) &&
        checkStateTimeSeries[identifier] === "false" &&
        !checkCountry.includes(d.key)
      ) {
        setTimeSeriesBag((old) => [...old, identifier]);
        checkStateTimeSeries[identifier] = "true";
        timeSeriesBag.push(identifier);
        checkCountry.push(d.key);
        d3.select("#alignmentContainer" + method + spaceRemove(d.key)).attr(
          "style",
          "outline: thin solid red;",
        );
        setSuccessSnack(() => true);
        setSuccessMessage(() => d.key + " is added to time-series bag");
      } else if (
        timeSeriesBag.includes(identifier) &&
        checkStateTimeSeries[identifier] === "true" &&
        checkCountry.includes(d.key)
      ) {
        setTimeSeriesBag((old) => [
          ...old.filter((item) => item !== identifier),
        ]);
        checkStateTimeSeries[identifier] = "false";
        checkCountry = checkCountry.filter((country) => !country == d.key);
        timeSeriesBag = timeSeriesBag.filter((item) => item !== identifier);
        setWarningSnack(() => true);
        setWarningMessage(() => d.key + " is removed from time-series bag");
        d3.select("#alignmentContainer" + method + spaceRemove(d.key)).attr(
          "style",
          "outline: none;",
        );
      } else if (
        checkStateTimeSeries[identifier] === "false" &&
        checkCountry.includes(d.key)
      ) {
        setErrorSnack(() => true);
        setErrorMessage(() => d.key + " is already in time-series bag");
      }
    };

    const updateBenchmarkCountries = (d) => {
      const identifier = d.key;

      if (
        !benchmarkCountries.includes(identifier) &&
        checkStateBenchmarkCountries[identifier] === "false"
      ) {
        setBenchmarkCountries((old) => [...old, identifier]);
        checkStateBenchmarkCountries[identifier] = "true";
        benchmarkCountries.push(identifier);
      } else if (
        benchmarkCountries.includes(identifier) &&
        checkStateBenchmarkCountries[identifier] === "true"
      ) {
        setBenchmarkCountries((old) => [
          ...old.filter((item) => item !== identifier),
        ]);
        checkStateBenchmarkCountries[identifier] = "false";
        benchmarkCountries = benchmarkCountries.filter(
          (item) => item !== identifier,
        );
      }
    };

    GraphData.map(function (streams) {
      const identifier =
        streams.key +
        " " +
        streams.matchedPeriodEnd +
        " " +
        indicator
          .split("_")
          .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
          .join(" ") +
        " " +
        method;

      d3.select("#xaxis" + method + spaceRemove(streams.key)).call(xAxis); // call individual xaxis properties
      d3.select("#yaxis" + method + spaceRemove(streams.key)).call(yAxis); // call individual yaxis properties
      d3.select("#path" + method + spaceRemove(streams.key)) // add lines
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
      d3.select("#label" + method + spaceRemove(streams.key)) // add labels at the end of the lines
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

      d3.select("#alignmentContainer" + method + spaceRemove(streams.key)).on(
        "click",
        function (d) {
          updateTimeSeriesBag(d);
          updateBenchmarkCountries(d);
        },
      );
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
      d3.select("#highlightLine" + method + spaceRemove(streams.key))
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
            }),
        );

      d3.select("#highlightArea" + method + spaceRemove(streams.key))
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
  });

  d3.select("#alignmentcard").style("visibility", "visible");
}
