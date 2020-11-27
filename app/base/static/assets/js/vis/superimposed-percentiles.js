class SuperimposedPercentiles {
    CHART_WIDTH = 850
    CHART_HEIGHT = 450

    constructor(options) {
        const container = d3.select('#' + options.chartElement);
        container.innerHTML = '';
        const data = options.data;
        const legendData = data.ys.map(d => d.label);
        const colors = d3.schemeDark2;
        
        // Legend
        const legendContainer = container.append('div');
        const legend =  pv.legend()
            .margin({ top: 3, right: 0, bottom: 3, left: 0 })
            .colorScale(d3.scaleOrdinal()
                .domain(legendData)
                .range(colors));
        legendContainer.datum(legendData).call(legend);

        // Main vis
        const svg = container.append('svg')
            .attr('width', this.CHART_WIDTH)
            .attr('height', this.CHART_HEIGHT);
        const vis = pv.superimposedPercentiles()
            .medColors(colors)
            .width(this.CHART_WIDTH)
            .height(this.CHART_HEIGHT);
        svg.datum(data).call(vis);
    }
}