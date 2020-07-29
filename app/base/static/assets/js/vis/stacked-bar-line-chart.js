class StackedBarLineChart {
    CHART_WIDTH = 800
    CHART_HEIGHT = 400

    constructor(options) {
        const data = this.processData(options.data);
        const container = d3.select('#' + options.chartElement);
        container.innerHTML = '';

        const vis = pv.stackedBarLineChart()
            .margin({ top: 10, right: 10, bottom: 30, left: 50 })
            .colorScale(Common.Colors.DEATH_CAUSE_SCALE)
            .width(this.CHART_WIDTH)
            .height(this.CHART_HEIGHT);
        const legend = pv.legend()
            .margin({ top: 3, right: 3, bottom: 3, left: 50 })
            .colorScale(Common.Colors.DEATH_CAUSE_SCALE);

        const legendContainer = container.append('div');
        const svg = container.append('svg')
            .attr('width', this.CHART_WIDTH)
            .attr('height', this.CHART_HEIGHT);

        svg.datum(data).call(vis);
        legendContainer.datum(this.getLegends(data)).call(legend);
    }

    processData(data) {
        // The first column is for time
        const columns = data.columns = Object.keys(data[0]).slice(1);
        data.forEach(d => {
            columns.forEach(c => {
                d[c] = this.preprocessValue(d[c])
            });

            // Add others = all - covid
            d['others'] = d['all'] - d['covid']
        });

        // Exclude weeks with all 0
        data = data.filter(d => data.columns.some(att => d[att]));

        const parseWeek = d3.timeParse('%d-%b-%y');
        data.forEach(d => {
            d.time = parseWeek(d.Week);
            d.label = d3.timeFormat('%b %d')(d.time);
        });

        // Seperate between bars and lines
        data.barColumns = ['others', 'covid'];
        data.lineColumns = ['average'];
        return data;
    }

    preprocessValue(s) {
        return typeof(s) === 'number' ? s : parseInt(s.replace(',', '').trim());
    }

    getLegends(data) {
        const columns = data.barColumns.concat(data.lineColumns);
        return columns.map(c => {
            if (c === 'others') return { name: c, label: 'other causes' };
            if (c === 'average') return { name: c, label: 'average of corresponding week over the past 5 years' };
            return { name: c, label: c };
        });
    }
}