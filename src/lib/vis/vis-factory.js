import { SimpleBarChart } from "./simple-bar-chart";
import { SimpleLineChart } from "./simple-line-chart";
import { HealthBoardOverview } from "./health-board-overview";
import { CouncilOverview } from './council-overview';
import { CountryOverview } from './country-overview';
import { ChordDiagram } from './chord-diagram';
import { NewMatrix } from './new-matrix';
import { SuperimposedPercentiles } from './superimposed-percentiles';
import { StackedBarChartWith6Places } from './stacked-bar-chart-6-places';


export const visFactory = (type, args) => {
    if (type === "SimpleBarChart")
        return new SimpleBarChart(args);
    if (type === "SimpleLineChart")
        return new SimpleLineChart(args);
    if (type === "HealthBoardOverview")
        return new HealthBoardOverview(args);
    if (type === "CouncilOverview")
        return new CouncilOverview(args);
    if (type === "CountryOverview")
        return new CountryOverview(args);
    if (type === "ChordDiagram")
        return new ChordDiagram(args);
    if (type === "NewMatrix")
        return new NewMatrix(args);
    if (type === "SuperimposedPercentiles")
        return new SuperimposedPercentiles(args);
    if (type === "StackedBarChartWith6Places")
        return new StackedBarChartWith6Places(args);

        
    return null;
}
