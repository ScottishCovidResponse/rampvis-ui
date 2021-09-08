// Namespace for phong's vises.

import { matrix } from "./pv-matrix";
import { continuousLegend } from "./pv-continuous-legend";
import { legend } from "./pv-legend";
import { superimposedPercentiles } from "./pv-superimposed-percentiles";
import { stackedBarChart } from "./pv-stacked-bar-chart";
import { stackedAreaChart } from "./pv-stacked-area-chart";

export const pv = {};
pv.matrix = matrix;
pv.continuousLegend = continuousLegend;
pv.legend = legend;
pv.superimposedPercentiles = superimposedPercentiles;
pv.stackedBarChart = stackedBarChart;
pv.stackedAreaChart = stackedAreaChart;
