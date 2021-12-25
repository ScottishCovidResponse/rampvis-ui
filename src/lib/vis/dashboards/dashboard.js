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
import { color } from "@mui/system";
import * as d3 from "d3";
import { zip } from "lodash";
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



var FONT_SIZE_BIG = 27;
var FONT_SIZE_MEDIUM = 20
var FONT_SIZE_LABELS = 10
var BASELINE_WIDGET_TITLE = 10;
var BASELINE_LARGE_NUMBER = BASELINE_WIDGET_TITLE + 17;
var BASELINE_LABELS = BASELINE_LARGE_NUMBER + FONT_SIZE_BIG-10;
var LINE_1 = 12;
var LINE_2 = LINE_1 + 17;

var COLOR_LABELS = '#ccc'

dashboard.LINE_HIGHT = 20;
let LINE_HIGHT = 20;

dashboard.DETAIL_HIGH = "high";
dashboard.DETAIL_LOW = "low";
dashboard.DETAIL_MEDIUM = "medium";

dashboard.LAYOUT_HORIZONTAL = "horizontal";
dashboard.LAYOUT_VERTICAL = "vertical";
dashboard.LAYOUT_COMPACT = "compact";

dashboard.VIS_LINECHART = "linechart";
dashboard.VIS_CARTOGRAM = "cartogram";
dashboard.VIS_BARCHART = "barchart";
dashboard.VIS_PROGRESS = "progress";
dashboard.VIS_PROGRESS_GRID = "progress_grid"

dashboard.TIMEUNIT_SECOND = 'second';
dashboard.TIMEUNIT_MINUTE = 'minute';
dashboard.TIMEUNIT_HOUR = 'hour';
dashboard.TIMEUNIT_DAY = 'day';
dashboard.TIMEUNIT_WEEK = 'week';
dashboard.TIMEUNIT_MONTH = 'month';
dashboard.TIMEUNIT_YEAR = 'year';

var WIDTH_HIGH = 400;
var HIGHT_HIGH = 250;

var WIDTH_MEDIUM = 300;
var HIGHT_MEDIUM = 80;

var WIDTH_LOW = 200;

var WIDTH_VERTICAL = 100;
var HEIGHT_VERTICAL = 400;



// Cartogram/Tilemap
var TILE_WIDTH = 40;
var TILE_HEIGHT = 40;
var TILE_GAP = 4;

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
  var dataField = widgetConfig.dataField;
  // check if data is not empty
  if (data.length == 0) {
    console.log("NO DATA FOUND / DATA ARRAY IS EMPTY", id);
    return;
  }

  // check for filter conditions on data
  if (widgetConfig.conditions && widgetConfig.conditions.length > 0) {
    for (var i in widgetConfig.conditions) {
      data = executeCondition(data, widgetConfig.conditions[i]);
    }
  }
  console.log('>>> data', data)

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
  
  if(!widgetConfig.timeWindow)
    widgetConfig.timeWindow = 7;

  if(!widgetConfig.timeLabel)
    widgetConfig.timeLabel = dashboard.TIMEUNIT_WEEK;

  if(!widgetConfig.timeUnit)
    widgetConfig.timeUnit = dashboard.TIMEUNIT_DAY;
  
  if(!widgetConfig.max)
    widgetConfig.max = Math.max.apply(Math, widgetConfig.data.map(function(o) {return o[widgetConfig.dataField]; }));
  console.log("max set");
  console.log(widgetConfig.max)
  
  if(!widgetConfig.min)
    widgetConfig.min = 0;

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
      widgetConfig,
      lastDateUpdated
    );
  }
  else if (widgetConfig.visualization == dashboard.VIS_PROGRESS_GRID) {
    dashboard.visualizeProgressGrid(
      parentHtmlElementId,
      widgetConfig,
      lastDateUpdated
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
    console.log('>>> data', data)

  console.log('c', c)
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

  // DETAIL HIGH
  if (config.detail == dashboard.DETAIL_HIGH) 
  {
    var random = Math.floor(Math.random() * 1000);
    var wrapperDiv = d3
      .select("#" + parentHtmlId)
      .append("div")
      .attr("id", "wrapperDiv" + random);

    const WIDTH = WIDTH_HIGH;
    const HEIGHT = 150;

    var svg = wrapperDiv
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", BASELINE_LABELS + 40)
      .style("margin-bottom", 0);

    dashboardComponents.setWidgetTitle(svg, config.title, config.link, config.detail, lastDate);

    dashboardComponents.visualizeNumber(
      svg,
      config,
      0,
      BASELINE_LARGE_NUMBER,
      FONT_SIZE_BIG
    );
    dashboardComponents.visualizeTrendArrow(
      svg,
      config,
      WIDTH - 100,
      BASELINE_LARGE_NUMBER,
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
        WIDTH - 210,
        BASELINE_LARGE_NUMBER,
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
        WIDTH - 210,
        BASELINE_LARGE_NUMBER,
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
      width: WIDTH - 65,
      height:HIGHT_HIGH - HEIGHT,
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

  //////////////// MEDIUM 
  else if (config.detail == dashboard.DETAIL_MEDIUM) 
  {
    var svg = d3.select("#" + parentHtmlId).append("svg");
    dashboardComponents.setWidgetTitle(svg, config.title, config.link, config.detail, lastDate);

    svg
      .attr("width", WIDTH_MEDIUM)
      .attr("height", HIGHT_MEDIUM);

    dashboardComponents.visualizeNumber(
      svg,
      config,
      0,
      BASELINE_LARGE_NUMBER,
      FONT_SIZE_BIG
    );
    dashboardComponents.visualizeTrendArrow(
      svg,
      config,
      WIDTH_MEDIUM - 200,
      BASELINE_LARGE_NUMBER,
    );
    dashboardComponents.visualizeMiniChart(
      svg,
      config,
      WIDTH_MEDIUM - 90,
      BASELINE_LARGE_NUMBER,
      35,
      90, 
    );
  } 
  // LOW
  else if (config.detail == dashboard.DETAIL_LOW) 
  {

    var svg = d3.select("#" + parentHtmlId).append("svg");
    dashboardComponents.setWidgetTitle(svg, config.title, config.link, config.detail, lastDate);

    if(config.layout == dashboard.LAYOUT_HORIZONTAL)
    {
    
      svg.attr("width", 180).attr("height", 70);

      dashboardComponents.visualizeNumber(
        svg,
        config,
        0,
        BASELINE_LARGE_NUMBER,
        FONT_SIZE_MEDIUM
      );
      dashboardComponents.visualizeMiniChart(
        svg,
        config,
        100,
        BASELINE_LARGE_NUMBER,
        18,
        100
      );
    }else 
    if(config.layout == dashboard.LAYOUT_VERTICAL)
    {
      svg.attr("width", 70).attr("height", 200);
      dashboardComponents.visualizeNumber(
        svg,
        config,
        0,
        BASELINE_LARGE_NUMBER,
        FONT_SIZE_MEDIUM
      );
      dashboardComponents.visualizeMiniChart(
        svg,
        config,
        0,
        100,
        50,
        60
      );
    }
  } 

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

    dashboardComponents.setWidgetTitle(svg, widgetConfig.title, null, widgetConfig.detail, lastDateUpdated);

  svg
    .append("text")
    .attr("x", 0)
    .attr("y", BASELINE_WIDGET_TITLE + 30)
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

  dashboardComponents.setWidgetTitle(svg, widgetConfig.title, widgetConfig.link, widgetConfig.detail, lastDateUpdated);

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
  parentHtmlId,
  config,
  lastDate
  )  {

  var dataObj = {}
  var width = 40
  var isTimeseries = false

  if(config.data.length > 1)
  {
    console.log("restructuring")
    isTimeseries = true;
    dataObj = config.data[config.data.length - 1];
    width = 120;
  }else{
    dataObj = config.data;
  }

  var random = Math.floor(Math.random() * 1000);
  var wrapperDiv = d3
  .select("#" + parentHtmlId)
  .append("div")
  .attr("id", "wrapperDiv" + random);

  if(config.layout == dashboard.LAYOUT_HORIZONTAL){
    var svg = wrapperDiv
    .append("svg")
    .attr("height", 100)
    .attr('width',WIDTH_HIGH)
    .style("margin-bottom", 0)
    .style("margin-right", 0)
    .style("z-index", -1);
  }
  else if(config.layout == dashboard.LAYOUT_VERTICAL){
    var svg = wrapperDiv
    .append("svg")
    .attr("height", HEIGHT_VERTICAL)
    .attr('width',WIDTH_HIGH)
    .style("margin-bottom", 0)
    .style("margin-right", 0)
    .style("z-index", -1);
  }


  dashboardComponents.setWidgetTitle(svg, config.title, config.link, config.detail, lastDate);
  var forignObject;

  if (config.detail == dashboard.DETAIL_HIGH) 
  {
    wrapperDiv.append("br");

    
    if(config.layout == dashboard.LAYOUT_HORIZONTAL)
    {
      if(isTimeseries)
    {
      dashboardComponents.visualizeTrendArrow(
        svg,
        config,
        WIDTH_HIGH-100,
        BASELINE_LARGE_NUMBER,
      );
    }

    dashboardComponents.visualizeNumber(
      svg,
      config,
      0,
      BASELINE_LARGE_NUMBER,
      FONT_SIZE_BIG
    );  

    console.log('data', dataObj, config.data)

    var vegaProgressChart = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      data: { 
        values: dataObj,
      },
      width: WIDTH_HIGH - 100 - 100,
      layer: [{
        mark: "bar",
        encoding: {
          x: {
            field: config.dataField,
            type: "quantitative",
            scale: {"domain": [config.min, config.max]},
            tickExtra: true,
            tickBand: "extent",
            title: null
          },
          color: { value: config.color }
        },
      }, 
    ],
      config: {
        axis: {grid: true, tickBand: "extent"}
      }, 
    }

    forignObject = svg.append('foreignObject')
    .attr('width', 220).attr('height', 100)
    .attr('x', 80)
    .attr('y', BASELINE_LARGE_NUMBER)
      
    }
    else if(config.layout == dashboard.LAYOUT_VERTICAL)
    {
      svg.attr("width", WIDTH_VERTICAL);
      svg.attr("height", HEIGHT_VERTICAL);
            
      if(isTimeseries)
      {
        dashboardComponents.visualizeTrendArrow(
          svg,
          config,
          WIDTH_VERTICAL-100,
          BASELINE_LARGE_NUMBER,
        );
      }

      dashboardComponents.visualizeNumber(
        svg,
        config,
        0,
        HEIGHT_VERTICAL - 100,
        FONT_SIZE_BIG
      );  

      console.log('data', dataObj, config.data)

      var vegaProgressChart = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        data: { 
          values: dataObj,
        },
        width: WIDTH_VERTICAL - 100,
        layer: [{
          mark: "bar",
          encoding: {
            y: {
              field: config.dataField,
              type: "quantitative",
              scale: {"domain": [config.min, config.max]},
              tickExtra: true,
              tickBand: "extent",
              title: null
            },
            color: { value: config.color }
          },
        }, 
      ],
        config: {
          axis: {grid: true, tickBand: "extent"}
        }, 
      }

      forignObject = svg.append('foreignObject')
      .attr('width', 60).attr('height', 220)
      . attr('x', 5)
      .attr('y', BASELINE_LARGE_NUMBER + 47)
      
    }
  }
  else if(config.detail == dashboard.DETAIL_MEDIUM){
    wrapperDiv.append("br");
    
    //width - 300
    if(config.layout == dashboard.LAYOUT_HORIZONTAL){
      svg.attr("width", WIDTH_MEDIUM);
      svg.attr("height", 100);

      dashboardComponents.visualizeNumber(
        svg,
        config,
        0,
        BASELINE_WIDGET_TITLE + 22,
        FONT_SIZE_MEDIUM
      );
    
      var vegaProgressChart = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        data: { 
          values: dataObj,
        },
        width: WIDTH_MEDIUM -100 -10,
        layer: [{
          mark: "bar",
          encoding: {
            x: {
              field: config.dataField,
              type: "quantitative",
              scale: {"domain": [config.min, config.max]},
              tickExtra: true,
              tickBand: "extent",
              title: null
            },
            color: { value: config.color }
          },
        }
      ],
        config: {
          axis: {grid: true, tickBand: "extent"}
        }, 
      };

      forignObject = svg.append('foreignObject')
      .attr('width', 220).attr('height', 100)
      .attr('x', 80)
      .attr('y', BASELINE_LARGE_NUMBER)
      
    }
    else if(config.layout == dashboard.LAYOUT_VERTICAL){
      svg.attr("width", WIDTH_VERTICAL);
      svg.attr("height", HEIGHT_VERTICAL);
      
      dashboardComponents.visualizeNumber(
        svg,
        config,
        0,
        HEIGHT_VERTICAL - 145,
        FONT_SIZE_BIG
      );  
    
      var vegaProgressChart = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        data: { 
          values: dataObj,
        },
        width: WIDTH_VERTICAL - 100,
        layer: [{
          mark: "bar",
          encoding: {
            y: {
              field: config.dataField,
              type: "quantitative",
              scale: {"domain": [config.min, config.max]},
              tickExtra: true,
              tickBand: "extent",
              title: null
            },
            color: { value: config.color }
          },
        }
      ],
        config: {
          axis: {grid: true, tickBand: "extent"}
        }, 
      };  

      forignObject = svg.append('foreignObject')
      .attr('width', 60).attr('height', 220)
      . attr('x', 5)
      .attr('y', BASELINE_LARGE_NUMBER + 5)
    }
  }
  /////////// DETAIL LOW
  else if(config.detail == dashboard.DETAIL_LOW){
    wrapperDiv.append("br");
    
    if(config.layout == dashboard.LAYOUT_VERTICAL){
      svg.attr("width", WIDTH_VERTICAL);
      svg.attr("height", HEIGHT_VERTICAL);
  
      dashboardComponents.visualizeNumber(
        svg,
        config,
        0,
        BASELINE_LARGE_NUMBER + 80,
        FONT_SIZE_MEDIUM
      );
  
      var vegaProgressChart = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        data: { 
          values: dataObj
        },
        width: WIDTH_VERTICAL - 100,
        layer: [{
          mark: "bar",
          encoding: {
            y: {
              field: config.dataField,
              type: "quantitative",
              scale: {"domain": [config.min, config.max]},
              axis: null
            },
            color: { value: config.color }
          },
        }, 
      ],
        config: {
          axis: {grid: true, tickBand: "extent"}
        },
      };
  
      forignObject = svg.append('foreignObject')
      .attr('width', WIDTH_LOW-100)
      .attr('height', 70)
      .attr('x', 5)
      .attr('y', BASELINE_LARGE_NUMBER + 4)
    }
    else if(config.layout == dashboard.LAYOUT_HORIZONTAL){
      svg.attr("width", WIDTH_LOW);
      svg.attr("height", 80);
  
      dashboardComponents.visualizeNumber(
        svg,
        config,
        0,
        BASELINE_LARGE_NUMBER,
        FONT_SIZE_MEDIUM
      );
  
      var vegaProgressChart = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        data: { 
          values: dataObj
        },
        width: WIDTH_LOW - 100-10,
        layer: [{
          mark: "bar",
          encoding: {
            x: {
              field: config.dataField,
              type: "quantitative",
              scale: {"domain": [config.min, config.max]},
              axis: null
            },
            color: { value: config.color }
          },
        }, 
      ],
        config: {
          axis: {grid: true, tickBand: "extent"}
        },
      };
  
      forignObject = svg.append('foreignObject')
      .attr('width', WIDTH_LOW-100)
      .attr('height', 70)
      .attr('x', 80)
      .attr('y', BASELINE_LARGE_NUMBER)
    }

  }

  forignObject.append("xhtml:div").attr("id", "vegadiv-" + parentHtmlId + random)
  .style("position", "absolute");
  
  vegaEmbed("#vegadiv-" + parentHtmlId + random, vegaProgressChart, { actions: false, renderer: "svg"});
};

dashboard.visualizeProgressGrid = function (
  parentHtmlId,
  config,
  lastDate
  )  {
    var dataObj = {}
    var width = 40
    var isTimeseries = false
    var proportion = 0
    var currentValue = 0
    var format = ".1f"
    var upto_index = 0

    if(config.data.length > 1)
    {
      console.log("restructuring")
      isTimeseries = true;
      dataObj = config.data[config.data.length - 1];
      currentValue = config.data[config.data.length - 1][config.dataField]/config.max * 100;
      proportion = config.data[config.data.length - 1][config.dataField]/config.max;
      upto_index = parseInt(currentValue)
      width = 120;
    }else{
      dataObj = config.data;
      proportion = config.data[config.data.length - 1][config.dataField]/config.max
      upto_index = parseInt(proportion * 100)
      format = ".1%"
    }
    const f = d3.format(format);

    if(config.detail == dashboard.DETAIL_HIGH){
      var cell_side = 20
      var cell_nr = 10
      var grid_width = "250px"
      var grid_height = "280px"
      var text_dx = 55
      var text_dy = 180
      var cell_displace_x = 0
      var cell_displace_y = 80
    }
    else if(config.detail == dashboard.DETAIL_MEDIUM){
      var cell_side = 10
      var cell_nr = 10
      var grid_width = "110px"
      var grid_height = "140px"
      var text_dx = 55
      var text_dy = 80
      var cell_displace_x = 0
      var cell_displace_y = 30
    }
    else if(config.detail == dashboard.DETAIL_LOW){
      var cell_side = 50
      var cell_nr = 1
      var grid_width = "50px"
      var grid_height = "100px"
      var grid_size_num = 50
      var text_dx = 25
      var text_dy = 55
      var cell_displace_x = 0
      var cell_displace_y = 30
      upto_index = 0
    }
    var gridData = makeGridStructure(cell_nr, cell_side, cell_side);

    var random = Math.floor(Math.random() * 1000);
    var wrapperDiv = d3
    .select("#" + parentHtmlId)
    .append("div")
    .attr("id", "wrapperDiv" + random);

    var grid = wrapperDiv
    .append("svg")
    .attr("width",grid_width)
    .attr("height",grid_height);

    dashboardComponents.setWidgetTitle(grid, config.title, config.link, config.detail, lastDate);

    var row = grid.selectAll(".row")
    .data(gridData)
    .enter().append("g")
    .attr("class", "row");

    var column = row.selectAll(".square")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("class","square")
    .attr("x", function(d) { return d.x + cell_displace_x; })
    .attr("y", function(d) { return d.y + cell_displace_y; })
    .attr("width", function(d) { return d.width; })
    .attr("height", function(d) { return d.height; })
    .style("fill", function(d) {
      if(d.index < upto_index){
        return config.color;
      }
      else{
        return "#DCDCDC";
      }
    })
    .style("stroke", "#fff");

    if(config.detail==dashboard.DETAIL_LOW){
      console.log(proportion)
      console.log(grid_width)
      grid.append("rect")
      .attr("width", grid_size_num * proportion + "px")
      .attr("height",grid_size_num * proportion + "px")
      .attr("x", 1.5)
      .attr("y", 31.5)
      .style("fill", config.color);
    }
    if(config.detail!=dashboard.DETAIL_HIGH){
      grid.append('text')
      .text(f(proportion.toString()))
      .attr('fill', config.color)
      .attr('dx', text_dx)
      .attr('dy', text_dy)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .style("font-weight", "bold")
      .style("stroke", "#fff")
      .style("stroke-width", 0.7);
    }

    if(config.detail==dashboard.DETAIL_HIGH){
      dashboardComponents.visualizeNumber(
        grid,
        config,
        0,
        30,
        FONT_SIZE_BIG
      );  
  
      dashboardComponents.visualizeTrendArrow(
        grid,
        config,
        115,
        30,
      );
    }
  }


function makeGridStructure(cell_count, width, height) {
  var data = new Array();
  var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
  var ypos = 1;
  var width = width;
  var height = height;
  // iterate for rows 
  var count = 0;
  for (var row = 0; row < cell_count; row++) {
      data.push( new Array() );
      // iterate for cells/columns inside rows
      for (var column = 0; column < cell_count; column++) {
          data[row].push({
              x: xpos,
              y: ypos,
              width: width,
              height: height,
              index: count
          })
          count += 1;
          // increment the x position. I.e. move it over by 50 (width variable)
          xpos += width;
      }
      // reset the x position after a row is complete
      xpos = 1;
      // increment the y position for the next row. Move it down 50 (height variable)
      ypos += height; 
  }
  return data;
}




































///////////////////////////////
/// VISULIZATION COMPONENTS ///
///////////////////////////////

dashboardComponents.visualizeNumber = function (
  svg,
  config,
  x,
  y,
  fontSize
) {
  var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

  if (config.cumulative){
    dashboardComponents.setLabel(g,"Total", 0, BASELINE_LABELS);
  }else{
    if (config.timeUnit == dashboard.TIMEUNIT_DAY)
        dashboardComponents.setLabel(g, "New today", 0, BASELINE_LABELS);
    if (config.timeUnit == dashboard.TIMEUNIT_WEEK)
        dashboardComponents.setLabel(g, "New this week", 0, BASELINE_LABELS);
    if (config.timeUnit == dashboard.TIMEUNIT_MONTH)
        dashboardComponents.setLabel(g, "New this month", 0, BASELINE_LABELS);
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
    .attr("y", fontSize)
    .style('font-weight', 'bold')
    .style('font-size', fontSize)
    .style("fill", config.color)
    .each(function () {
      bigNumber.width = this.getBBox().width;
    });
};

dashboardComponents.visualizeTrendArrow = function (
  svg, config, x, y) {

  var window = config.timeWindow;

  var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

  if (config.timeLabel == dashboard.TIMEUNIT_HOUR)
    dashboardComponents.setLabel(g, "Over the last " + window + " hours", 0, BASELINE_LABELS); 
  else if (config.timeLabel == dashboard.TIMEUNIT_DAY)
  dashboardComponents.setLabel(g, "Over the last " + window + " days", 0, BASELINE_LABELS);
  else if (config.timeLabel == dashboard.TIMEUNIT_WEEK)
    dashboardComponents.setLabel(g, "Over the last " + window + " weeks", 0, BASELINE_LABELS);
  else if (config.timeLabel == dashboard.TIMEUNIT_MONTH)
    dashboardComponents.setLabel(g, "Over the last " + window + " months", 0, BASELINE_LABELS);
  else if (config.timeLabel == dashboard.TIMEUNIT_YEAR)
    dashboardComponents.setLabel(g, "Over the last " + window + " years", 0, BASELINE_LABELS); 

  var baseSample = parseFloat(config.data[config.data.length - (window + 1)][config.dataField]);
  var last = parseFloat(config.data[config.data.length - 1][config.dataField]).toFixed(3);
  let trendValue = last - baseSample;
  console.log("trend")
  console.log(trendValue)
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
    .attr("font-size", FONT_SIZE_LABELS );

  if (trendValue == 0) {
    g.append("text")
      .text("change")
      .attr("x", 45)
      .attr("y", LINE_2)
      .attr("class", "thin");
  } else {
    g.append("text")
      .text(function () {
        trendValue = Math.abs(trendValue.toFixed(3));
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

  var arrowSize = 12
  var arrowThickness = 5;
  g2.append("line")
    .attr("x1", -arrowSize)
    .attr("x2", arrowSize)
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("class", "arrow")
    .attr("stroke", config.color)
    .style('stroke-width', arrowThickness)
    .style('stroke-linecap', 'round')
  
  g2.append("line")
    .attr("x1", arrowSize)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", -arrowSize)
    .attr("class", "arrow")
    .attr("stroke", config.color)
    .style('stroke-width', arrowThickness)
    .style('stroke-linecap', 'round')

  g2.append("line")
    .attr("x1", arrowSize)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", arrowSize)
    .attr("class", "arrow")
    .attr("stroke", config.color)
    .style('stroke-width', arrowThickness)
    .style('stroke-linecap', 'round')    

};

//implement - add timeWindow and timeLabel
dashboardComponents.visualizeTrendArrowNew = function (
  svg, config, x, y) {
  
  console.log("called trend")
  
  var window = config.timeWindow;

  var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

  if (config.timeLabel == dashboard.TIMEUNIT_HOUR)
    dashboardComponents.setLabel(g, "Over the last " + window + " hours", 0, BASELINE_LABELS); 
  else if (config.timeLabel == dashboard.TIMEUNIT_DAY)
  dashboardComponents.setLabel(g, "Over the last " + window + " days", 0, BASELINE_LABELS);
  else if (config.timeLabel == dashboard.TIMEUNIT_WEEK)
    dashboardComponents.setLabel(g, "Over the last " + window + " weeks", 0, BASELINE_LABELS);
  else if (config.timeLabel == dashboard.TIMEUNIT_MONTH)
    dashboardComponents.setLabel(g, "Over the last " + window + " months", 0, BASELINE_LABELS);
  else if (config.timeLabel == dashboard.TIMEUNIT_YEAR)
    dashboardComponents.setLabel(g, "Over the last " + window + " years", 0, BASELINE_LABELS); 

  var baseSample = parseFloat(config.data[config.data.length - (window + 1)][config.dataField]);
  var last = parseFloat(config.data[config.data.length - 1][config.dataField]).toFixed(3);
  let trendValue = last - baseSample;
  let rotation = 0;
  if (trendValue < 0) rotation = 45;
  if (trendValue > 0) rotation = -45;

  trendValue = Math.round(trendValue * 100) / 100
  console.log("trend value:")
  console.log(trendValue)

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

  if (trendValue == 0) {
    g.append("text")
      .text("change")
      .attr("x", 45)
      .attr("y", LINE_2)
      .attr('text-anchor','end')
  } else {
    g.append("text")
      .text(function () {
        trendValue = Math.abs(trendValue);
        if (config.unit == '%') {
          trendValue += "% pts.";
        }
        return trendValue;
      })
      .attr("x", 45)
      .attr("y", LINE_2)
      .style("fill", config.color)
      .attr('text-anchor','end')
  }

  var g2 = g.append("g").attr("transform", function () {
    return "translate(0," + 20 + "),rotate(" + rotation + ")";
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
      // unit = "M " + unit;
    } else if (val > 1000 && abbreviate) {
      val = val / 1000;
      // unit = "k " + unit;
    }

    val = Math.round(val * 10) / 10;
    val = val.toLocaleString(undefined);
  
    var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

    g.append("text")
      .text(type.charAt(0).toUpperCase() + type.slice(1) + ':')
      .attr("x", 0)
      .attr("y", line)
      .style('text-anchor', 'end')
      .style("fill", '#000')
      .style('font-size', FONT_SIZE_LABELS)

    var valText = g.append("text")
      .text(val + unit)
      .attr("x", 5)
      .attr("y", line)
      .style('fill', color)
      .style('font-weight', 'bold')
      .style('font-size', FONT_SIZE_LABELS)

    g.append("text")
      .text(valDate)
      .attr("x", valText.node().getBBox().width + 7)
      .attr("y", line)
      .style("fill", COLOR_LABELS)
      .style('font-size', FONT_SIZE_LABELS)

};

dashboardComponents.visualizeMiniChart = function (
  svg,
  config,
  x,
  y,
  chartHeight,
  chartWidth) 
  {
    var trendWindow
    if(config.trendWindow == 'all')
    {
      trendWindow = config.data.length;
    }
    else
    {
      if (config.timeUnit == dashboard.TIMEUNIT_WEEK) {
        trendWindow = 8;
      }
      if (config.timeUnit == dashboard.TIMEUNIT_DAY) {
        trendWindow = 14;
      }
    }

    var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
    if (config.timeUnit == dashboard.TIMEUNIT_WEEK) {
      dashboardComponents.setLabel(g, "Last " + trendWindow + " weeks", 0, BASELINE_LABELS);
    }
    if (config.timeUnit == dashboard.TIMEUNIT_DAY) {
      dashboardComponents.setLabel(g, "Last " + trendWindow + " days", 0, BASELINE_LABELS);
    }
    
    var barWidth = (chartWidth - 10) / trendWindow;
    

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

dashboardComponents.setWidgetTitle = function (g, text, link, detail, lastDate) {

  g.append("line")
    .attr("x1", 0)
    .attr("x2", 10000)
    .attr("y1", BASELINE_WIDGET_TITLE + 5)
    .attr("y2", BASELINE_WIDGET_TITLE + 5)
    .attr("class", "separator");

  if (link) {
    text = text + " [details available]";
  }

  var text = g
    .append("text")
    .style('font-size', FONT_SIZE_LABELS)
    .style('font-weight', 'bold')
    .text(text)
    .attr("y", BASELINE_WIDGET_TITLE);

  if (detail == dashboard.DETAIL_LOW || dashboard.DETAIL_MEDIUM) {
    text.style("font-size", "9pt");
  }

  if (lastDate) {
    g.append("text")
      .text(lastDate.format("MMM DD, YYYY"))
      .style('font-size', FONT_SIZE_LABELS)
      .style('fill', COLOR_LABELS)
      .attr("y", BASELINE_WIDGET_TITLE + 15);
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

dashboardComponents.setLabel = function (g, text, x, y) {
  g.append("text").text(text)
  .attr("font-size", FONT_SIZE_LABELS)
  .style('fill', COLOR_LABELS)
  .attr("x", x)
  .attr("y", y);
};

dashboardComponents.setLabelRow2 = function (g, text, x, y) {
  g.append("text")
    .text(text)
    .attr("font-size", FONT_SIZE_LABELS)
    .attr("x", x)
    .style('color', '#888')
    .attr("y", y + 15);
};

