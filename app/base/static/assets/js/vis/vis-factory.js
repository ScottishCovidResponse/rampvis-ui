class VisFunctionFactory {
    constructor(type, args) {
        console.log('VisFunctionFactory: constructor: type = ', type, ', args = ', args);

        if (type === "TopLevelOverviewScreenA")
            return TopLevelOverviewScreenA.prototype.init(args);
        if (type === "BarChartA")
            return new BarChartA(args);
        if (type === "LineChartA")
            return new LineChartA(args);
    }
}

