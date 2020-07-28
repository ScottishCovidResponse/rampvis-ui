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

        $('#data-date').text(latestData[0]['date']);

        const leftPanel = container.append('div')
        this.drawDate(container, latestData);
        this.drawTable(leftPanel, latestData, options.links);
    }

    drawDate(container, data) {
        d3.select(container.node().parentNode.parentNode)
            .select('.card-text')
            .text('Yesterday ' + data[0].date);
    }

    drawTable(container, data, links) {
        const table = container.append('table').attr('class', 'latest-numbers');

        // Header
        const header = table.append('tr');
        header.append('th').text('');
        header.append('th').text('+Test');
        header.append('th').text('H-sspt');
        header.append('th').text('H-cnfm');
        header.append('th').text('ICUs');

        // Body
        const arrayLinks = [
            links['cumulative_cases'], 
            links['hospital_suspected'],
            links['hospital_confirmed'],
            links['icu_patients']
        ];
        
        const boardNames = this.getBoardNames(data);
        boardNames.forEach((name, boardIdx) => {
            const row = table.append('tr');
            row.append('td').attr('class', 'clickable').text(this.DISPLAY_NAMES[name])
                .on('click', function() {
                    window.open('/' + links['dashboard'][boardIdx]);
                });

            data.forEach((d, colIdx) => {
                row.append('td').attr('class', 'number clickable')
                    .text(d[name])
                    .on('click', function() {
                        if (arrayLinks[colIdx][boardIdx]) {
                            window.open('/' + arrayLinks[colIdx][boardIdx]);
                        }
                    });
            });
        });
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
}