/* eslint-disable arrow-body-style */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable operator-assignment */
/* eslint-disable no-else-return */
/* eslint-disable radix */
/* eslint-disable no-eval */
/* eslint-disable block-scoped-var */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable spaced-comment */
/* eslint-disable one-var */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-const */
/* eslint-disable func-names */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as d3 from "d3";
import moment from "moment";
// import "./css/dashboard.css";
// import "./css/default-dashboard.css";
// import "./css/common.css";

/* 
Namespace for dashboard functions 
author: Benjamin Bach, bbach@ed.ac.uk
*/
export const dashboard = {};

var baseline_title = 20;
var baseline_label = 55;

dashboard.LINE_HIGHT = 20;
let LINE_HIGHT = 20;

dashboard.MODE_DAILY = 0;
dashboard.MODE_CURRENT = 1;
dashboard.MODE_CUMULATIVE = 2;
dashboard.MODE_WEEKLY = 3;
dashboard.MODE_PERCENT = 4;

dashboard.DETAIL_HIGH = "high";
dashboard.DETAIL_NARROW = "low";
dashboard.DETAIL_COMPACT = "medium";

dashboard.VIS_LINECHART = "linechart";
dashboard.VIS_CARTOGRAM = "cartogram";
dashboard.VIS_BARCHART = "barchart";
dashboard.VIS_PROGRESS = "progress";

var LINE_1 = 10;
var LINE_2 = 30;

// Cartogram/Tilemap
var TILE_WIDTH = 40;
var TILE_HEIGHT = 40;
var TILE_GAP = 4;

// var TILEMAP_LAYOUT_SCOTLAND = {
//   "Ayrshire and Arran": [5, 1],
//   Borders: [6, 3],
//   "Dumfries and Galloway": [6, 1],
//   Fife: [4, 2],
//   "Forth Valley": [4, 1],
//   Grampian: [3, 2],
//   "Greater Glasgow and Clyde": [5, 2],
//   Highland: [2, 1],
//   Lanarkshire: [6, 2],
//   Lothian: [5, 3],
//   Orkney: [1, 2],
//   Shetland: [0, 2],
//   Tayside: [3, 1],
//   "Western Isles": [2, 0],
// };
var TILEMAP_LAYOUT_SCOTLAND = {
  "Ayrshire and Arran": [6, 0],
  Borders: [6, 2],
  "Dumfries and Galloway": [6, 1],
  Fife: [4, 2],
  "Forth Valley": [4, 1],
  Grampian: [2, 2],
  "Greater Glasgow and Clyde": [5, 0],
  Highland: [2, 1],
  Lanarkshire: [5, 1],
  Lothian: [5, 2],
  Orkney: [0, 1],
  Shetland: [0, 2],
  Tayside: [3, 2],
  "Western Isles": [1, 0],
};

dashboard.createDashboard = function (div, config) {
  var layout = config.layout;

  // CREATE GROUP LAYOUT
  createLayoutTable(div, layout, config, addGroup);
};

var createLayoutTable = function (parentElement, layout, config, func) {
  var tr = parentElement
    .append("table")
    .attr("class", "dashboardLayout")
    .append("tr");

  var tdId;
  for (var col = 0; col < layout?.length; col++) {
    var td = tr.append("td").attr("class", "layout");
    tdId = canonizeNames(layout[col]);
    td.attr("id", tdId);

    if (typeof layout[col] == "string") {
      func(tdId, layout[col], config);
      // addGroup(tdId, layout[col], config)
    } else {
      for (var row = 0; row < layout[col].length; row++) {
        if (typeof layout[col][row] == "string") {
          func(tdId, layout[col][row], config);
          // addGroup(tdId, layout[col][row], config)
          tr.append("br");
        } else {
          createLayoutTable(td, layout[col][row], config, func);
        }
      }
    }
  }
};

var addGroup = function (parentHTMLElementId, id, config) {
  // console.log('\tAttach Group', id, '--> ', parentHTMLElementId)
  var group = config.groups.filter(function (el) {
    return el.id == id;
  })[0];

  var divId = "div_" + group?.id;
  var div = d3
    .select("#" + parentHTMLElementId)
    .append("div")
    .attr("id", divId)
    .attr("class", "dashboard");

  // show group title
  div.append("h3").attr("class", "dashboard").text(group?.title);

  var layout = group?.layout;
  createLayoutTable(div, layout, config, createWidget);
  // for(var col = 0 ; col < layout.length ; col++)
  // {
  //     if( visualizationof(layout[col]) == "string")
  //     {
  //         createPanel(divId, layout[col], config)
  //     }
  //     else
  //     {
  //         for(var row = 0 ; row < layout[col].length ; row++)
  //         {
  //             if( typeof(layout[col][row]) == "string")
  //             {
  //                 createPanel(divId, layout[col][row], config)
  //             }else
  //             {
  //                 // needs o create new table here
  //                 for(var col2 = 0 ; col2 < layout[col][row].length ; col2++){
  //                     createPanel(divId, layout[col][row][col2], config)
  //                 }
  //             }
  //             d3.select('#' + divId).append('br')
  //         }
  //     }
  // }
};

var createWidget = function (parentHtmlElementId, id, widgetConfig) {
  // console.log('\t\tAttach Panel: ', id, '-->', parentHtmlElementId)
  // get latest date:

  var widgets = widgetConfig.widgets.filter(function (el) {
    return el.id == id;
  });

  if (widgets.length == 0) {
    console.log("NO WIDGET FOUND WITH id:", id);
    return;
  }
  var widget = widgets[0];
  var data = widget.data;

  // order data by date:
  var dateVariable = widgetConfig.date;
  if (!dateVariable) dateVariable = "index";

  function byDate(a, b) {
    var ma = moment(a[dateVariable], ["YYYYMMDD", "YYYY-MM-DD"]);
    var mb = moment(b[dateVariable], ["YYYYMMDD", "YYYY-MM-DD"]);
    if (ma.isAfter(mb)) {
      return 1;
    }
    return -1;
  }
  data.sort(byDate);

  // check for conditions on data
  if (widget.conditions && widget.conditions.length > 0) {
    for (var i in widget.conditions) {
      data = executeCondition(data, widget.conditions[i]);
    }
  }

  if (data.length == 0) {
    console.log("data.length == 0");
    return;
  }

  var title = widget.title;
  if (data[data.length - 1][dateVariable]) {
    var lastDate;
    lastDate = moment(data[data.length - 1][dateVariable], [
      "YYYYMMDD",
      "YYYY-MM-DD",
    ]);
  }

  var normalized = false || (widget && widget.normalized);

  if (widget.visualization == dashboard.VIS_CARTOGRAM) {
    dashboard.visulizeScotlandNHSBoardCartogram(
      parentHtmlElementId,
      title,
      widget.color,
      data,
      widget.normalized ? widget.normalized : false,
      widget.unit,
      widget.detail,
      lastDate,
    );
  } else if (widget.visualization == dashboard.VIS_LINECHART) {
    dashboard.visualizeLinechart(
      parentHtmlElementId,
      title,
      widget.dataField,
      widget.color,
      data,
      widget.mode,
      normalized,
      widget.link ? widget.link : null,
      widget.unit,
      widget.detail,
      lastDate,
      widget.abbreviate,
    );
  } else if (widget.visualization == dashboard.VIS_BARCHART) {
    dashboard.visualizeBarChart(
      parentHtmlElementId,
      title,
      widget.dataField,
      widget.color,
      data,
      widget.mode,
      normalized,
      widget.link ? widget.link : null,
      widget.unit,
      widget.detail,
      lastDate,
      widget.bars,
      widget.abbreviate,
    );
  } else if (widget.visualization == dashboard.VIS_PROGRESS) {
    dashboard.visualizeProgress(
      parentHtmlElementId,
      title,
      widget.dataField,
      widget.color,
      data,
      widget.mode,
      normalized,
      widget.link ? widget.link : null,
      widget.unit,
      widget.detail,
      lastDate,
      widget.bars,
      widget.abbreviate,
    );
  } else {
    console.error(
      'Chart type "' +
        widget.visualization +
        '" not defined. Please check https://github.com/rampvis/rampvis.github.io/wiki/widgets.',
    );
  }
};

var executeCondition = function (data, c) {
  c = "d." + c;
  var size = data.length;
  return data.filter(function (d) {
    return eval(c);
  });
};

var canonizeNames = function (s) {
  return String(s)
    .toLowerCase()
    .replaceAll(",", "-")
    .replaceAll("[", "-")
    .replaceAll("]", "-");
};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
/// TYPE STATS
/////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

dashboard.visualizeLinechart = function (
  id,
  title,
  field,
  color,
  dataStream,
  mode,
  normalized,
  link,
  unit,
  detail,
  lastDate,
  abbreviate,
) {
  // console.log('\t\t\tVisualizeDataStream', title, '-->', id)
  if (!detail) detail = dashboard.DETAIL_HIGH;
  if (!unit) unit = "";
  if (!abbreviate) abbreviate = false;

  var svg = d3.select("#" + id).append("svg");

  setVisTitle(svg, title, link, detail, lastDate);
  if (detail == dashboard.DETAIL_HIGH) {
    svg.attr("width", 400).attr("height", 110);

    visualizeNumber(
      svg,
      dataStream,
      0,
      baseline_title + 25,
      field,
      color,
      mode,
      normalized,
      unit,
      abbreviate,
    );
    visualizeTrendArrow(
      svg,
      dataStream,
      150,
      baseline_title + 25,
      field,
      color,
      mode,
      unit,
    );
    visualizeMiniChart(
      svg,
      dataStream,
      300,
      baseline_title + 25,
      35,
      100,
      field,
      color,
      mode,
    );
  } else if (detail == dashboard.DETAIL_NARROW) {
    svg.attr("width", 180).attr("height", 70);

    visualizeNumberSmall(
      svg,
      dataStream,
      0,
      baseline_title + 25,
      field,
      color,
      mode,
      normalized,
      unit,
    );
    visualizeMiniChart(
      svg,
      dataStream,
      100,
      baseline_title + 25,
      18,
      70,
      field,
      color,
      mode,
      true,
    );
  } else if (detail == dashboard.DETAIL_COMPACT) {
    var w = 100,
      h = 100;
    svg.attr("width", w).attr("height", h);

    visualizeNumberSmall(
      svg,
      dataStream,
      0,
      baseline_title + 25,
      field,
      color,
      mode,
      normalized,
      unit,
    );
    visualizeMiniChart(
      svg,
      dataStream,
      0,
      baseline_title + 55,
      18,
      w,
      field,
      color,
      mode,
      true,
    );
  }
};

/////////////////////////////
/// VISULIZATION FUNCTION ///
/////////////////////////////

var visualizeNumber = function (
  svg,
  data,
  x,
  y,
  field,
  color,
  mode,
  normalized,
  unit,
  abbreviate,
) {
  var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

  if (mode == dashboard.MODE_DAILY) {
    setVisLabel(g, "Today", 0, baseline_label);
  } else if (mode == dashboard.MODE_CURRENT) {
    setVisLabel(g, "Current", 0, baseline_label);
  } else if (mode == dashboard.MODE_WEEKLY) {
    setVisLabel(g, "This week", 0, baseline_label);
  } else {
    setVisLabel(g, "Total", 0, baseline_label);
  }

  var val = data[data.length - 1][field];

  // abbreviate if required
  if (val > 1000000 && abbreviate) {
    val = val / 1000000;
    unit = "M " + unit;
  } else if (val > 1000 && abbreviate) {
    val = val / 1000;
    unit = "k " + unit;
  }

  val = Math.round(val * 10) / 10;
  val = val.toLocaleString(undefined);

  if (mode == dashboard.MODE_PERCENT) {
    val += "%";
  } else if (unit) {
    val += "" + unit;
  }

  var bigNumber = {};

  var t = g
    .append("text")
    .text(val)
    .attr("y", 33)
    .attr("class", "bigNumber")
    .style("fill", color)
    .each(function () {
      bigNumber.width = this.getBBox().width;
    });

  if (normalized) {
    g.append("text")
      .text("per")
      .attr("x", bigNumber.width + 10)
      .attr("y", y + LINE_1)
      .attr("class", "thin");
    g.append("text")
      .text("100,000")
      .attr("x", bigNumber.width + 10)
      .attr("y", y + LINE_2)
      .attr("class", "thin");
  }
};

var visualizeNumberSmall = function (
  svg,
  data,
  x,
  y,
  field,
  color,
  mode,
  normalized,
  unit,
) {
  // var g = svg.append("g")
  //     .attr("transform", "translate(" + xOffset + ",0)")

  // if (mode == dashboard.MODE_DAILY) {
  //     setVisLabel(g, 'Today')
  // } else if (mode == dashboard.MODE_CURRENT) {
  //     setVisLabel(g, 'Current')
  // } else if (mode == dashboard.MODE_WEEKLY) {
  //     setVisLabel(g, 'This week')
  // } else {
  //     setVisLabel(g, 'Total')
  // }

  var val = Math.round(data[data.length - 1][field] * 10) / 10;
  val = val.toLocaleString(undefined);

  if (mode == dashboard.MODE_PERCENT) {
    val += "%";
  } else if (unit) {
    val += "" + unit;
  }

  var bigNumber = {};
  svg
    .append("text")
    .text(val)
    .attr("y", y + 18)
    .attr("x", x)
    .attr("class", "smallNumber")
    .style("fill", color);

  // if (normalized) {
  //     g.append('text')
  //         .text('per')
  //         .attr('x', bigNumber.width + 10)
  //         .attr('y', top_content + LINE_1)
  //         .attr('class', 'thin')
  //     g.append('text')
  //         .text('100,000')
  //         .attr('x', bigNumber.width + 10)
  //         .attr('y', top_content + LINE_2)
  //         .attr('class', 'thin')
  // }
};

var visualizeTrendArrow = function (svg, data, x, y, field, color, mode, unit) {
  var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

  if (mode == dashboard.MODE_WEEKLY)
    setVisLabel(g, "From last week", 0, baseline_label);
  else setVisLabel(g, "From yesterday", 0, baseline_label);

  var secondLast = parseInt(data[data.length - 2][field]);
  var last = parseInt(data[data.length - 1][field]);
  let v = last - secondLast;
  let r = 0;
  if (v < 0) r = 45;
  if (v > 0) r = -45;

  g.append("text")
    .text(function () {
      if (v > 0) {
        return "up by";
      } else if (v < 0) {
        return "down by";
      } else {
        return "no ";
      }
    })
    .attr("x", 45)
    .attr("y", LINE_1)
    .attr("class", "thin");

  if (v == 0) {
    g.append("text")
      .text("change")
      .attr("x", 45)
      .attr("y", LINE_2)
      .attr("class", "thin");
  } else {
    g.append("text")
      .text(function () {
        v = Math.abs(v);
        if (mode == dashboard.MODE_PERCENT) {
          v += "% pts.";
        }
        return v;
      })
      .attr("x", 45)
      .attr("y", LINE_2)
      .style("fill", color);
  }

  var g2 = g.append("g").attr("transform", function () {
    return "translate(17," + 20 + "),rotate(" + r + ")";
  });

  g2.append("line")
    .attr("x1", -15)
    .attr("x2", 15)
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("class", "arrow")
    .attr("stroke", color);
  g2.append("line")
    .attr("x1", 15)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", -15)
    .attr("class", "arrow")
    .attr("stroke", color);
  g2.append("line")
    .attr("x1", 15)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", 15)
    .attr("class", "arrow")
    .attr("stroke", color);
};

var visualizeMiniChart = function (
  svg,
  data,
  x,
  y,
  chartHeight,
  chartWidth,
  field,
  color,
  mode,
  noTitle,
) {
  var trendWindow = 14; // days
  if (mode == dashboard.MODE_WEEKLY) trendWindow = 8;

  var barWidth = (chartWidth - 10) / trendWindow;

  var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

  if (mode == dashboard.MODE_WEEKLY && !noTitle) {
    setVisLabel(g, "Last " + trendWindow + " Weeks", 0, baseline_label);
  } else if (!noTitle) {
    setVisLabel(g, "Last " + trendWindow + " Days", 0, baseline_label);
  }

  var x = d3
    .scaleLinear()
    .domain([0, trendWindow - 1])
    .range([0, chartWidth - barWidth]);

  // get N last entries
  data = data.slice(data.length - trendWindow);

  var max = d3.max(data, function (d) {
    return parseInt(d[field]);
  });
  if (mode == dashboard.MODE_PERCENT) {
    max = 100;
  }
  var y = d3.scaleLinear().domain([0, max]).range([chartHeight, 0]);

  // if perentage, show 100% line
  if (mode == dashboard.MODE_PERCENT) {
    g.append("line")
      .attr("y1", y(max))
      .attr("y2", y(max))
      .attr("x1", x(0))
      .attr("x2", x(data.length - 1))
      .attr("class", "chartTopLine");
    g.append("rect")
      .attr("x", x(0))
      .attr("y", y(max))
      .attr("height", Math.abs(y(max) - y(0)))
      .attr("width", x(data.length - 1) - x(0))
      .attr("class", "chartTopRect");
  }

  if (
    mode == dashboard.MODE_CUMULATIVE ||
    mode == dashboard.MODE_CURRENT ||
    mode == dashboard.MODE_PERCENT
  ) {
    g.append("path")
      .datum(data)
      .attr("fill", color)
      .style("opacity", 0.4)
      .attr(
        "d",
        d3
          .area()
          .x(function (d, i) {
            return x(i);
          })
          .y0(y(0))
          .y1(function (d) {
            return y(d[field]);
          }),
      );

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .x(function (d, i) {
            return x(i);
          })
          .y(function (d) {
            return y(d[field]);
          }),
      );

    g.append("circle")
      .attr("fill", color)
      .attr("r", 3)
      .attr("cx", x(data.length - 1))
      .attr("cy", y(data[data.length - 1][field]));
  } else {
    g.selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", function (d, i) {
        var c = color;
        if (i == 13) c = d3.rgb(c).darker(1);
        return c;
      })
      .attr("x", function (d, i) {
        return x(i);
      })
      .attr("width", barWidth)
      .attr("y", function (d) {
        return y(d[field]);
      })
      .attr("height", function (d) {
        return chartHeight - y(d[field]);
      });
  }

  if (
    mode == dashboard.MODE_DAILY ||
    mode == dashboard.MODE_CUMULATIVE ||
    mode == dashboard.MODE_CURRENT
  ) {
    g.append("line")
      .attr("x1", x(6.9))
      .attr("x2", x(7.1))
      .attr("y1", 37)
      .attr("y2", 37)
      .attr("class", "weekBar");
  }
};

var setVisTitle = function (g, text, link, detail, lastDate) {
  g.append("line")
    .attr("x1", 0)
    .attr("x2", 10000)
    .attr("y1", baseline_title + 5)
    .attr("y2", baseline_title + 5)
    .attr("class", "separator");

  if (link) {
    text = text + " [details available]";
  }

  var text = g
    .append("text")
    .text(text)
    .attr("class", "datastream-title")
    .attr("y", baseline_title);

  if (detail == dashboard.DETAIL_NARROW || dashboard.DETAIL_COMPACT) {
    text.style("font-size", "9pt");
  }

  if (lastDate) {
    g.append("text")
      .text(lastDate.format("MMM DD, YYYY"))
      .attr("class", "datastream-date")
      .attr("y", baseline_title + 15);
  }

  if (link) {
    text.classed("hasLink", true);
    text.on("click", function () {
      window.open(link);
    });
    text.on("mouseover", function () {
      d3.select(this).classed("hover", true);
    });
    text.on("mouseout", function () {
      d3.select(this).classed("hover", false);
    });
  }
};

var setVisLabel = function (g, text, x, y) {
  g.append("text").text(text).attr("class", "label").attr("x", x).attr("y", y);
};

var setVisLabelRow2 = function (g, text, x, y) {
  g.append("text")
    .text(text)
    .attr("class", "label")
    .attr("x", x)
    .attr("y", y + 15);
};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
/// TYPE CARTOGRAM
/////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

dashboard.visulizeScotlandNHSBoardCartogram = function (
  id,
  title,
  color,
  data,
  normalized,
  detail,
  lastDate,
) {
  // data comes in JSON
  var svg = d3
    .select("#" + id)
    .append("svg")
    .attr("width", TILE_WIDTH * 4)
    .attr("height", 100 + TILE_HEIGHT * 7);

  setVisTitle(svg, title, null, detail, lastDate);

  svg
    .append("text")
    .attr("x", 0)
    .attr("y", baseline_title + 30)
    .attr("class", "thin")
    .text("per NHS Board");

  if (normalized) {
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", baseline_title + 30 + LINE_HIGHT)
      .attr("class", "thin")
      .text("per 1000 people");
  }

  var current = data[data.length - 1];
  var array = [];
  var max = 0;
  var min = 10000000;

  for (let r in current) {
    if (!(r == "week commencing" || r == "date" || r == "index")) {
      array.push({ name: r, value: current[r] });
      max = Math.max(max, current[r]);
      min = Math.min(min, current[r]);
    }
  }
  // console.log(array);

  var valueScale = d3.scaleLinear().domain([0, max]).range([0, 1]);

  svg
    .selectAll("rect")
    .data(array)
    .enter()
    .append("rect")
    .style("stroke", "#ccc")
    .style("fill", "#fff")
    .attr("x", function (d) {
      return TILEMAP_LAYOUT_SCOTLAND[d.name][1] * TILE_WIDTH;
    })
    .attr("y", function (d) {
      return 100 + TILEMAP_LAYOUT_SCOTLAND[d.name][0] * TILE_HEIGHT;
    })
    .attr("width", TILE_WIDTH - TILE_GAP)
    .attr("height", TILE_HEIGHT - TILE_GAP)
    .on("mouseclick", function (d) {
      window.open(PATH_NHSBOARD + d.name + ".html");
    });

  svg
    .selectAll(".rect")
    .data(array)
    .enter()
    .append("rect")
    .style("opacity", function (d) {
      return valueScale(d.value);
    })
    .style("fill", color)
    .attr("x", function (d) {
      return TILEMAP_LAYOUT_SCOTLAND[d.name][1] * TILE_WIDTH;
    })
    .attr("y", function (d) {
      return 100 + TILEMAP_LAYOUT_SCOTLAND[d.name][0] * TILE_HEIGHT;
    })
    .attr("width", TILE_WIDTH - TILE_GAP)
    .attr("height", TILE_HEIGHT - TILE_GAP);
  svg.selectAll("rect");

  svg
    .selectAll(".cartogramLabel")
    .data(array)
    .enter()
    .append("text")
    // .filter(function (d) {
    //     return d.value == max
    //         || d.value == min;
    // })
    .attr("class", "cartogramLabel")
    .style("fill", function (d) {
      return valueScale(d.value) >= 0.6 ? "#fff" : "#000";
    })
    .attr("x", function (d) {
      return (
        TILEMAP_LAYOUT_SCOTLAND[d.name][1] * TILE_WIDTH + TILE_HEIGHT * 0.05
      );
    })
    .attr("y", function (d) {
      return (
        100 +
        TILEMAP_LAYOUT_SCOTLAND[d.name][0] * TILE_HEIGHT +
        TILE_HEIGHT * 0.8
      );
    })
    .text(function (d) {
      if (d.value < 9) {
        return Math.round(d.value * 10) / 10;
      } else if (d.value < 999) {
        return Math.round(d.value);
      } else {
        return Math.round(Math.round(d.value) / 1000) + "k";
      }
    })
    .filter(function (d) {
      return !(d.value == max || d.value == min);
    })
    .attr("class", "cartogramLabel-nonextremes");
};

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//  TYPE GROUPS
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
dashboard.visualizeBarChart = function (
  id,
  title,
  dataField,
  color,
  dataStream,
  mode,
  normalized,
  link,
  unit,
  detail,
  lastDate,
  barField,
  abbreviate,
) {
  var svg = d3
    .select("#" + id)
    .append("svg")
    .attr("height", 40)
    .style("margin-bottom", 0);

  setVisTitle(svg, title, link, detail, lastDate);

  // display only last data
  lastDate = dataStream[dataStream.length - 1].index;
  dataStream = dataStream.filter((e) => {
    return e.index == lastDate;
  });

  if (!detail) detail = dashboard.DETAIL_HIGH;

  // dashboard.DETAILED
  let width = 150;
  let barWidth = 20;
  if (detail == dashboard.DETAIL_NARROW) {
    width = 70;
    barWidth = 10;
  } else if (detail == dashboard.DETAIL_COMPACT) {
    width = 100;
    barWidth = 15;
  }
  svg.attr("width", width);
  console.log("data", dataStream);
  var vegaBarchart = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: {
      values: dataStream,
    },
    width: width,
    height: { step: barWidth },
    mark: "bar",
    encoding: {
      y: {
        field: barField,
        type: "nominal",
        title: "",
      },
      x: {
        field: dataField,
        type: "quantitative",
        title: "",
      },
      color: { value: color },
    },
  };
  var random = Math.floor(Math.random() * 1000);
  d3.select("#" + id)
    .append("div")
    .attr("id", "vegadiv-" + id + random);

  vegaEmbed("#vegadiv-" + id + random, vegaBarchart, { actions: false });
};

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//  PROGRESS BARS
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
dashboard.visualizeProgress = function (
  id,
  title,
  dataField,
  color,
  dataStream,
  mode,
  normalized,
  link,
  unit,
  detail,
  lastDate,
  barField,
  abbreviate,
) {
  // TIAN
};
