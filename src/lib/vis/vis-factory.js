import { SimpleBarChart } from "./simple-bar-chart";
import { SimpleLineChart } from "./simple-line-chart";
import { HealthBoardOverview } from "./health-board-overview";
import { CouncilOverview } from './council-overview';
import { CountryOverview } from './country-overview';
import { ChordDiagram } from './chord-diagram';
import { Matrix } from './matrix';
import { SuperimposedPercentiles } from './superimposed-percentiles';
import { StackedBarChartWith6Places } from './stacked-bar-chart-6-places';
import { StackedAreaChart } from './stacked-area-chart';
import { StackedBarChart } from './stacked-bar-chart';

import {ParallelJunk} from './parallel-junk'
import {ScatterJunk} from './scatter-junk'
import {MatrixJunk} from './matrix-junk'
import {TableJunk} from './table-junk'
import {LineJunk} from './line-junk'

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
    if (type === "Matrix")
        return new Matrix(args);
    if (type === "SuperimposedPercentiles")
        return new SuperimposedPercentiles(args);
    if (type === "StackedBarChartWith6Places")
        return new StackedBarChartWith6Places(args);
    if (type === "StackedAreaChart")
        return new StackedAreaChart(args);
    if (type === "StackedBarChart")
        return new StackedBarChart(args);

    if (type == "ParallelJunk")
        return new ParallelJunk(args);
    if (type == "ScatterJunk")
        return new ScatterJunk(args);
    if (type == "MatrixJunk")
        return new MatrixJunk(args);
    if (type == "TableJunk")
        return new TableJunk(args);
    if (type == "LineJunk")
        return new LineJunk(args);
        
    return null;
}
