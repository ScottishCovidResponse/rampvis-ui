import * as d3 from "d3";
import { visFactory } from "src/lib/vis/vis-factory";

export class UncertaintyClusterSampleAndMean {


  constructor(options) {
    const data = options.data[0].values
    let factor = (data.processed.length < 6) ? 1 / data.processed.length : 1 / 5
    console.log(data)
    let meanLineColors = options.meanLineColors ? options.meanLineColors : '';
    let sampleLineColors = options.sampleLineColors ? options.sampleLineColors : '';
    let chartWidths = options.chartWidths ? options.chartWidths : '';
    let divId = options.divId ? options.divId : 'charts';

    const createDivs = clusters => {
      let currentChart = document.createElement("div")
      clusters.forEach((element, i) => {
        currentChart = document.createElement("div")
        currentChart.setAttribute("id", `chart${i}`);
        currentChart.setAttribute("style", "width: " + chartWidths);
        document.getElementById(divId).append(currentChart)
      });
    }
    const drawPlots = clusters => {
      clusters.forEach((element, i) => {
        var spoofInput = [{}];
        spoofInput[0] = { ...{}, values: element };
        visFactory("UncertaintySampleAndMean", {
          chartElement: `chart${i}`, // ref.current,
          data: spoofInput,
          heightfactor: factor,
          widthfactor: 1,
          meanLineColor: meanLineColors[i],
          sampleLineColor: sampleLineColors[i],
          containerChart: divId,
          yMax: data.yMax
        }
        );
      });
    }
    createDivs(data.processed)
    drawPlots(data.processed)

    //Redraw the plots when window size changes
    function resize() {
      drawPlots(data.processed)
      console.log("redrawing")
    }
    d3.select(window).on("resize.updatesvg", resize);
  }
}
