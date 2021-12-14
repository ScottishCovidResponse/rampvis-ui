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
export const dashboardComponents = {}

var baseline_title = 20;
var baseline_label = 55;

dashboard.LINE_HIGHT = 20;
let LINE_HIGHT = 20;

// dashboard.MODE_DAILY = 0;
// dashboard.MODE_CURRENT = 1;
// dashboard.MODE_CUMULATIVE = 2;
// dashboard.MODE_WEEKLY = 3;
// dashboard.MODE_PERCENT = 4;

dashboard.DETAIL_HIGH = "high";
dashboard.DETAIL_LOW = "low";
dashboard.DETAIL_MEDIUM = "medium";

dashboard.VIS_LINECHART = "linechart";
dashboard.VIS_CARTOGRAM = "cartogram";
dashboard.VIS_BARCHART = "barchart";
dashboard.VIS_PROGRESS = "progress";

dashboard.TIMEUNIT_SECOND = 'second';
dashboard.TIMEUNIT_MINUTE = 'minute';
dashboard.TIMEUNIT_HOUR = 'hour';
dashboard.TIMEUNIT_DAY = 'day';
dashboard.TIMEUNIT_WEEK = 'week';
dashboard.TIMEUNIT_MONTH = 'month';
dashboard.TIMEUNIT_YEAR = 'year';


var LINE_1 = 10;
var LINE_2 = 34;

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

//////////////////////////////////////
var createWidget = function (parentHtmlElementId, id, config) {

  var widgets = config.widgets.filter(function (el) {
    return el.id == id;
  });

  if (widgets.length == 0) {
    console.log("NO WIDGET FOUND WITH id:", id);
    return;
  }

  var widgetConfig = widgets[0];

  // create convenience variable for 'data' that will be linked back
  // to thw widgetConf before visualizing.
  var data = widgetConfig.data;
  // check if data is not empty
  if (data.length == 0) {
    console.log("NO DATA FOUND / DATA ARRAY IS EMPTY", id);
    return;
  }

  // SET WIDGET DEFAULT VALUES
  if (!widgetConfig.dateField) 
    widgetConfig.dateField = "index";

  if(!widgetConfig.detail)
    widgetConfig.detail = dashboard.DETAIL_HIGH;

  if (!widgetConfig.unit) 
    widgetConfig.unit = "";
  
  if (!widgetConfig.abbreviate) 
    widgetConfig.abbreviate = false;

  // deprecated. remove when not used anymore
  if(!widgetConfig.normalized)
    widgetConfig.normalized = false;
  
  if(!widgetConfig.trend)
    widgetConfig.trend = false;

  if(!widgetConfig.cumulative)
    widgetConfig.cumulative = false;

  if(!widgetConfig.timeUnit)
    widgetConfig.timeUnit = dashboard.TIMEUNIT_DAY;
  

  // include, once LAYOUT has been implemented as a variable
  // if(!widgetConfig.layout)
  //   widgetConfig.layout = dashboard.LAYOUT_COMPACT;


  // order data by date:
  function byDate(a, b) {
    var ma = moment(a[widgetConfig.dateField], ["YYYYMMDD", "YYYY-MM-DD"]);
    var mb = moment(b[widgetConfig.dateField], ["YYYYMMDD", "YYYY-MM-DD"]);
    if (ma.isAfter(mb)) {
      return 1;
    }
    return -1;
  }

  // convert all dates in to YYYY-MM-DD
  for (var i in data) {
    data[i][widgetConfig.dateField] = moment(data[i][widgetConfig.dateField], [
      "YYYYMMDD",
      "YYYY-MM-DD",
    ]).format("YYYY-MM-DD");
  }
  // sort array by date, first/earliest to last/most recent
  data.sort(byDate);
  
  // find last date in data set, i.e., when data has been updated last.
  var lastDateUpdated = moment(data[data.length - 1][widgetConfig.dateField], ["YYYY-MM-DD"]);
  
  // check for filter conditions on data
  if (widgetConfig.conditions && widgetConfig.conditions.length > 0) {
    for (var i in widgetConfig.conditions) {
      data = executeCondition(data, widgetConfig.conditions[i]);
    }
  }
  
  var title = widgetConfig.title;
  
  // link data var back to widget
  widgetConfig.data = data;

  if (widgetConfig.visualization == dashboard.VIS_CARTOGRAM) {
    dashboard.visulizeScotlandNHSBoardCartogram(
      parentHtmlElementId, 
      widgetConfig,
      lastDateUpdated
    );
  } 
  else if (widgetConfig.visualization == dashboard.VIS_LINECHART) {
    dashboard.visualizeTimeSeries(
      parentHtmlElementId, 
      widgetConfig,
      lastDateUpdated
      );
  } 
  else if (widgetConfig.visualization == dashboard.VIS_BARCHART) {
    dashboard.visualizeBarChart(
      parentHtmlElementId, 
      widgetConfig,
      lastDateUpdated
    );
  } 
  else if (widgetConfig.visualization == dashboard.VIS_PROGRESS) {
    dashboard.visualizeProgress(
      parentHtmlElementId,
      title,
      widgetConfig.dataField,
      widgetConfig.color,
      data,
      widgetConfig.mode,
      widgetConfig.normalized,
      widgetConfig.link ? widgetConfig.link : null,
      widgetConfig.unit,
      widgetConfig.detail,
      lastDateUpdated,
      widgetConfig.bars,
      widgetConfig.abbreviate,
    );
  } else {
    console.error(
      'Chart type "' +
        widgetConfig.visualization +
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

dashboard.visualizeTimeSeries = function (
  parentHtmlId,
  config,
  lastDate
  ) 
  {

  var min = 999999999
  var max = -999999999
  var minDate = ''
  var maxDate = ''
  for(var i in config.data)
  {    
    if(parseFloat(config.data[i][config.dataField]) > max){
      max = parseFloat(config.data[i][config.dataField]);
      maxDate = config.data[i][config.dateField]
    }
  }
  for(var i in config.data)
  {
    if(parseFloat(config.data[i][config.dataField]) <= min){
      min = parseFloat(config.data[i][config.dataField]);
      minDate = config.data[i][config.dateField]
    }
  }

  // default for all
  var domain = [min,max]
  
  // manually override defaults
  if (config.min){
    domain[0] = config.min;
  }
  if (config.max){
    domain[1] = config.max;
  }
  console.log('min.max', domain[0], domain[1])

  if (config.detail == dashboard.DETAIL_HIGH) 
  {
    var random = Math.floor(Math.random() * 1000);
    var wrapperDiv = d3
      .select("#" + parentHtmlId)
      .append("div")
      .attr("id", "wrapperDiv" + random);

    const WIDTH = 500;
    const HEIGHT = 200;

    var svg = wrapperDiv
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", 120)
      .style("margin-bottom", 0);

    dashboardComponents.setVisTitle(svg, config.title, config.link, config.detail, lastDate);

    dashboardComponents.visualizeNumber(
      svg,
      config,
      0,
      baseline_title + 25,
    );
    dashboardComponents.visualizeTrendArrow(
      svg,
      config,
      WIDTH - 120,
      baseline_title + 25,
    );

    // showing the highest value doesn't make sense 
    // for cumulative data 
    if(!config.cumulative)
    {
      dashboardComponents.visualizeValue(
        svg,
        max, 
        maxDate,
        config.unit,
        WIDTH - 270,
        baseline_title + 25,
        config.color, 
        config.abbreviate, 
        'max', 
        LINE_1
      );
      dashboardComponents.visualizeValue(
        svg,
        min, 
        minDate,
        config.unit,
        WIDTH - 270,
        baseline_title + 25,
        config.color, 
        config.abbreviate, 
        'min', 
        LINE_2
      );
    }

    wrapperDiv.append("br");


    var mark = "bar";
    if (config.cumulative)
      mark = "line";

    var scale = { domain: domain};

    var vegaLinechart = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      data: {
        values: config.data,
      },
      mark: mark,
      width: WIDTH - 100,
      height: HEIGHT - 100,
      encoding: {
        y: {
          field: config.dataField,
          type: "quantitative",
          title: "",
          scale: scale,
        },
        x: {
          field: config.dateField,
          type: "temporal",
          title: "",
        },
        color: { value: config.color },
      },
    };

    wrapperDiv.append("div").attr("id", "vegadiv-" + parentHtmlId + random);

    vegaEmbed("#vegadiv-" + parentHtmlId + random, vegaLinechart, { actions: false });
  } 

  // MEDIUM 
  else if (config.detail == dashboard.DETAIL_MEDIUM) 
  {
    var svg = d3.select("#" + parentHtmlId).append("svg");
    dashboardComponents.setVisTitle(svg, config.title, config.link, config.detail, lastDate);

    svg.attr("width", 400).attr("height", 110);

    dashboardComponents.visualizeNumber(
      svg,
      config,
      0,
      baseline_title + 25,
    );
    dashboardComponents.visualizeTrendArrow(
      svg,
      config,
      150,
      baseline_title + 25,
    );
    dashboardComponents.visualizeMiniChart(
      svg,
      config,
      300,
      baseline_title + 25,
      35,
      100, 
    );
  } 
  // LOW
  else if (config.detail == dashboard.DETAIL_LOW) 
  {

    var svg = d3.select("#" + parentHtmlId).append("svg");
    dashboardComponents.setVisTitle(svg, config.title, config.link, config.detail, lastDate);

    svg.attr("width", 180).attr("height", 70);

    dashboardComponents.visualizeNumberSmall(
      svg,
      config,
      0,
      baseline_title + 25,
    );
    dashboardComponents.visualizeMiniChart(
      svg,
      config,
      100,
      baseline_title + 25,
      18,
      70,
    );
  }
  // else if (detail == dashboard.DETAIL_MEDIUM) {
  //   var w = 100,
  //     h = 100;
  //   svg.attr("width", w).attr("height", h);

  //   visualizeNumberSmall(
  //     svg,
  //     dataStream,
  //     0,
  //     baseline_title + 25,
  //     field,
  //     color,
  //     mode,
  //     normalized,
  //     unit,
  //   );
  //   visualizeMiniChart(
  //     svg,
  //     dataStream,
  //     0,
  //     baseline_title + 55,
  //     18,
  //     w,
  //     field,
  //     color,
  //     mode,
  //     true,
  //   );
  // }
};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
/// TYPE CARTOGRAM
/////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

dashboard.visulizeScotlandNHSBoardCartogram = function (
  parentHtmlElementId, 
  widgetConfig,
  lastDateUpdated
  //   id,
  // title,
  // color,
  // data,
  // normalized,
  // detail,
  // lastDate,
) {
  // data comes in JSON
  var svg = d3
    .select("#" + parentHtmlElementId)
    .append("svg")
    .attr("width", TILE_WIDTH * 4)
    .attr("height", 100 + TILE_HEIGHT * 7);

    dashboardComponents.setVisTitle(svg, widgetConfig.title, null, widgetConfig.detail, lastDateUpdated);

  svg
    .append("text")
    .attr("x", 0)
    .attr("y", baseline_title + 30)
    .attr("class", "thin")
    .text("per NHS Board");

  // if (normalized) {
  //   svg
  //     .append("text")
  //     .attr("x", 0)
  //     .attr("y", baseline_title + 30 + LINE_HIGHT)
  //     .attr("class", "thin")
  //     .text("per 1000 people");
  // }
  let data = widgetConfig.data;
  var current = data[data.length - 1];
  var dataArray = [];
  var max = 0;
  var min = 10000000;

  for (let r in current) {
    if (!(r == "week commencing" || r == "date" || r == "index")) {
      dataArray.push({ name: r, value: current[r] });
      max = Math.max(max, current[r]);
      min = Math.min(min, current[r]);
    }
  }
  console.log('>> dataArray', dataArray);

  var valueScale = d3.scaleLinear().domain([0, max]).range([0, 1]);

  svg
    .selectAll("rect")
    .data(dataArray)
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
    .data(dataArray)
    .enter()
    .append("rect")
    .style("opacity", function (d) {
      return valueScale(d.value);
    })
    .style("fill", widgetConfig.color)
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
    .data(dataArray)
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
// parentHtmlElementId, 
// widgetConfig,
// lastDateUpdated

dashboard.visualizeBarChart = function (
  parentHtmlElementId,
  widgetConfig,
  lastDateUpdated
) {
  var random = Math.floor(Math.random() * 1000);
  var wrapperDiv = d3
    .select("#" + parentHtmlElementId)
    .append("div")
    .attr("id", "wrapperDiv" + random);

  var svg = wrapperDiv
    .append("svg")
    .attr("height", 40)
    .style("margin-bottom", 0);

  dashboardComponents.setVisTitle(svg, widgetConfig.title, widgetConfig.link, widgetConfig.detail, lastDateUpdated);

  wrapperDiv.append("br");

  var data = widgetConfig.data;
  // display only last data
  let lastDate = data[data.length - 1].index;
  data = data.filter((e) => {
    return e.index == lastDate;
  });

  // dashboard.DETAILED  
  var width = 150;
  var barWidth = 20;

  if (widgetConfig.detail == dashboard.DETAIL_MEDIUM) {
    width = 100;
    barWidth = 15;
  }
  else
  if (widgetConfig.detail == dashboard.DETAIL_LOW) {
    width = 70;
    barWidth = 10;
  }

  svg.attr("width", width);
  
  var vegaBarchart = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: {
      values: data,
    },
    width: width,
    height: { step: barWidth },
    mark: "bar",
    encoding: {
      y: {
        field: widgetConfig.categories,
        type: "nominal",
        title: "",
      },
      x: {
        field: widgetConfig.dataField,
        type: "quantitative",
        title: "",
      },
      color: { value: widgetConfig.color },
    },
  };

  wrapperDiv.append("div").attr("id", "vegadiv-" + parentHtmlElementId + random);

  vegaEmbed("#vegadiv-" + parentHtmlElementId + random, vegaBarchart, { actions: false });
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





































///////////////////////////////
/// VISULIZATION COMPONENTS ///
///////////////////////////////

dashboardComponents.visualizeNumber = function (
  svg,
  config,
  x,
  y,
) {
  var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

  if (config.cumulative){
    dashboardComponents.setVisLabel(g,"Total", 0, baseline_label);
  }else{
    if (config.timeUnit == dashboard.TIMEUNIT_DAY)
        dashboardComponents.setVisLabel(g, "New today", 0, baseline_label);
    if (config.timeUnit == dashboard.TIMEUNIT_WEEK)
        dashboardComponents.setVisLabel(g, "New this week", 0, baseline_label);
    if (config.timeUnit == dashboard.TIMEUNIT_MONTH)
        dashboardComponents.setVisLabel(g, "New this month", 0, baseline_label);
  }

  

  var val = config.data[config.data.length - 1][config.dataField];
  
  // abbreviate if required
  if (val > 1000000 && config.abbreviate) {
    val = val / 1000000;
    config.unit = "M ";
  } else if (val > 1000 && config.abbreviate) {
    val = val / 1000;
    config.unit = "k ";
  }

  val = Math.round(val * 10) / 10;
  val = val.toLocaleString(undefined);

  // add unit to value
  val += "" + config.unit;

  var bigNumber = {};

  var t = g
    .append("text")
    .text(val)
    .attr("y", 33)
    .attr("class", "bigNumber")
    .style("fill", config.color)
    .each(function () {
      bigNumber.width = this.getBBox().width;
    });

  // // if (config.) {
  //   g.append("text")
  //     .text(config.unit)
  //     .attr("x", bigNumber.width + 10)
  //     .attr("y", y + LINE_1)
  //     .attr("class", "thin");
  // //   g.append("text")
  // //     .text("100,000")
  // //     .attr("x", bigNumber.width + 10)
  // //     .attr("y", y + LINE_2)
  // //     .attr("class", "thin");
  // // }
};

dashboardComponents.visualizeNumberSmall = function (
  svg,
  config,
  x,
  y,
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

  var val = Math.round(config.data[config.data.length - 1][config.dataField] * 10) / 10;
  val = val.toLocaleString(undefined) + ' ' + config.unit ;

  // var bigNumber = {};
  svg
    .append("text")
    .text(val)
    .attr("y", y + 18)
    .attr("x", x)
    .attr("class", "smallNumber")
    .style("fill", config.color);

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

dashboardComponents.visualizeTrendArrow = function (
  svg, config, x, y) {

  var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

  if (config.timeUnit == dashboard.TIMEUNIT_WEEK)
    dashboardComponents.setVisLabel(g, "since last week", 0, baseline_label);
  if (config.timeUnit == dashboard.TIMEUNIT_DAY)
    dashboardComponents.setVisLabel(g, "since yesterday", 0, baseline_label);

  var secondLast = parseInt(config.data[config.data.length - 2][config.dataField]);
  var last = parseInt(config.data[config.data.length - 1][config.dataField]);
  let trendValue = last - secondLast;
  let rotation = 0;
  if (trendValue < 0) rotation = 45;
  if (trendValue > 0) rotation = -45;

  g.append("text")
    .text(function () {
      if (trendValue > 0) {
        return "up by";
      } else if (trendValue < 0) {
        return "down by";
      } else {
        return "no ";
      }
    })
    .attr("x", 45)
    .attr("y", LINE_1)
    .attr("class", "thin");

  if (trendValue == 0) {
    g.append("text")
      .text("change")
      .attr("x", 45)
      .attr("y", LINE_2)
      .attr("class", "thin");
  } else {
    g.append("text")
      .text(function () {
        trendValue = Math.abs(trendValue);
        if (config.unit == '%') {
          trendValue += "% pts";
        }
        return trendValue;
      })
      .attr("x", 45)
      .attr("y", LINE_2)
      .style("fill", config.color);
  }

  var g2 = g.append("g").attr("transform", function () {
    return "translate(17," + 20 + "),rotate(" + rotation + ")";
  });

  g2.append("line")
    .attr("x1", -15)
    .attr("x2", 15)
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("class", "arrow")
    .attr("stroke", config.color);
  g2.append("line")
    .attr("x1", 15)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", -15)
    .attr("class", "arrow")
    .attr("stroke", config.color);
  g2.append("line")
    .attr("x1", 15)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", 15)
    .attr("class", "arrow")
    .attr("stroke", config.color);
};


dashboardComponents.visualizeValue = function (
  svg, 
  val, 
  valDate, 
  unit,
  x, 
  y, 
  color,
  abbreviate,
  type, 
  line
  )
  {
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
  
    var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

    g.append("text")
      .text(type.charAt(0).toUpperCase() + type.slice(1) + ':')
      .attr("x", 0)
      .attr("y", line)
      .style('text-anchor', 'end')
      .attr("class", "thin")
    var valText = g.append("text")
      .text(val + unit)
      .attr("x", 5)
      .attr("y", line)
      .style('fill', color)
      .style('font-weight', '300')
      .attr("class", "thin");
    g.append("text")
      .text(valDate)
      .attr("x", valText.node().getBBox().width + 7)
      .attr("y", line)
      .attr("class", "thin");

};

dashboardComponents.visualizeMiniChart = function (
  svg,
  config,
  x,
  y,
  chartHeight,
  chartWidth) {

    
    var trendWindow = 1;
    if (config.timeUnit == dashboard.TIMEUNIT_WEEK) 
    trendWindow = 8;
    if (config.timeUnit == dashboard.TIMEUNIT_DAY) 
    trendWindow = 14;
    
    var barWidth = (chartWidth - 10) / trendWindow;
    
    var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
    
    if (config.timeUnit == dashboard.TIMEUNIT_WEEK)
    dashboardComponents.setVisLabel(g, "Last " + trendWindow + " weeks", 0, baseline_label);
    if (config.timeUnit == dashboard.TIMEUNIT_DAY)
    dashboardComponents.setVisLabel(g, "Last " + trendWindow + " days", 0, baseline_label);
    
    var x = d3
    .scaleLinear()
    .domain([0, trendWindow - 1])
    .range([0, chartWidth - barWidth]);
    
    // get N last entries
    var dataSlice = config.data.slice(config.data.length - trendWindow);

    // calc min & max in trend interval
    var min = 99999999
    var max = -99999999
    if(config.max != undefined)
      max = config.max;
    else{
      for(var i in dataSlice)
      {    
        if(parseFloat(dataSlice[i][config.dataField]) > max){
          max = parseFloat(dataSlice[i][config.dataField]);
        }
      }
    }
    if(config.min != undefined){
      min = config.min
    }else{
      for(var i in dataSlice)
      {
        if(parseFloat(dataSlice[i][config.dataField]) <= min){
          min = parseFloat(dataSlice[i][config.dataField]);
        }
      }
    }

  console.log('>> min,max', config.min, min, max)
  var y = d3.scaleLinear().domain([min, max]).range([chartHeight, 0]);

  // if perentage, show 100% line
  if (config.max) {
    g.append("line")
      .attr("y1", y(max))
      .attr("y2", y(max))
      .attr("x1", x(0))
      .attr("x2", x(dataSlice.length - 1))
      .attr("class", "chartTopLine");
    g.append("rect")
      .attr("x", x(0))
      .attr("y", y(max))
      .attr("height", Math.abs(y(max) - y(0)))
      .attr("width", x(dataSlice.length - 1) - x(0))
      .attr("class", "chartTopRect");
  }

  console.log('config.cumulative', config.cumulative)

  if (config.cumulative)
  {
    g.append("path")
      .datum(dataSlice)
      .attr("fill", config.color)
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
            return y(d[config.dataField]);
          }),
      );

    g.append("path")
      .datum(dataSlice)
      .attr("fill", "none")
      .attr("stroke", config.color)
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .x(function (d, i) {
            return x(i);
          })
          .y(function (d) {
            return y(d[config.dataField]);
          }),
      );

    g.append("circle")
      .attr("fill", config.color)
      .attr("r", 3)
      .attr("cx", x(dataSlice.length - 1))
      .attr("cy", y(dataSlice[dataSlice.length - 1][config.dataField]));
  } else 
  if(!config.cumulative)
  {
    g.selectAll("bar")
      .data(dataSlice)
      .enter()
      .append("rect")
      .style("fill", function (d, i) {
        var c = config.color;
        if (i == 13) c = d3.rgb(c).darker(1);
        return c;
      })
      .attr("x", function (d, i) {
        return x(i);
      })
      .attr("width", barWidth)
      .attr("y", function (d) {
        return y(d[config.dataField]);
      })
      .attr("height", function (d) {
        return chartHeight - y(d[config.dataField]);
      });
  }

  if (config.cumlative) {
    g.append("line")
      .attr("x1", x(6.9))
      .attr("x2", x(7.1))
      .attr("y1", 37)
      .attr("y2", 37)
      .attr("class", "weekBar");
  }
};

dashboardComponents.setVisTitle = function (g, text, link, detail, lastDate) {
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

  if (detail == dashboard.DETAIL_LOW || dashboard.DETAIL_MEDIUM) {
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

dashboardComponents.setVisLabel = function (g, text, x, y) {
  g.append("text").text(text).attr("class", "label").attr("x", x).attr("y", y);
};

dashboardComponents.setVisLabelRow2 = function (g, text, x, y) {
  g.append("text")
    .text(text)
    .attr("class", "label")
    .attr("x", x)
    .attr("y", y + 15);
};

