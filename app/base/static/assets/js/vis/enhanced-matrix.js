class EnhancedMatrix {
    CHART_WIDTH = 550
    CHART_HEIGHT = 450

    constructor(options) {
        const data = this.processData(options.data);
        const container = d3.select('#' + options.chartElement);
        container.innerHTML = '';

        const vis = pv.enhancedMatrix()
            .margin({ top: 100, right: 100, bottom: 0, left: 100 })
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

    processMetricData(data) {
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
            columns: [...names], // Need to make an copy due to direct manipulation later
            orderings: orderings,
            cells: cells
        };
    }

    processRawData(data, matrixData) {
        // The first column is for time
        const columns = data.columns = Object.keys(data[0]).slice(1);
        data.forEach(d => {
            columns.forEach(c => {
                d[c] = this.preprocessValue(d[c])
            });
        });

        // Exclude weeks with all 0
        data = data.filter(d => data.columns.some(att => d[att]));

        // Update matrix data with this data
        for (let i = 0; i < matrixData.rows.length; i++) {
            matrixData.rows[i] = {
                name: matrixData.rows[i],
                values: data.map(d => d[matrixData.rows[i]])
            }
        }
        for (let i = 0; i < matrixData.columns.length; i++) {
            matrixData.columns[i] = {
                name: matrixData.columns[i],
                values: data.map(d => d[matrixData.columns[i]])
            }
        }
    }

    processData(data) {
        const [metricData, rawData] = data
        const matrixData = this.processMetricData(metricData);
        this.processRawData(rawData, matrixData);
        return matrixData;
    }
    
    preprocessValue(s) {
        return typeof(s) === 'number' ? s : parseInt(s.replace(',', '').trim());
    }
}