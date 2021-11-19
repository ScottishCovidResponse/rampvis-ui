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
import { RiskMonitoring } from "./risk-monitoring";

// Dashboards
import { CouncilOverview } from "./dashboards/council-overview";
import { CountryOverview } from "./dashboards/country-overview";
import { HealthBoardOverview } from "./dashboards/health-board-overview";
import { CountryOverviewNew } from "./dashboards/country-overview-new";
import { VaccineOverview } from "./dashboards/vaccineOverview";
import { DashboardUK } from "./dashboards/dashboard-UK";
import { DashboardTian } from "./dashboards/dashboard-tian";

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
  if (type === "RiskMonitoring") return new RiskMonitoring(args);

  // Dashboards
  if (type === "CouncilOverview") return new CouncilOverview(args);
  if (type === "HealthBoardOverview") return new HealthBoardOverview(args);
  if (type === "CountryOverview") return new CountryOverview(args);
  // if (type === "CountryOverviewNew") return new CountryOverviewNew(args);
  if (type === "CountryOverviewNew") return new DashboardTian(args);
  // if (type === "VaccineOverview") return new VaccineOverview(args);
  if (type === "VaccineOverview") return new DashboardUK(args);

  return null;
};
