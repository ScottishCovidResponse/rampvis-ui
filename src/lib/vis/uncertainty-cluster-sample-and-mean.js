import * as d3 from "d3";
import { visFactory } from "src/lib/vis/vis-factory";

export class UncertaintyClusterSampleAndMean {


  constructor(options) {

    const data = options.data[0].values
    let factor = 1 / 3.5
    data.processed.length < 4 ? factor = 1 / data.processed.length : factor = 1 / 3.5
    console.log(data)

    const createDivs = clusters => {
      let currentChart = document.createElement("div")
      clusters.forEach((element, i) => {
        currentChart = document.createElement("div")
        currentChart.setAttribute("id", `chart${i}`);
        document.getElementById("charts").append(currentChart)
      });
    }

    const drawPlots = clusters => {
      clusters.forEach((element, i) => {
        visFactory("UncertaintySampleAndMean", {
          chartElement: `chart${i}`, // ref.current,
          data: element,
          heightfactor: factor

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
