import * as d3 from "d3";

export class TimeLine {
  _data: any;
  _width: number;
  _height: number;
  _annotations: any;
  _svg: any;
  selector: string;

  constructor(data, width = 800, height = 100, selector = undefined) {
    this.selector = selector;

    this._data = data;
    this._width = width;
    this._height = height;
    this._annotations;
  }

  width(width) {
    this._width = width;
    return this;
  }

  height(height) {
    this._height = height;
    return this;
  }

  svg(svg) {
    this._svg = svg;
    const bounds = svg.getBoundingClientRect();
    this.width(bounds.width);
    this.height(bounds.height);
    return this;
  }

  annotations(annotations) {
    this._annotations = annotations;
    return this;
  }

  _placeCheckPoint(idx, svg, xSc) {
    return d3
      .select(svg)
      .append("circle")
      .attr("r", 10)
      .attr("cx", xSc(idx))
      .attr("cy", this._height / 2)
      .attr("fill", "#CCEAF5")
      .attr("stroke", "white")
      .attr("stroke-width", 2);
  }

  plot(animCounter = 0) {
    // this._svg = this._svg || DOM.svg(this._width, this._height);

    this._svg =
      this._svg ||
      d3
        .select(this.selector)
        .append("svg")
        .attr("width", this._width)
        .attr("height", this._height)
        .node();

    const lineStart = 50;
    const lineEnd = this._width - 50;

    const xSc = d3
      .scaleLinear()
      .domain([0, this._data.length - 1]) // unit: km
      .range([lineStart, lineEnd]);

    console.log("Timeline:plot: _annotations = ", this._annotations);

    const animStart =
      animCounter > 0 ? xSc(this._annotations[animCounter - 1].end) : lineStart;
    const animEnd = xSc(this._annotations[animCounter].end);

    const animRatio = (animEnd - animStart) / (lineEnd - lineStart);

    const timeLine = d3
      .select(this._svg)
      .append("line")
      .attr("x1", lineStart)
      .attr("x2", lineEnd)
      .attr("y1", this._height / 2)
      .attr("y2", this._height / 2)
      .attr("stroke", "#E2F0F3")
      .style("stroke-width", 8);

    // Duration of animation depends on length of segment
    const progressAnimDur = animRatio * 5000;

    const progressBar = d3
      .select(this._svg)
      .append("line")
      .attr("x1", lineStart)
      .attr("x2", animStart)
      .attr("y1", this._height / 2)
      .attr("y2", this._height / 2)
      .attr("stroke", "#A9D2DB")
      .style("stroke-width", 8)
      .transition()
      .duration(progressAnimDur)
      .ease(d3.easeLinear)
      .attr("x2", animEnd);

    console.log("Timeline:plot: this._data = ", this._data);

    const dateText = d3
      .select(this._svg)
      .append("text")
      .style("opacity", 0)
      .text(
        this._data[
          this._annotations[animCounter].end
        ].date.toLocaleDateString(),
      )
      .attr("font-size", 14)
      .attr("text-anchor", animEnd > this._width / 2 ? "end" : "start")
      .attr("transform", `translate(${animEnd},${10})`)
      .transition()
      .delay(progressAnimDur)
      .style("opacity", 1);

    const checkpoints = this._annotations.map((anno) =>
      this._placeCheckPoint(anno.end, this._svg, xSc),
    );

    checkpoints.forEach((c, i) =>
      c.attr("fill", i < animCounter ? "#CCEAF5" : "#EEF8FC"),
    );
    checkpoints[animCounter]
      .transition()
      .delay(progressAnimDur)
      .duration(0)
      .attr("fill", "#CCEAF5");
    return animCounter;
  }
}
