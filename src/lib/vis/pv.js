// Namespace for phong's vises.

import { matrix } from "./pv-matrix";
import { legend } from "./pv-legend";
import { continuousLegend } from "./pv-continuous-legend";
import { superimposedPercentiles } from "./pv-superimposed-percentiles";
import { stackedBarChart } from "./pv-stacked-bar-chart";
import { stackedAreaChart } from "./pv-stacked-area-chart";
import { mirroredStackedBarChart } from "./pv-mirrored-stacked-bar-chart";
import { mirroredStackedAreaChart } from "./pv-mirrored-stacked-area-chart";

export const pv = {};
pv.matrix = matrix;
pv.legend = legend;
pv.continuousLegend = continuousLegend;
pv.superimposedPercentiles = superimposedPercentiles;
pv.stackedBarChart = stackedBarChart;
pv.stackedAreaChart = stackedAreaChart;
pv.mirroredStackedBarChart = mirroredStackedBarChart;
pv.mirroredStackedAreaChart = mirroredStackedAreaChart;
