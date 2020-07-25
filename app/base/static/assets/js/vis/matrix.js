class Matrix {
    CHART_WIDTH = 500
    CHART_HEIGHT = 500

    constructor(options) {
        const data = this.processData(options.data);
        const container = d3.select('#' + options.chartElement);
        container.innerHTML = '';

        const vis = pv.matrix()
            .margin({ top: 10, right: 10, bottom: 100, left: 100 })
            .colorScale(Common.Colors.CORRELATION_SCALE)
            .width(this.CHART_WIDTH)
            .height(this.CHART_HEIGHT);
        const legend = pv.continuousLegend()
            .colorScale(Common.Colors.CORRELATION_SCALE)
            .width(this.CHART_WIDTH)
            .height(40);

        const legendContainer = container.append('svg')
            .attr('width', this.CHART_WIDTH)
            .attr('height', 40)
            .style('display', 'block');
        const svg = container.append('svg')
            .attr('width', this.CHART_WIDTH)
            .attr('height', this.CHART_HEIGHT);

        svg.datum(data).call(vis);
        legendContainer.datum([]).call(legend);
    }

    processData(data) {
        const names = data.map(d => d.name).sort();

        const orderings = [
            {
                'name': 'A-Z',
                'description': 'alphabetically from A to Z',
                'orders': names
            },
            {
                'name': 'Z-A',
                'description': 'reversed alphabetically from Z to A',
                'orders': names.slice().reverse()
            }
        ]

        const cells = [];
        data.forEach(row => {
            for (const k in row) {
                if (k !== 'name') {
                    cells.push({
                        'row': row.name,
                        'column': k,
                        'value': row[k]
                    });
                }
            }
        });
        
        return {
            rows: names,
            columns: names,
            orderings: orderings,
            cells: cells
        };
    }
}