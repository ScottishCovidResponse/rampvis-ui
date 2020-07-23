class VisFunctionFactory {
    constructor(type, args) {
        console.log('VisFunctionFactory: constructor: type = ', type, ', args = ', args);

        if (type === "TopLevelOverviewScreenA")
            return TopLevelOverviewScreenA.prototype.init(args);
        if (type === "TopLevelOverviewScreenC")
            return new TopLevelOverviewScreenC(args);
        if (type === "BarChartA")
            return new BarChartA(args);
        if (type === "LineChartA")
            return new LineChartA(args);
        if (type === "ChordDiagramA")
            return new ChordDiagramA().init(args);
        if (type === "StackedBarChart") 
            return new StackedBarChart(args);
        if (type === "StackedAreaChart") 
            return new StackedAreaChart(args);
        if (type === "MirroredStackedBarChart") 
            return new MirroredStackedBarChart(args);
        if (type === "MirroredStackedAreaChart") 
            return new MirroredStackedAreaChart(args);
        if (type === "StackedBarLineChart") 
            return new StackedBarLineChart(args);
    }
}