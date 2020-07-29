class MirroredStackedAreaChart {
    CHART_WIDTH = 800
    CHART_HEIGHT = 400

    constructor(options) {
        const data = this.processData(options.data);
        const container = d3.select('#' + options.chartElement);
        container.innerHTML = '';

        const vis = pv.mirroredStackedAreaChart()
            .margin({ top: 10, right: 10, bottom: 30, left: 50 })
            .colorScale(Common.Colors.AGE_GROUP_SCALE)
            .width(this.CHART_WIDTH)
            .height(this.CHART_HEIGHT);
        const legend = pv.legend()
            .margin({ top: 3, right: 3, bottom: 3, left: 50 })
            .colorScale(Common.Colors.AGE_GROUP_SCALE);

        const legendContainer = container.append('div');
        const svg = container.append('svg')
            .attr('width', this.CHART_WIDTH)
            .attr('height', this.CHART_HEIGHT);

        svg.datum(data).call(vis);
        legendContainer.datum(data.columns).call(legend);
    }

    processData(data) {
        // The first two columns are for time and gender
        const columns = data.columns = Object.keys(data[0]).slice(2);
        
        data.forEach(d => {
            columns.forEach(c => {
                d[c] = this.preprocessValue(d[c])
            });
        });
    
        // Exclude weeks with all 0
        data = data.filter(d => data.columns.some(att => d[att]));
    
        const parseWeek = d3.timeParse('%d-%b-%y');
        data.forEach(d => {
            d.time = parseWeek(d.Week);
            d.label = d3.timeFormat('%b %d')(d.time);
        });
    
        const newData = { 
            columns: columns, 
            top: data.filter(d => d.Gender.includes('Female')),
            bottom: data.filter(d => d.Gender.includes('Male')) 
        };
        
        return newData;
    }
    
    preprocessValue(s) {
        return typeof(s) === 'number' ? s : parseInt(s.replace(',', '').trim());
    }
}