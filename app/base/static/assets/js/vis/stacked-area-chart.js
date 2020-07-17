class StackedAreaChart {
    CHART_WIDTH = 800
    CHART_HEIGHT = 400

    constructor(options) {
        const data = processData(options.data);
        const container = d3.select('#' + options.chartElement);
        container.innerHTML = '';

        const vis = pv.stackedAreaChart()
            .margin({ top: 10, right: 10, bottom: 30, left: 50 })
            .colorScale(Common.Colors.SITUATION_SCALE)
            .width(this.CHART_WIDTH)
            .height(this.CHART_HEIGHT);
        const legend = pv.legend()
            .margin({ top: 3, right: 3, bottom: 3, left: 50 })
            .colorScale(Common.Colors.SITUATION_SCALE);

        const legendContainer = container.append('div');
        const svg = container.append('svg')
            .attr('width', this.CHART_WIDTH)
            .attr('height', this.CHART_HEIGHT);

        svg.datum(data).call(vis);
        legendContainer.datum(data.columns).call(legend);
    }
}

function processData(data) {
    // The first column is for time
    const columns = data.columns = Object.keys(data[0]).slice(1);
    data.forEach(d => {
        columns.forEach(c => {
            d[c] = preprocessValue(d[c])
        });
    });

    // Exclude weeks with all 0
    data = data.filter(d => data.columns.some(att => d[att]));

    const parseWeek = d3.timeParse('%d-%b-%y');
    data.forEach(d => {
        d.time = parseWeek(d.Week);
        d.label = d3.timeFormat('%b %d')(d.time);
    });

    data.columns = columns;
    return data;
}

function preprocessValue(s) {
    return typeof(s) === 'number' ? s : parseInt(s.replace(',', '').trim());
}