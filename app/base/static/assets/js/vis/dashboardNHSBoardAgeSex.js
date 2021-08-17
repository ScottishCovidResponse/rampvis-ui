class HealthBoardAgeGroupSex {
    CHART_WIDTH = 1000
    CHART_HEIGHT = 1000
    url = 'http://localhost:5000/6113d12e40a5e21147c43ab0';

    COLOR_TOTAL = '#555';
    COLOR_MALE = '#2d9fe0';
    COLOR_FEMALE = '#eb8913';

    constructor(options) {
        console.log('Input data', options.data);
        var div = d3.select('#' + options.chartElement)
            .append('div')
                .attr('class', 'vis-example-container')
                .style('width', this.CHART_WIDTH + 'px')
                .style('height', this.CHART_HEIGHT + 'px')

        console.log('>> Data.Fields', Data.Fields)
        console.log('>>options.data[0]', options.data)
        
        var ageGroups = [
            '18 - 29',
            '30 - 39',
            '40 - 49',
            '50 - 54',
            // '55 - 59',
            // '60 - 64',
            // '65 - 69',
            // '70 - 74',
            // '75 - 79',
            // '80 years and over' 
        ]

        // create panels
        var panels = [
            {   
                name: 'vaccinations-total-dose1', 
                title: 'First Dose, total population', 
                dataField: 'PercentCoverage',
                type: 'stats',
                color: this.COLOR_TOTAL,
                data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                mode: dashboard.MODE_PERCENT,
                detail: 'detailed',
                conditions:[
                    'Sex == "Total"',
                    'Dose == "Dose 1"',
                    'AgeGroup == "18 years and over"' 
                ]
            },
            {   
                name: 'vaccinations-total-dose2', 
                title: 'Second Dose, total population', 
                dataField: 'PercentCoverage',
                type: 'stats',
                color: this.COLOR_TOTAL,
                data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                mode: dashboard.MODE_PERCENT,
                detail: 'detailed',
                conditions:[
                    'Sex == "Total"',
                    'Dose == "Dose 2"',
                    'AgeGroup == "18 years and over"' 
                ]
            },
            {   
                name: 'vaccinations-total-femaledose1', 
                title: '1st Dose, Female Population', 
                dataField: 'PercentCoverage',
                type: 'stats',
                color: this.COLOR_FEMALE,
                data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                mode: dashboard.MODE_PERCENT,
                detail: 'narrow',
                conditions:[
                    'Sex == "Female"',
                    'Dose == "Dose 1"',
                    'AgeGroup == "18 years and over"' 
                ]
            },
            {   
                name: 'vaccinations-total-femaledose2', 
                title: '2nd Dose, Female Population', 
                dataField: 'PercentCoverage',
                type: 'stats',
                color: this.COLOR_FEMALE,
                data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                mode: dashboard.MODE_PERCENT,
                detail: 'narrow',
                conditions:[
                    'Sex == "Female"',
                    'Dose == "Dose 2"',
                    'AgeGroup == "18 years and over"' 
                ]
            },
            {   
                name: 'vaccinations-total-maledose1', 
                title: '1st Dose, Male Population', 
                dataField: 'PercentCoverage',
                type: 'stats',
                color: this.COLOR_MALE,
                data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                mode: dashboard.MODE_PERCENT,
                detail: 'narrow',
                conditions:[
                    'Sex == "Male"',
                    'Dose == "Dose 1"',
                    'AgeGroup == "18 years and over"' 
                ]
            },
            {   
                name: 'vaccinations-total-maledose2', 
                title: '2nd Dose, Male Population', 
                dataField: 'PercentCoverage',
                type: 'stats',
                color: this.COLOR_MALE,
                data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                mode: dashboard.MODE_PERCENT,
                detail: 'narrow',
                conditions:[
                    'Sex == "Male"',
                    'Dose == "Dose 2"',
                    'AgeGroup == "18 years and over"' 
                ]
            },
        ];
        var dose1PanelIDs = []
        var dose2PanelIDs = []
        for(var i=0 ; i < ageGroups.length ; i++)
        {
            // vaccination for 1st dose
            let name = 'dose1-1-'+ageGroups[i].replaceAll(/\s/g,'');
            panels.push(
            {
                name: name, 
                title: 'Age group ' + ageGroups[i],
                dataField: 'PercentCoverage',
                type: 'stats',
                color: '#555',
                data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                mode: dashboard.MODE_PERCENT,
                detail: dashboard.DETAIL_NARROW,
                conditions:[
                    'Sex == "Total"',
                    'Dose == "Dose 1"',
                    "AgeGroup == '" + ageGroups[i] + "'"
                ]
            })
            dose1PanelIDs.push(name)

            // vaccination for 2nd dose
            name = 'dose2-1-'+ageGroups[i].replaceAll(/\s/g,'');
            panels.push(
            {
                name: name, 
                title: 'Age group ' + ageGroups[i],
                dataField: 'PercentCoverage',
                type: 'stats',
                color: '#555',
                data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                mode: dashboard.MODE_PERCENT,
                detail: dashboard.DETAIL_NARROW,
                conditions:[
                    'Sex == "Total"',
                    'Dose == "Dose 2"',
                    "AgeGroup == '" + ageGroups[i] + "'"
                ]
            })
            dose2PanelIDs.push(name)
        }

        var config = {
            layout: [
                ['vaccine-total','vaccine-gender'],'vaccine-by-age' 
            ],
            groups: [
                {
                    name: 'vaccine-total',
                    title: 'Overview',
                    layout: [['vaccinations-total-dose1','vaccinations-total-dose2']]

                },
                {
                    name: 'vaccine-gender',
                    title: 'Vaccine by Gender', 
                    layout: [
                        ['vaccinations-total-femaledose1','vaccinations-total-femaledose1'],
                        ['vaccinations-total-maledose1','vaccinations-total-maledose1']
                    ]      
                }, 
                {
                    name: 'vaccine-by-age',
                    title: 'Vaccinations by Age Group', 
                    layout: [dose1PanelIDs,dose2PanelIDs] 
                }
            ],
            panels: panels
        }
        dashboard.createDashboard(div, config)
    }
}