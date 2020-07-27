class DefaultDashboard {
    CHART_WIDTH = 550
    CHART_HEIGHT = 450

    DISPLAY_NAMES = {
        scotland: 'Scotland',
        nhs_ayrshire_arran: 'A & A',
        nhs_borders: 'Borders',
        nhs_dumfries_galloway: 'D & G',
        nhs_fife: 'Fife', 
        nhs_forth_valley: 'Forth V',
        nhs_grampian: 'Grampian',
        nhs_greater_glasgow_clyde: 'G.G & C',				
        nhs_highland: 'Highland',
        nhs_lanarkshire: 'Lanark.',
        nhs_lothian: 'Lothian',
        nhs_orkney: 'Orkney',
        nhs_shetland: 'Shetland',
        nhs_tayside: 'Tayside',
        nhs_western_isles_scotland: 'Western',
        golden_jubilee_nationalhospital: 'GJNN'	
    }

    constructor(options) {
        const latestData = options.data.map(columnData => columnData[columnData.length - 1]);
        const container = d3.select('#' + options.chartElement);
        container.node().innerHTML = '';

        const leftPanel = container.append('div')
        this.drawDate(container, latestData);
        this.drawTable(leftPanel, latestData);
    }

    drawDate(container, data) {
        d3.select(container.node().parentNode.parentNode)
            .select('.card-text')
            .text('Yesterday ' + data[0].date);
    }

    drawTable(container, data) {
        const table = container.append('table').attr('class', 'latest-numbers');

        // Header
        const header = table.append('tr');
        header.append('th').text('');
        header.append('th').text('+Test');
        header.append('th').text('H-sspt');
        header.append('th').text('H-cnfm');
        header.append('th').text('ICUs');

        // Body
        const boardNames = this.getBoardNames(data);
        boardNames.forEach(name => {
            const row = table.append('tr');

            row.append('td').append('a').attr('href', '').text(this.DISPLAY_NAMES[name]);
            data.forEach(d => {
                row.append('td').attr('class', 'number').text(d[name]);
            });
        });

        // container.append('div').text('1a');
        // container.append('div').text('1b');
        // container.append('div').text('1c');
        // container.append('div').text('1d');
        // container.append('div').text('1e');
        // container.append('div').text('1f');
    }

    getBoardNames(data) {
        const nameSet = new Set(data.map(Object.keys).flat());
        nameSet.delete('date');

        // Special order for Scotland and Golden Jubilee
        const hasScotland = nameSet.has('scotland');
        const hasGolden = nameSet.has('golden_jubilee_nationalhospital');
        nameSet.delete('scotland');
        nameSet.delete('golden_jubilee_nationalhospital');
        const names = [...nameSet].sort();
        if (hasScotland) { // Scotland at top
            names.splice(0, 0, 'scotland');
        }
        if (hasGolden) { // Golden Jubilee at bottom
            names.push('golden_jubilee_nationalhospital');
        }

        return names;
    }

    processData(data) {
        const [positives, suspects, confirms, patients] = data;
        // for 

        console.log(positives);
        console.log(suspects);
        console.log(confirms);
        console.log(patients);

        
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
    
    preprocessValue(s) {
        return typeof(s) === 'number' ? s : parseInt(s.replace(',', '').trim());
    }
}