import {
  getListItemSecondaryActionClassesUtilityClass,
  speedDialActionClasses,
} from "@mui/material";
import * as d3 from "d3";
import { parse } from "date-fns";

export function predictPlot(data, country) {
  console.log("predictPlot: data = ", data[0]);

  const spaceRemove = (key) => {
    if (key.split(" ").length === 1) {
      return key;
    } else {
      return key.split(" ").join("");
    }
  };

  const parseTime = d3.timeParse("%Y-%m-%d"); // date parser (str to date)
  const formatTime = d3.timeFormat("%b %d"); // date formatter (date to str)
  const getDaysArray = function (s, e) {
    for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      a.push(new Date(d));
    }
    return a;
  };
  const width = 1275.5;
  const height = 400;
  const margin = 5;
  const adj = 50;

  const queryColor = "#FF6600";
  const meanColor = "#426cab";
  const seriesColor = "#4178ad";
  const validationColor = "#f98433";
  const predictArray = Array.from(data);
  const predictData = predictArray[0];
  const meanCurveData = predictData["meancurves"];
  const queryCurveData = predictData["query"];
  const selectedCurvesData = predictData["series"];
  const queryValidationCurveData = predictData["query_validation"];

  const keys = Object.keys(meanCurveData);
  const validationMimic = {};
  keys.map((key) => {
    if (queryValidationCurveData[key] === "empty") {
      validationMimic[key] = queryCurveData[key];
    } else {
      validationMimic[key] = queryValidationCurveData[key];
    }
  });

  //calculate max/min dates/values for d3 ranges,scales and axis
  const meanCurveMaxes = Object.keys(meanCurveData).map((key) =>
    Math.max(...Object.values(meanCurveData[key])),
  );

  const meanCurveMins = Object.keys(meanCurveData).map((key) =>
    Math.min(...Object.values(meanCurveData[key])),
  );

  const queryCurveMaxes = Object.keys(queryCurveData).map((key) =>
    Math.max(...Object.values(queryCurveData[key])),
  );

  const queryCurveMins = Object.keys(queryCurveData).map((key) =>
    Math.min(...Object.values(queryCurveData[key])),
  );

  const validationCurveMaxes = Object.keys(validationMimic).map((key) =>
    Math.max(...Object.values(validationMimic[key])),
  );

  const validationCurveMins = Object.keys(validationMimic).map((key) =>
    Math.min(...Object.values(validationMimic[key])),
  );

  const selectedCurveMaxes = Object.keys(selectedCurvesData).map((key) =>
    Math.max(
      ...Object.keys(selectedCurvesData[key]).map((stream) =>
        Math.max(...Object.values(selectedCurvesData[key][stream])),
      ),
    ),
  );

  const selectedCurveMins = Object.keys(selectedCurvesData).map((key) =>
    Math.min(
      ...Object.keys(selectedCurvesData[key]).map((stream) =>
        Math.min(...Object.values(selectedCurvesData[key][stream])),
      ),
    ),
  );

  const maxPerGraph = keys.map((d, i) => {
    return Math.max(
      meanCurveMaxes[i],
      queryCurveMaxes[i],
      selectedCurveMaxes[i],
      validationCurveMaxes[i],
    );
  });

  const minPerGraph = keys.map((d, i) => {
    return Math.min(
      meanCurveMins[i],
      queryCurveMins[i],
      selectedCurveMins[i],
      validationCurveMins[i],
    );
  });

  const meanCurveDateMaxes = Object.keys(meanCurveData).map((key) => {
    const dates = Object.keys(meanCurveData[key]).map(parseTime);
    const maxDate = new Date(Math.max(...dates));
    return maxDate;
  });

  const meanCurveDateMins = Object.keys(meanCurveData).map((key) => {
    const dates = Object.keys(meanCurveData[key]).map(parseTime);
    const minDate = new Date(Math.min(...dates));
    return minDate;
  });

  const queryCurveDateMaxes = Object.keys(queryCurveData).map((key) => {
    const dates = Object.keys(queryCurveData[key]).map(parseTime);
    const maxDate = new Date(Math.max(...dates));
    return maxDate;
  });

  const queryCurveDateMins = Object.keys(queryCurveData).map((key) => {
    const dates = Object.keys(queryCurveData[key]).map(parseTime);
    const minDate = new Date(Math.min(...dates));
    return minDate;
  });

  const validationCurveDateMaxes = Object.keys(validationMimic).map((key) => {
    const dates = Object.keys(validationMimic[key]).map(parseTime);
    const maxDate = new Date(Math.max(...dates));
    return maxDate;
  });

  const validationCurveDateMins = Object.keys(validationMimic).map((key) => {
    const dates = Object.keys(validationMimic[key]).map(parseTime);
    const minDate = new Date(Math.min(...dates));
    return minDate;
  });

  const selectedCurveDateMaxes = Object.keys(selectedCurvesData).map((key) => {
    const maxInt = Math.max(
      ...Object.keys(selectedCurvesData[key]).map((stream) =>
        Math.max(
          ...Object.keys(selectedCurvesData[key][stream]).map(parseTime),
        ),
      ),
    );
    const maxDate = new Date(maxInt);
    return maxDate;
  });

  const selectedCurveDateMins = Object.keys(selectedCurvesData).map((key) => {
    const minInt = Math.min(
      ...Object.keys(selectedCurvesData[key]).map((stream) =>
        Math.min(
          ...Object.keys(selectedCurvesData[key][stream]).map(parseTime),
        ),
      ),
    );
    const minDate = new Date(minInt);
    return minDate;
  });

  const maxDatePerGraph = keys.map((d, i) => {
    const maxInt = Math.max(
      meanCurveDateMaxes[i],
      queryCurveDateMaxes[i],
      selectedCurveDateMaxes[i],
      validationCurveDateMaxes[i],
    );
    const maxDate = new Date(maxInt);
    return maxDate;
  });

  const minDatePerGraph = keys.map((d, i) => {
    const minInt = Math.min(
      meanCurveDateMins[i],
      queryCurveDateMins[i],
      selectedCurveDateMins[i],
      validationCurveDateMins[i],
    );
    const minDate = new Date(minInt);
    return minDate;
  });

  const graphDateRanges = keys.map((d, i) => {
    return getDaysArray(minDatePerGraph[i], maxDatePerGraph[i]);
  });

  const xScales = graphDateRanges.map((dateRange) =>
    d3.scaleTime().range([0, width]).domain(d3.extent(dateRange)),
  );
  const xAxes = xScales.map((xScale, i) =>
    d3.axisBottom(xScale).tickFormat((d, j) => graphDateRanges[i][j]),
  );
  xAxes.map((xAxis) => xAxis.tickFormat(formatTime));

  const yScales = maxPerGraph.map((max, i) =>
    d3.scaleLinear().rangeRound([height, 0]).domain([minPerGraph[i], max]),
  );

  const yAxes = yScales.map((yScale) => d3.axisLeft(yScale).ticks(4));

  const graphKeys = keys.map((key) => {
    return { key: key };
  });

  let layout = d3 // creating individual regions for comparison plots
    .select("#predictScreen")
    .selectAll("div")
    .data(graphKeys)
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
    .style("font-size", "20px");

  layout // add y-axis region to call yAxis func
    .append("g")
    .attr("class", "yaxis")
    .attr("id", (d) => "yaxis" + spaceRemove(d.key))
    .style("font-size", "20px");

  layout
    .append("path")
    .attr("class", "myline")
    .attr("id", (d) => "queryCurve" + spaceRemove(d.key));

  layout
    .append("path")
    .attr("class", "myline")
    .attr("id", (d) => "meanCurve" + spaceRemove(d.key));

  layout
    .append("path")
    .attr("class", "myline")
    .attr("id", (d) => "validationCurve" + spaceRemove(d.key));

  keys.map((key, i) => {
    d3.select("#xaxis" + spaceRemove(key)).call(xAxes[i]);
    d3.select("#yaxis" + spaceRemove(key)).call(yAxes[i]);

    const meanCurve = Object.entries(meanCurveData[key]).map((pairs) => {
      return { date: pairs[0], value: pairs[1] };
    });
    const queryCurve = Object.entries(queryCurveData[key]).map((pairs) => {
      return { date: pairs[0], value: pairs[1] };
    });

    const seriesCurves = Object.keys(selectedCurvesData[key]).map(
      (countries) => {
        return {
          country: countries,
          values: Object.entries(selectedCurvesData[key][countries]).map(
            (pairs) => {
              return { date: pairs[0], value: pairs[1] };
            },
          ),
        };
      },
    );
    const xScale = xScales[i];
    const yScale = yScales[i];

    d3.select("#queryCurve" + spaceRemove(key))
      .datum(queryCurve)
      .attr("fill", "none")
      .attr("stroke", queryColor)
      .attr("stroke-width", 10)
      .attr(
        "d",
        d3
          .line()
          .x((d) => xScale(parseTime(d.date)))
          .y((d) => yScale(d.value)),
      );

    if (queryValidationCurveData[key] !== "empty") {
      const validationCurve = Object.entries(queryValidationCurveData[key]).map(
        (pairs) => {
          return { date: pairs[0], value: pairs[1] };
        },
      );
      d3.select("#validationCurve" + spaceRemove(key))
        .datum(validationCurve)
        .attr("fill", "none")
        .attr("stroke", validationColor)
        .attr("stroke-width", 10)
        .attr(
          "d",
          d3
            .line()
            .x((d) => xScale(parseTime(d.date)))
            .y((d) => yScale(d.value)),
        );
    }

    d3.select("#meanCurve" + spaceRemove(key))
      .datum(meanCurve)
      .attr("fill", "none")
      .attr("stroke", meanColor)
      .attr("stroke-width", 10)
      .attr(
        "d",
        d3
          .line()
          .x((d) => xScale(parseTime(d.date)))
          .y((d) => yScale(d.value)),
      );

    layout
      .selectAll(".line")
      .data(seriesCurves)
      .enter()
      .append("path")
      .attr("class", "multiline")
      .attr("id", (d) => d.country)
      .attr("fill", "none")
      .attr("stroke", seriesColor)
      .attr("stroke-width", 5)
      .attr("stroke-opacity", 0.3)
      .attr("d", (d) =>
        d3
          .line()
          .x((d) => xScale(parseTime(d.date)))
          .y((d) => yScale(d.value))(d.values),
      );
    d3.select("#graph" + spaceRemove(key))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(key + " Prediction for " + country);
  });
}
