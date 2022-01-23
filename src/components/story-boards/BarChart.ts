import * as d3 from "d3";

const width = 800,
  height = 300,
  border = 50;

export class BarChart {
  _data;
  _ctx;
  _title;
  _xLabel;
  _yLabel;
  _width;
  _height;
  _vertBorder;
  _horiBorder;
  _barPadding;
  _isVertical;
  _categoryScale;
  _valueScale;
  _annotations;

  constructor(data, w = width, h = height) {
    this._data = data;
    this._ctx;
    this._title = "";
    this._xLabel = "";
    this._yLabel = "";
    this._width = w;
    this._height = h;
    this._vertBorder = border;
    this._horiBorder = border;
    this._barPadding = 0.1;
    this._isVertical = false;
    this._categoryScale;
    this._valueScale;
    this._annotations;
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
    this._yLabel = yLabel;
    return this;
  }

  height(height) {
    this._height = height;
    return this;
  }

  width(width) {
    this._width = width;
    return this;
  }

  vertBorder(vertBorder) {
    this._vertBorder = vertBorder;
    return this;
  }

  horiBorder(horiBorder) {
    this._horiBorder = horiBorder;
    return this;
  }

  border(border) {
    this._horiBorder = this._vertBorder = border;
    return this;
  }

  barPadding(barPadding) {
    this._barPadding = barPadding;
    return this;
  }

  orient(orient) {
    // Check if orientation is either 'v' or 'h'
    const validOrient = "vh".includes(orient.toLowerCase());

    if (!validOrient)
      throw "Please provide a valid orientation string! (either 'v' or 'h')";
    this._isVertical = validOrient && orient == "v";

    return this;
  }

  _setScales() {
    // Set range values for scales based on the orientation of the graph
    const vertRange = this._isVertical
      ? [this._height - this._vertBorder, this._vertBorder]
      : [this._vertBorder, this._height - this._vertBorder];
    const horiRange = [
      this._horiBorder,
      this._width - this._horiBorder,
    ] as const;

    // Create scales for graph based on chosen orientation
    this._categoryScale = d3
      .scaleBand()
      .range(this._isVertical ? horiRange : vertRange)
      .domain(this._data.map((d) => d.name))
      .padding(this._barPadding);

    this._valueScale = d3
      .scaleLinear()
      .domain([0, d3.extent(this._data.map((d) => d.val))[1]]) // Bar height always starts at 0 (no negative values allowed)
      .range(this._isVertical ? vertRange : horiRange);
  }

  getCategoryScale() {
    this._setScales();
    return this._categoryScale;
  }

  getValueScale() {
    this._setScales();
    return this._valueScale;
  }

  renderSVG() {
    this._ctx = this._ctx || DOM.svg(this._width, this._height);
    return this._ctx;
  }

  annotate(annotations) {
    if (!this._ctx)
      throw "Annotate needs to be called after timeSeries SVG is yielded! ( yield ts.renderSVG() )";

    this._annotations = annotations;
    return this;
  }

  plot() {
    // Declare SVG
    this._ctx = this._ctx || DOM.svg(this._width, this._height);

    this._setScales();

    // For each object in the data representing a bar create a bar and set its attributes based on obj properties and orientation
    d3.select(this._ctx)
      .selectAll("bar")
      .data(this._data)
      .join("rect")
      .attr(
        "x",
        this._isVertical
          ? (d: any) => this._categoryScale(d.name)
          : this._horiBorder,
      )
      .attr(
        "y",
        this._isVertical
          ? (d) => this._valueScale(d.val)
          : (d) => this._categoryScale(d.name),
      )
      .attr(
        "width",
        this._isVertical
          ? this._categoryScale.bandwidth()
          : (d) => this._valueScale(d.val) - this._horiBorder,
      )
      .attr(
        "height",
        this._isVertical
          ? (d) => this._height - this._vertBorder - this._valueScale(d.val)
          : this._categoryScale.bandwidth(),
      )
      // User can provide color, stroke and stroke width properties to object data to style bars individually
      .attr("fill", (d: any) => d.color)
      .attr("stroke", (d: any) => d.stroke || "none")
      .attr("stroke-width", (d: any) => d.strokeWidth || 1);

    // Create axis and labels
    const axisBottom = d3
      .select(this._ctx)
      .append("g")
      .attr("transform", `translate(0,${this._height - this._vertBorder})`)
      .call(
        this._isVertical
          ? d3.axisBottom(this._categoryScale)
          : d3.axisBottom(this._valueScale),
      );

    d3.select(this._ctx)
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", this._width / 2)
      .attr("y", this._height - 5)
      .text(this._xLabel);

    const axisLeft = d3
      .select(this._ctx)
      .append("g")
      .attr("transform", `translate(${this._horiBorder},0)`)
      .call(
        this._isVertical
          ? d3.axisLeft(this._valueScale)
          : d3.axisLeft(this._categoryScale),
      );

    d3.select(this._ctx)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .text(this._yLabel);

    // Display Title
    d3.select(this._ctx)
      .append("text")
      .style("font-size", "px")
      .attr("x", this._width / 2)
      .attr("y", this._vertBorder / 2)
      .attr("text-anchor", "middle")
      .text(this._title);

    if (this._annotations) {
      this._annotations = this._annotations.forEach((anno) =>
        anno.addTo(this._ctx),
      );
    }
    return this._ctx;
  }
}
