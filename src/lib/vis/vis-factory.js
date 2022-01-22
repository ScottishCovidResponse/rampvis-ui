import { SimpleBarChart } from "./simple-bar-chart";
import { SimpleLineChart } from "./simple-line-chart";
import { ChordDiagram } from "./chord-diagram";
import { Matrix } from "./matrix";
import { SuperimposedPercentiles } from "./superimposed-percentiles";
import { StackedBarChartWith6Places } from "./stacked-bar-chart-6-places";
import { StackedAreaChart } from "./stacked-area-chart";
import { StackedBarChart } from "./stacked-bar-chart";
import { MirroredStackedAreaChart } from "./mirrored-stacked-area-chart";
import { MirroredStackedBarChart } from "./mirrored-stacked-bar-chart";
import { SensitivityStackedBarChart } from "./sensitivity-stacked-bar-chart";
import { DashboardRiskMonitoring } from "./dashboards/dashboard-riskMonitoring";
import { UncertaintySampleAndMean } from "./uncertainty-sample-and-mean";
import { UncertaintyClusterSampleAndMean } from "./uncertainty-cluster-sample-and-mean";
import { SensitivityParameterRangeChart } from  "./sensitivity-parameter-range-chart";
import { SensitivityParameterRangeSampleMean } from "./sensitivity-parameter-range-mean-sample";
import { SensitivityParameterRangeTickChart } from  "./sensitivity-parameter-range-tick-chart";
import { SensitivityParameterRangeTickSampleMean } from "./sensitivity-parameter-range-tick-mean-sample";
import { SensitivitySmallMultiple } from "./sensitivity-small-multiple";

// Dashboards
import { DashboardScotlandCouncil } from "./dashboards/dashboard-scotlandCouncil";
import { DashboardScotland } from "./dashboards/dashboard-scotland";
import { DashboardScotlandNHSBoard } from "./dashboards/dashboard-scotlandNHSBoard";
import { DashboardUK } from "./dashboards/dashboard-UK";
import { DashboardUpperTierLocalAuthority } from "./dashboards/dashboard-UTLA";
import { DashboardMSOA } from "./dashboards/dashboard-msoa";
import { DashboardEnglandRegion } from "./dashboards/dashboard-englandRegion";
import { DashboardEnglandNHSRegion } from "./dashboards/dashboard-englandNHSRegion";
import { DashboardNation } from "./dashboards/dashboard-nation"


export const visFactory = (type, args) => {
  if (type === "SimpleBarChart") return new SimpleBarChart(args);
  if (type === "SimpleLineChart") return new SimpleLineChart(args);
  if (type === "ChordDiagram") return new ChordDiagram(args);
  if (type === "Matrix") return new Matrix(args);
  if (type === "SuperimposedPercentiles")
    return new SuperimposedPercentiles(args);
  if (type === "StackedBarChartWith6Places")
    return new StackedBarChartWith6Places(args);
  if (type === "StackedAreaChart") return new StackedAreaChart(args);
  if (type === "StackedBarChart") return new StackedBarChart(args);
  if (type === "MirroredStackedAreaChart")
    return new MirroredStackedAreaChart(args);
  if (type === "MirroredStackedBarChart")
    return new MirroredStackedBarChart(args);
  if (type === "SensitivityStackedBarChart")
    return new SensitivityStackedBarChart(args);
  if (type == "UncertaintySampleAndMean")
    return new UncertaintySampleAndMean(args);
  if (type == "UncertaintyClusterSampleAndMean")
    return new UncertaintyClusterSampleAndMean(args);
  if (type == "SensitivityParameterRangeChart")
    return new SensitivityParameterRangeChart(args);
  if (type == "SensitivityParameterRangeSampleMean")
    return new SensitivityParameterRangeSampleMean(args);
  if (type == "SensitivityParameterRangeTickChart")
    return new SensitivityParameterRangeTickChart(args);
  if (type == "SensitivityParameterRangeTickSampleMean")
    return new SensitivityParameterRangeTickSampleMean(args);
  if (type == "SensitivitySmallMultiple")
    return new SensitivitySmallMultiple(args);
    
  // Dashboards
  if (type === "DashboardScotlandCouncil") return new DashboardScotlandCouncil(args);
  if (type === "DashboardScotlandNHSBoard") return new DashboardScotlandNHSBoard(args);
  if (type === "DashboardScotland") return new DashboardScotland(args);
  if (type === "DashboardUK") return new DashboardUK(args);
  if (type === "DashboardNation") return new DashboardNation(args);
  if (type === "CountryOverviewNew") return new DashboardEnglandNHSRegion(args);
  if (type === "DashboardUTLA") return new DashboardUpperTierLocalAuthority(args);
  if (type === "DashboardMSOA") return new DashboardMSOA(args);
  if (type === "DashboardEnglandNHSRegion") return new DashboardEnglandNHSRegion(args);
  if (type === "DashboardEnglandRegion") return new DashboardEnglandRegion(args);
  if (type === "DashboardRiskMonitoring") return new DashboardRiskMonitoring(args);

  return null;
};
