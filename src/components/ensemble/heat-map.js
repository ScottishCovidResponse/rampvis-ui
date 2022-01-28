import * as d3 from "d3";

export class HeatMap {
  constructor(options) {
    if (options.intersectionPoints.length == 0) {
      options.intersectionPoints = Array.from(
        { length: options.data.length },
        (x, i) => i,
      );
    }

    const margin = { top: 30, right: 30, bottom: 30, left: 30 },
      width = 800 - margin.left - margin.right,
      height = options.intersectionPoints.length * 7;

    const container = d3.select("#" + options.chartElement);

    const svg = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const columns = options.columns;
    const controller = controller;

    let values = [];

    let maxValues = [];
    let minValues = [];

    for (var j = 0; j < columns.length; j++) {
      maxValues.push(Number.MIN_VALUE);
      minValues.push(Number.MAX_VALUE);
    }

    // find minimum and maximum
    for (var i = 0; i < options.data.length; i++) {
      var row = options.data[i];

      for (var j = 0; j < columns.length; j++) {
        var column = columns[j];
        var value = row[column];
        maxValues[j] = Math.max(maxValues[j], value);
        minValues[j] = Math.min(minValues[j], value);
      }
    }

    // get list of indices and scaledValue
    const indices = [];
    for (var i = 0; i < options.intersectionPoints.length; i++) {
      var intersectionIndex = options.intersectionPoints[i];
      var row = options.data[intersectionIndex];
      var index = row["Index"];

      indices.push(index);

      for (var j = 0; j < columns.length; j++) {
        var column = columns[j];
        var value = row[column];
        var scaledValue =
          ((value - minValues[j]) / (maxValues[j] - minValues[j])) * 100;
        values.push({ index: index, group: column, value: scaledValue });
      }
    }

    const x = d3.scaleBand().range([0, width]).domain(columns).padding(0.01);

    svg
      .append("g")
      .attr("transform", `translate(0, 0)`)
      .call(d3.axisTop(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", ".8em")
      .attr("dy", "-.15em")
      .attr("transform", "rotate(30)");

    const y = d3
      .scaleBand()
      .range([0, height])
      .domain(options.intersectionPoints)
      .padding(0.01);

    svg.append("g").call(d3.axisLeft(y));

    const myColor = d3
      .scaleLinear()
      .range(["#FF66B2", "#00FF7F"])
      .domain([1, 100]);

    svg
      .selectAll()
      .data(values, function (d) {
        return d.group + ":" + d.index;
      })
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.group);
      })
      .attr("y", function (d) {
        return y(d.index);
      })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d) {
        return myColor(d.value);
      });

    this.removeContainer = async function () {
      container.selectAll("*").remove();
      return this.getController();
    };

    this.getController = function () {
      return controller;
    };
  }
}
