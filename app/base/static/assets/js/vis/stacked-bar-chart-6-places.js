class StackedBarChartWith6Places {
    CHART_WIDTH = 1000
    CHART_HEIGHT = 400

    constructor(options) {
        const data = this.processData(options.data);
        const container = d3.select('#' + options.chartElement);
        container.innerHTML = '';

        const vis = pv.stackedBarChart()
            .margin({ top: 10, right: 10, bottom: 40, left: 50 })
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

    processData(data) {
        data = data.map(d => d.values);

        // Correct field names: Adur___Hospice -> Hospice
        data.forEach(list => {
            list.forEach(d => {
                const oldKeys = [];
                for (let key in d) {
                    if (key.includes('___')) {
                        d[key.split('___')[1]] = d[key];
                        oldKeys.push(key);
                    }
                }
                oldKeys.forEach(k => {
                    delete d[k];
                });
            });
        });

        // Will merge data[1:] to this new data
        const newData = data[0];

        // For each record and each other fields, merge into the first one
        for (let i = 1; i < data.length; i++) {
            for (let j = 0; j < newData.length; j++) {
                Object.assign(newData[j], data[i][j]);
            }
        }

        newData.columns = Object.keys(newData[0]);
        newData.columns.splice(newData.columns.indexOf('index'), 1);

        const parseWeek = d3.timeParse('%Y-%m-%d');
        newData.forEach(d => {
            d.time = parseWeek(d.index);
            d.label = d3.timeFormat('%d %b')(d.time);
        });
        
        return newData;
    }

    preprocessValue(s) {
        return typeof(s) === 'number' ? s : parseInt(s.replace(',', '').trim());
    }
}