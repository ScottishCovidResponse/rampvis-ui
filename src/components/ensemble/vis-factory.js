import { ParallelVerticalChart } from "./parallel-vertical-chart";
import { ParallelChart } from "./parallel-chart";
import { ScatterPlot } from "./scatter-plot";
import { MatrixChart } from "./matrix-chart";
import { LineChart } from "./line-chart";

export const visFactory = (type, args) => {
  if (type == "ParallelVerticalChart") return new ParallelVerticalChart(args);
  if (type == "ParallelChart") return new ParallelChart(args);
  if (type == "ScatterPlot") return new ScatterPlot(args);
  if (type == "MatrixChart") return new MatrixChart(args);
  if (type == "LineChart") return new LineChart(args);

  return null;
};
