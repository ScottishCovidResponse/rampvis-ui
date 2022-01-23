import * as d3 from "d3";

export class TimelineAnnotation {
  _timelineDepth;
  _id;
  _wrap;
  _align;
  _x;
  _y;
  _tx;
  _ty;
  _showConnector;
  _color;
  _connectorColor;
  _title;
  _label;
  _connector;
  _textNode;
  node: any;
  _annoWidth: any;
  private _annoHeight: any;

  constructor(timelineDepth = 0, id = "") {
    this._timelineDepth = timelineDepth;
    this._id = id;
    this._wrap = 150;
    this._align = "middle";
    this._x;
    this._y;
    this._tx = 0;
    this._ty = 0;
    this._showConnector = false;
    this._color = "black";
    this._connectorColor;
    // this._title = svg`<text font-weight="bold"></text>`;
    this._title = this._title = d3
      .create("svg")
      .append("text")
      .attr("font-weight", "bold")
      .node();
    // this._label = svg`<text></text>`;
    this._label = d3.create("svg").append("text").node();
    // this._connector = svg`<line class="graph-annotation-connector" stroke=${this._color}></line>`;
    this._connector = d3
      .create("svg")
      .append("line")
      .attr("class", "graph-annotation-connector")
      .attr("stroke", this._color)
      .node();
    // this._textNode = svg`<g class="graph-annotation-text" style="fill: ${this.color}">${this._title}
    //   ${this._label}</g>`;
    this._textNode = d3
      .create("svg")
      .append("g")
      .attr("class", "graph-annotation-text")
      .attr("fill", this._color)
      .node();
    this._textNode.append(this._title);
    this._textNode.append(this._label);

    //   this.node = svg`<g display="none" ${
    //     id ? 'id="' + id + '"' : ""
    //   } class="graph-annotation" font-size="12px">
    //     ${this._connector}
    //     ${this._textNode}
    // </g>`;

    this.node = d3
      .create("svg")
      .append("g")
      .attr("display", "none")
      .attr("id", id)
      .attr("class", "graph-annotation")
      .attr("font-size", "12px")
      .node();

    this.node.appendChild(this._connector);
    this.node.appendChild(this._textNode);
  }

  timelineDepth(timelineDepth) {
    this._timelineDepth = timelineDepth;
    return this;
  }

  id(id) {
    this._id = id;
    this.node.setAttribute("id", id);
    return this;
  }

  title(title) {
    this._title.textContent = title;
    return this;
  }

  label(label) {
    this._label.textContent = label;
    return this;
  }

  wrap(wrap) {
    this._wrap = wrap;
    return this;
  }

  x(x) {
    this._x = x;
    return this;
  }

  y(y) {
    this._y = y;
    return this;
  }

  target(tx, ty) {
    this._tx = tx;
    this._ty = ty;
    this._showConnector = true;
    return this;
  }

  fontSize(fontSize) {
    this.node.setAttribute("font-size", fontSize);
    return this;
  }

  align(align) {
    this._align = align;
    this.node.setAttribute("text-anchor", align);
    return this;
  }

  color(color) {
    this._color = color;
    this._textNode.style.fill = this._color;
    return this;
  }

  connectorColor(connectorColor) {
    this._connectorColor = connectorColor;
    return this;
  }

  _alignToX() {
    // Uses the width and alignment of text to calculate correct x values of tspan elements
    return (
      (this._annoWidth / 2) *
      ((this._align.toLowerCase() == "middle") * 1 ||
        (this._align.toLowerCase() == "end") * 2)
    );
  }

  _correctTextAlignment(textElem) {
    // Aligns tspan elements based on chosen alignment
    Array.from(textElem.children).forEach((tspan) =>
      tspan.setAttribute("x", this._alignToX()),
    );
  }

  _wrapText(textElem) {
    // SVG text is all in a single line - to wrap text we split rows into
    // individual <tspan> elements
    const text = textElem.textContent;
    let words = text.split(" ");

    // We need the height of a character/row for separating title and label
    const { height: rowHeight } = textElem.getBoundingClientRect();

    // Draw each word onto svg and save its width before removing
    let wordElem;
    words = words.map((word) => {
      // wordElem = textElem.appendChild(svg`<tspan>${word}</tspan>`);
      wordElem = d3.create("svg").append("tspan").text(word).node();
      let { width: wordWidth } = wordElem.getBoundingClientRect();
      // textElem.removeChild(wordElem); TODO
      return { word: word, width: wordWidth };
    });

    textElem.textContent = "";

    // Keep adding words to row until width exceeds span then create new row
    let currentWidth = 0;
    let rowString = [];
    let isLastWord, forceNewLine;

    words.forEach((word, i) => {
      // A newline can be forced by including ' \n ' with spaces around it
      forceNewLine = word.word == "\n";
      if (forceNewLine) {
        // Multiple consecutive ' \n ' require the tspan to have text to function
        // We fill the tspan with arbitrary text and then hide it
        let multiLineBreak = rowString.length == 0;
        let content = multiLineBreak ? "linebreak" : rowString.join(" ");
        let visStr = multiLineBreak ? 'visibility="hidden"' : "";

        textElem.appendChild(
          svg`<tspan x=0 dy="1.1em" ${visStr}>${content}</tspan>`,
        );

        currentWidth = 0;
        rowString = [];
        return;
      }

      // Don't factor in the width taken up by spaces atm
      if (currentWidth + word.width < this._wrap) {
        currentWidth += word.width;
        rowString.push(word.word);
      } else {
        textElem.appendChild(
          // svg`<tspan x=0 dy="1.1em">${rowString.join(" ")}</tspan>`,
          d3
            .create("svg")
            .append("tspan")
            .attr("x", 0)
            .attr("dy", "1.1em")
            .text(rowString.join(" "))
            .node(),
        );
        currentWidth = word.width;
        rowString = [word.word];
      }

      isLastWord = i == words.length - 1;
      if (isLastWord) {
        textElem.appendChild(
          // svg`<tspan x=0 dy="1.1em">${rowString.join(" ")}</tspan>`,
          d3
            .create("svg")
            .append("tspan")
            .attr("x", 0)
            .attr("dy", "1.1em")
            .text(rowString.join(" "))
            .node(),
        );
      }
    });

    return rowHeight;
  }

  _formatText() {
    const rowHeight = this._wrapText(this._title);
    this._wrapText(this._label);

    // Calculate spacing between title and label
    const { height: titleHeight } = this._title.getBoundingClientRect();
    const titleSpacing = titleHeight + rowHeight * 0.2;
    this._label.setAttribute("y", titleSpacing);
  }

  _repositionAnnotation() {
    const { width: annoWidth, height: annoHeight } =
      this._textNode.getBoundingClientRect();

    // prettier-ignore
    console.log("_repositionAnnotation: width =", annoWidth, "height = ", annoHeight, "_x = ", this._x, "_y", this._y);

    this._annoWidth = annoWidth;
    this._annoHeight = annoHeight;

    // Translate x,y position to center of anno (rather than top left)
    this._textNode.setAttribute(
      "transform",
      `translate(${this._x - annoWidth / 2},${this._y})`,
    );

    // Align text correctly
    this._correctTextAlignment(this._title);
    this._correctTextAlignment(this._label);
  }

  _addConnector() {
    this._connector.setAttribute("x1", this._x);
    this._connector.setAttribute("x2", this._tx);
    this._connector.setAttribute("y1", this._y);
    this._connector.setAttribute("y2", this._timelineDepth);

    this._connector.setAttribute("stroke", this._connectorColor || this._color);
  }

  addTo(ctx) {
    d3.select(ctx).append(() => this.node);
    this._formatText();
    this._repositionAnnotation();

    if (this._showConnector) {
      this._addConnector();
    }

    // Reveal annotation
    this.node.removeAttribute("display");
  }

  updatePos(x, y) {
    this._x = x;
    this._y = y;

    this._repositionAnnotation();
    if (this._showConnector) {
      this._addConnector();
    }
  }

  static arrangeAnnotations(annotationArr) {
    const annos = [];
    annotationArr.forEach((anno) => {
      annos.push({
        anno: anno,
        width: anno._annoWidth,
        height: anno._annoHeight,
        x: anno._x,
        y: anno._y,
        children: [],
      });
    });

    // For each annotation find the annotations that are colliding with it to its right
    // call these children.
    annos.forEach((anno) => {
      let rightCollision = (a, b) => b.x - a.x < a.width && a.x < b.x;
      let colliding = annos.filter((a) => rightCollision(anno, a));
      anno.children = colliding;
    });

    // An annotation's children may also have children so we find all nested children.
    const findNestedChildren = (anno) => {
      // Recursive function for finding all nested children
      let children = anno.children;

      // Base case no children -> return empty array
      if (children.length == 0) return [];

      // If we have children then find their children
      let nestedChildren = children
        .map(findNestedChildren)
        .reduce((flat, arr) => flat.concat(arr));

      // Combine children and nested children and return unique array
      let allChildren = children.concat(nestedChildren);
      return [...new Set(allChildren)];
    };

    let maxHeight = 0;
    // We increase the height of the annotation based on the height of its nested children
    annos.forEach((anno) => {
      let childrenHeight = findNestedChildren(anno).reduce(
        (sum, child) => sum + child.height + 5,
        0,
      );
      console.log(childrenHeight);
      maxHeight = Math.max(maxHeight, childrenHeight + anno.height);
      anno.anno.updatePos(anno.x, anno.y + childrenHeight);
    });
    // return max height to figure out svg resizing
    return maxHeight;
  }

  static resizeSvg(ctx, width, timelineDepth, maxHeight) {
    d3.select(ctx)
      .attr("viewBox", `0,0,${width},${timelineDepth + maxHeight}`)
      .attr("height", timelineDepth + maxHeight);
  }
}
