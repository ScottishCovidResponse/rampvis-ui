/**
 * Timeseries input data format
 *
 * interface ITimeSeriesData {
 *  date: Date;
 *  y: number;
 * }
 *
 */

import * as d3 from "d3";

const width = 800,
  height = 300,
  border = 50;

const xScFnc = (data, w = width, b = border) => {
  const xExt = d3.extent(data, (d: any) => d.date);
  console.log("data =", data, "xExt", xExt);

  const xScale = d3
    .scaleTime()
    // @ts-expect-error -- rule out [undefined, undefined] (possible runtime error)
    .domain(xExt)
    .range([b, w - b]);
  return xScale;
};

const yScFnc = (data, h = height, b = border) => {
  const yExt = d3.extent(data, (d: any) => d.y);
  console.log("data =", data, "yExt", yExt);
  const ySc = d3
    .scaleLinear()
    // @ts-expect-error -- rule out [undefined, undefined] (possible runtime error)
    .domain(yExt)
    .range([h - b, b]);
  return ySc;
};

export class TimeSeries {
  _data1;
  _data2;
  _ctx;
  _title;
  _xLabel;
  _yLabel1;
  _yLabel2;
  _color;
  _color2;
  _width;
  _height;
  _border;
  _ticks;
  _showPoints;
  _showEventLines;
  _xSc;
  _ySc1;
  _ySc2;
  _annotations;
  _annoTop;
  _animationList;
  _animationCounter;

  selector;
  line;
  isSameScale = false;

  constructor(data, selector = undefined, w = width, h = height) {
    this.selector = selector;

    this._data1 = data;
    this._data2;
    this._ctx;
    this._title = "";
    this._xLabel = "";
    this._yLabel1 = "";
    this._yLabel2 = "";
    this._color = "Black";
    this._width = w;
    this._height = h;
    this._border = border;
    this._ticks = false;
    this._showPoints = false;
    this._showEventLines = false;
    this._xSc = xScFnc(this._data1, this._width, this._border);
    this._ySc1 = yScFnc(this._data1, this._height, this._border);
    this._ySc2;
    this._annotations;
    this._annoTop;
    this._animationList;
    this._animationCounter;

    // line generator
    this.line = d3
      .line()
      .x((d: any) => this._xSc(d.date))
      .y((d: any) => this._ySc1(d.y));
  }

  static animationSVG(width, height, selector) {
    // return DOM.svg(width, height);

    // remove the svg content
    d3.select(selector).select("svg").remove();

    return d3
      .select(selector)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .node();
  }

  addExtraDatasets(dataGroup, isSameScale = true) {
    this.isSameScale = isSameScale;
    this._data2 = dataGroup;
    this._fitPairedData();
    return this;
  }

  title(title) {
    this._title = title;
    return this;
  }

  xLabel(xLabel) {
    this._xLabel = xLabel;
    return this;
  }

  yLabel(yLabel) {
    this._yLabel1 = yLabel;
    return this;
  }

  yLabel2(yLabel) {
    this._yLabel2 = yLabel;
    return this;
  }

  color2(color) {
    this._color2 = color;
    return this;
  }

  color(color) {
    this._color = color;
    return this;
  }

  ticks(ticks) {
    this._ticks = ticks;
    return this;
  }

  height(height) {
    this._height = height;

    this._ySc1 = yScFnc(this._data1, this._height, this._border);
    if (this._data2) this._fitPairedData();
    return this;
  }

  width(width) {
    this._width = width;
    const sameScale = this._ySc1 == this._ySc2;

    this._xSc = xScFnc(this._data1, this._width, this._border);
    if (this._data2) this._fitPairedData();
    return this;
  }

  border(border) {
    this._border = border;

    this._xSc = xScFnc(this._data1, this._width, this._border);
    if (this._data2) this._fitPairedData();
    return this;
  }

  showPoints() {
    this._showPoints = true;
    return this;
  }

  showEventLines() {
    this._showEventLines = true;
    return this;
  }

  getXScale() {
    return this._xSc;
  }

  getYScale() {
    return this._ySc1;
  }

  getYScale2() {
    return this._ySc2;
  }

  _fitPairedData() {
    let data2Comb = this._data2.group.reduce((comb, arr) => comb.concat(arr));
    let combData = this._data1.concat(data2Comb);

    this._xSc = xScFnc(combData, this._width, this._border);

    if (this._data2.domain) {
      data2Comb = this._data2.domain.map((v) => {
        return { y: v };
      });
      combData = this._data1.concat(data2Comb);
    }

    if (!this.isSameScale) {
      this._ySc1 = yScFnc(this._data1, this._height, this._border);
      this._ySc2 = yScFnc(data2Comb, this._height, this._border);
    } else {
      this._ySc1 = this._ySc2 = yScFnc(combData, this._height, this._border);
    }
  }

  svg(ctx) {
    console.log("TimeSeries: ctx = ", ctx);
    this._ctx = ctx;
    const bounds = ctx.getBoundingClientRect();
    this.width(bounds.width);
    this.height(bounds.height);
    return this;
  }

  renderSVG() {
    this._ctx =
      this._ctx ||
      d3
        .select(this.selector)
        .append("svg")
        .attr("width", this._width)
        .attr("height", this._height)
        .node();
    return this._ctx;
  }

  annotate(annotations) {
    if (!this._ctx)
      throw "Annotate needs to be called after timeSeries SVG is yielded! ( yield ts.renderSVG() )";

    this._annotations = annotations;
    return this;
  }

  animate(animationList, animationCounter, ctx = this._ctx) {
    this._animationList = animationList;
    this._animationCounter = animationCounter;

    this.svg(ctx);
    return this;
  }

  annoTop() {
    this._annoTop = true;
    return this;
  }

  _createPaths(points1, points2) {
    // Helper for _addPaths fnc
    // Returns array of objects representing segment path, their length and animation duration
    let subPoints, path, length, duration;
    const createPath = (animObj, i) => {
      // Slice datapoints within the start and end idx of the segment
      if (animObj.useData2) {
        subPoints = points2.slice(animObj.start, animObj.end + 1);
      } else {
        subPoints = points1.slice(animObj.start, animObj.end + 1);
      }

      // Create a d3 path with this data slice
      path = d3
        .select(this._ctx)
        .append("path")
        .attr("stroke", animObj.color || "black")
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .attr(
          "d",
          d3
            .line()
            .x((d) => this._xSc(d[0]))
            .y((d) => (animObj.useData2 ? this._ySc2(d[1]) : this._ySc1(d[1])))(
            subPoints,
          ),
        );
      length = path.node().getTotalLength();
      // Set the path to be hidden initially
      path
        .attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length);

      duration = animObj.duration || length * 4;
      // return path and length as an object
      return { path: path, length: length, duration: duration };
    };

    return this._animationList.map(createPath);
  }

  _addEventLine(container, x, y) {
    container
      .append("line")
      .attr("x1", x)
      .attr("y1", y)
      .attr("x2", x)
      .attr("y2", this._height - this._border)
      .attr("stroke-dasharray", 5)
      .style("stroke-width", 1)
      .style("stroke", "#999")
      .style("fill", "none");
  }

  _createAnnos() {
    // Helper for _addPaths fnc
    // Returns an array of objects representing annotation type and persistence
    let anno, annoObj, annoElem;
    const createAnno = (animObj, idx) => {
      // Try to get the graphAnnotation object if undefined set array elem to false
      annoObj = animObj.annotation;
      if (!animObj.annotation) return false;

      // If annotation obj defined - add to svg and set opacity to 0 (hide it)
      anno = annoObj.id(`anim-anno-${idx}`);
      anno.addTo(this._ctx);

      if (this._annoTop) {
        anno.y(this._border + anno._annoHeight / 2);
        anno.updatePos(anno._x, anno._y);
      }

      annoElem = d3.select(`#anim-anno-${idx}`).style("opacity", 0);

      if (this._showEventLines) {
        const container = d3.select(`#anim-anno-${idx}`);
        this._addEventLine(container, anno._tx, anno._ty);
      }

      // return d3 selection of anno element and boolean indication whether to persist annotation
      return {
        anno: annoElem,
        fadeout: animObj.fadeout || false,
      };
    };
    return this._animationList.map(createAnno);
  }

  _addPaths() {
    // Helper for plot fnc
    // Will create and add paths to svg based on whether the ts has been called with animate

    // Convert data to array of coordinate pairs i.e. [[x1, y1],[x2, y2]...[xn, yn]]
    const points1 = this._data1.map(Object.values);
    let points2;
    if (this._data2) {
      const colors = this._data2.colors;
      this._data2.group.forEach((data, i) => {
        points2 = data.map(Object.values);
        if (!this._animationList) {
          const path2 = d3
            .select(this._ctx)
            .append("path")
            .attr("stroke", colors ? colors[i % colors.length] : this._color)
            .attr("stroke-width", 3)
            .attr("fill", "none")
            .attr(
              "d",
              d3
                .line()
                .x((d) => this._xSc(d[0]))
                .y((d) => this._ySc2(d[1]))(points2),
            );
        }
      });
    }

    if (!this._animationList) {
      // When we dont want to animate simply add a single static path derived from the datapoints

      const path1 = d3
        .select(this._ctx)
        .append("path")
        .attr("stroke", this._color)
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .attr(
          "d",
          d3
            .line()
            .x((d) => this._xSc(d[0]))
            .y((d) => this._ySc1(d[1]))(points1),
        );
    } else {
      // We want to animate and are given a list of path segments and annotations to animate
      const pathNum = this._animationList.length; // Number of path segments

      // Create a list of d3 paths and annotations from our animation list
      const paths = this._createPaths(points1, points2);
      const annotations = this._createAnnos();

      // Use modulus to repeat animation sequence once counter > number of animation segments
      const idx = this._animationCounter % pathNum;
      const prevIdx = (this._animationCounter - 1) % pathNum;

      // Get path and annotations for current animation and previous one
      const currPath = paths[idx];
      const duration = currPath.duration || 1000;
      const currAnno = annotations[idx];
      const prevAnno = annotations[prevIdx];

      // If we have a previous annotation that needs to be faded out do so
      if (prevAnno && prevAnno.fadeout && prevIdx != pathNum - 1) {
        prevAnno.anno
          .style("opacity", 1)
          .transition()
          .duration(500)
          .style("opacity", 0);
      }

      // If we have faded out we need to delay the following animations (value is 1000 if true)
      const fadeOutDelay = (prevAnno && prevAnno.fadeout && 500) + 500;

      // Animate current path with duration given by user
      currPath.path
        .transition()
        .ease(d3.easeLinear)
        .delay(fadeOutDelay)
        .duration(duration)
        .attr("stroke-dashoffset", 0);

      // Animate the fadein of annotation after the path has fully revealed itself
      if (currAnno) {
        currAnno.anno
          .transition()
          .delay(duration + fadeOutDelay)
          .duration(500)
          .style("opacity", 1);
      }

      // Set the paths before current path to be visible (default to invisible at each step)
      paths.slice(0, idx).forEach((p) => p.path.attr("stroke-dashoffset", 0));

      // Set the persisting annotations to be visible (default to invisible at each step)
      annotations.slice(0, idx).forEach((a) => {
        if (a && !a.fadeout) {
          a.anno.style("opacity", 1);
        }
      });
    }
  }

  plot() {
    // Declare SVG
    // this._ctx = this._ctx || DOM.svg(this._width, this._height);

    this._ctx =
      this._ctx ||
      d3
        .select(this.selector)
        .append("svg")
        .attr("width", this._width)
        .attr("height", this._height)
        .node();

    // select all elements below svg with the selector "svg > *" and remove
    // otherwise it will keep drawing on top of the previous lines / scales
    d3.select(this._ctx).selectAll("svg > *").remove();

    // Create line paths
    this._addPaths();

    // Add static annotations
    if (this._annotations) {
      this._annotations.forEach((anno, idx) =>
        anno.id("anno-" + idx).addTo(this._ctx),
      );
      if (this._showEventLines) {
        const container = d3.select(this._ctx);
        this._annotations.forEach((anno) =>
          this._addEventLine(container, anno._tx, anno._ty),
        );
      }
    }

    // Create Axes and add Labels
    const axisBottom = d3.axisBottom(this._xSc);
    if (this._ticks) {
      axisBottom.ticks(this._ticks);
    }
    d3.select(this._ctx)
      .append("g")
      .attr("transform", `translate(0,${this._height - this._border})`)
      .call(axisBottom);

    d3.select(this._ctx)
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", this._width / 2)
      .attr("y", this._height - 5)
      .text(this._xLabel);

    const axisLeft = d3.axisLeft(this._ySc1);
    d3.select(this._ctx)
      .append("g")
      .attr("transform", `translate(${this._border},0)`)
      .call(axisLeft);

    d3.select(this._ctx)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -this._height / 2)
      .attr("y", 15)
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .text(this._yLabel1);

    if (this._data2 && !this.isSameScale) {
      const axisRight = d3.axisRight(this._ySc2);
      d3.select(this._ctx)
        .append("g")
        .attr("transform", `translate(${this._width - this._border},0)`)
        .call(axisRight);

      d3.select(this._ctx)
        .append("text")
        .attr("transform", "rotate(90)")
        .attr("x", this._height / 2)
        .attr("y", -this._width + 15)
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .text(this._yLabel2);
    }

    // Display Title
    d3.select(this._ctx)
      .append("text")
      .style("font-size", "px")
      .attr("x", this._width / 2)
      .attr("y", this._border / 2)
      .attr("text-anchor", "middle")
      .text(this._title)
      .attr("font-weight", "bold");

    if (this._showPoints) {
      d3.select(this._ctx)
        .append("g")
        .selectAll("circle")
        .data(this._data1.map(Object.values))
        .join("circle")
        .attr("r", 3)
        .attr("cx", (d) => this._xSc(d[0]))
        .attr("cy", (d) => this._ySc1(d[1]))
        .style("fill", this._color);
    }

    return this._ctx;
  }
}
