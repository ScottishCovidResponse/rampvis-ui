import React from "react";
import * as d3 from "d3";

class ProgressJunk extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.totalHeight = 20;
    this.totalWidth = 50;
    this.domainLength = 100.0;
    this.midPoint = this.totalWidth / 2.0;

    this.mean = props.mean;
    this.value = props.value;
    this.positive = this.value > this.mean ? this.value : 0;
    this.negative = this.value <= this.mean ? this.value : 0;

    this.progressValue = parseInt(
      (this.positive / this.domainLength) * this.midPoint,
    );
    this.negativeValue = parseInt(
      (this.negative / this.domainLength) * this.midPoint,
    );
    this.meanValue = parseInt(
      (this.mean / this.domainLength) * this.totalWidth,
    );

    this.positiveScale = d3
      .scaleLinear()
      .domain([0, this.domainLength])
      .range(["#00FF7F", "#2E8B57"]);
    this.negativeScale = d3
      .scaleLinear()
      .domain([0, this.domainLength])
      .range(["#FF66B2", "#660033"]);
  }
  componentDidMount() {
    let svg = d3
      .select(this.myRef.current)
      .append("svg")
      .attr("width", this.totalWidth)
      .attr("height", this.totalHeight);

    svg
      .append("rect")
      .attr("class", "bg-rect")
      .attr("fill", "lightgray")
      .attr("height", 15)
      .attr("width", this.totalWidth)
      .attr("x", 0);

    svg
      .append("rect")
      .attr("class", "progress-rect")
      .attr("fill", this.positiveScale(this.progressValue))
      .attr("height", 15)
      .attr("width", this.progressValue)
      .attr("x", this.midPoint);

    svg
      .append("rect")
      .attr("class", "progress-rect")
      .attr("fill", this.negativeScale(this.negativeValue))
      .attr("height", 15)
      .attr("width", this.negativeValue)
      .attr("x", this.midPoint - this.negativeValue);

    svg
      .append("line")
      .attr("x1", this.meanValue)
      .attr("y1", 0)
      .attr("x2", this.meanValue)
      .attr("y2", 15)
      .style("stroke-width", 4)
      .style("stroke", "black")
      .style("fill", "none");
  }
  render() {
    return <div ref={this.myRef}></div>;
  }
}
export default ProgressJunk;
