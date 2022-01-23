import * as d3 from "d3";
import { visFactory } from "src/lib/vis/vis-factory";

export class SensitivityParameterRangeSampleMean {
  constructor(options) {
    const data = options.data[0].values;
    let colors = [
      "#E69F00",
      "#009E73",
      "#DB4D56",
      "#0072B2",
      "#D55E00",
      "#F0E442",
      "#56B4E9",
    ];
    const baseColor = ["#4f4f4f"];
    const textColor = ["#4f4f4f"];
    const textWeight = 700;
    console.log(data);

    const createMeanSampleDiv = (clusters) => {
      let currentChart = document.createElement("div");
      currentChart = document.createElement("div");
      currentChart.setAttribute("id", `meanSampleChart`);
      currentChart.setAttribute(
        "style",
        "width: 80%; vertical-align: top; margin-left:34%",
      );
      document.getElementById("charts").append(currentChart);
    };

    const drawMeanSamplePlots = (clusters) => {
      var spoofInput = [{}];
      spoofInput[0] = { ...{}, values: data.processed.meanAllData };
      visFactory("UncertaintyClusterSampleAndMean", {
        chartElement: `meanSampleChart`, // ref.current,
        data: spoofInput,
        meanLineColors: colors,
        divId: `meanSampleChart`,
      });
    };
    const createparameterRangeDiv = (clusters) => {
      let currentChart = document.createElement("div");
      currentChart = document.createElement("div");
      currentChart.setAttribute("id", `parameterRangeChart`);
      currentChart.setAttribute("style", "width: 34%; float: left");
      document.getElementById("charts").append(currentChart);
    };

    const drawparameterRangePlot = (clusters) => {
      var spoofInput = [{}];
      spoofInput[0] = { ...{}, values: data.processed.parameterData };
      visFactory("SensitivityParameterRangeChart", {
        chartElement: `parameterRangeChart`, // ref.current,
        data: spoofInput,
        colors: colors,
        heightfactor: 1.05,
        divId: `parameterRangeChart`,
      });
    };
    //Do not modify this order!
    createparameterRangeDiv(data.processed);
    drawparameterRangePlot(data.processed);
    createMeanSampleDiv(data.processed);
    drawMeanSamplePlots(data.processed);

    //Redraw the plots when window size changes
    function resize() {
      createparameterRangeDiv(data.processed);
      drawparameterRangePlot(data.processed);
      createMeanSampleDiv(data.processed);
      drawMeanSamplePlots(data.processed);
      console.log("redrawing");
    }
    d3.select(window).on("resize.updatesvg", resize);
  }
}
