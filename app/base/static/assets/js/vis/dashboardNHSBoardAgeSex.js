class HealthBoardAgeGroupSex {
    CHART_WIDTH = 1000
    CHART_HEIGHT = 1200
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
    
        
        var config = 
        {
            layout: [
                [
                    'vaccine-total',
                    'vaccine-by-age'
                ], 
                'vaccine-gender'               
            ],
            groups: [
                {
                    id: 'vaccine-total',
                    title: 'Overview',
                    layout: [
                        [
                            'vaccinations-total-dose1',
                            'vaccinations-total-dose2']
                        ]
    
                },
                {
                    id: 'vaccine-gender',
                    title: 'Vaccine by Gender', 
                    layout: [
                        [
                            'vaccinations-total-femaledose1',
                            'vaccination-allfemale-dose1',
                            'vaccinations-total-femaledose2',
                            'vaccination-allfemale-dose2',
                        ],
                        [   
                            'vaccinations-total-maledose1',
                            'vaccination-allmale-dose1',
                            'vaccinations-total-maledose2',
                            'vaccination-allmale-dose2',
                        ],
                    ]      
                }, 
                {
                    id: 'vaccine-by-age',
                    title: 'Vaccinations by Age Group', 
                    layout: [
                        'vaccination-agegroups-dose1',
                        'vaccination-agegroups-dose2'] 
                }
            ],
            widgets: [
                {   
                    id: 'vaccinations-total-dose1', 
                    title: 'First Dose, total population', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'linechart',
                    color: this.COLOR_TOTAL,
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'high',
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "18 years and over"' 
                    ]
                },
                {   
                    id: 'vaccinations-total-dose2', 
                    title: 'Second Dose, total population', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'linechart',
                    color: this.COLOR_TOTAL,
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'high',
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "18 years and over"' 
                    ]
                },
                {   
                    id: 'vaccinations-total-femaledose1', 
                    title: '1st Dose, Female Population', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'linechart',
                    color: this.COLOR_FEMALE,
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'low',
                    conditions:[
                        'Sex == "Female"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "18 years and over"' 
                    ]
                },
                {   
                    id: 'vaccinations-total-femaledose2', 
                    title: '2nd Dose, Female Population', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'linechart',
                    color: this.COLOR_FEMALE,
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'low',
                    conditions:[
                        'Sex == "Female"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "18 years and over"' 
                    ]
                },
                {   
                    id: 'vaccinations-total-maledose1', 
                    title: '1st Dose, Male Population', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'linechart',
                    color: this.COLOR_MALE,
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'low',
                    conditions:[
                        'Sex == "Male"',
                        'Dose == "Dose 1"',
                        'AgeGroup == "18 years and over"' 
                    ]
                },
                {   
                    id: 'vaccinations-total-maledose2', 
                    title: '2nd Dose, Male Population', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'linechart',
                    color: this.COLOR_MALE,
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'low',
                    conditions:[
                        'Sex == "Male"',
                        'Dose == "Dose 2"',
                        'AgeGroup == "18 years and over"' 
                    ]
                },{
                    id: 'vaccination-agegroups-dose1',
                    title: 'Dose 1', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'barchart',
                    color: this.COLOR_TOTAL,
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'deteiled',
                    bars: 'AgeGroup', 
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 1"',
                        'AgeGroup.indexOf("and over") < 0'
                    ]
                },{
                    id: 'vaccination-agegroups-dose2',
                    title: 'Dose 2', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'barchart',
                    color: this.COLOR_TOTAL,
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'deteiled',
                    bars: 'AgeGroup', 
                    conditions:[
                        'Sex == "Total"',
                        'Dose == "Dose 2"',
                        'AgeGroup.indexOf("and over") < 0'
                    ]
                },{
                    id: 'vaccination-allfemale-dose1',
                    title: 'Females Dose 1', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'barchart',
                    color: this.COLOR_FEMALE,
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'medium',
                    bars: 'AgeGroup', 
                    conditions:[
                        'Sex == "Female"',
                        'Dose == "Dose 1"',
                        'AgeGroup.indexOf("and over") < 0'
                    ]
                },{
                    id: 'vaccination-allmale-dose1',
                    title: 'Males Dose 1', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'barchart',
                    color: this.COLOR_MALE,
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'medium',
                    bars: 'AgeGroup', 
                    conditions:[
                        'Sex == "Male"',
                        'Dose == "Dose 1"',
                        'AgeGroup.indexOf("and over") < 0'
                    ]
                },
                {
                    id: 'vaccination-allfemale-dose2',
                    title: 'Females Dose 2', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'barchart',
                    color: this.COLOR_FEMALE,
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'medium',
                    bars: 'AgeGroup', 
                    conditions:[
                        'Sex == "Female"',
                        'Dose == "Dose 2"',
                        'AgeGroup.indexOf("and over") < 0'
                    ]
                },
                {
                    id: 'vaccination-allmale-dose2',
                    title: 'Males Dose 2', 
                    dataField: 'CumulativePercentCoverage',
                    visualization: 'barchart',
                    color: this.COLOR_MALE,
                    data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: 'medium',
                    bars: 'AgeGroup', 
                    conditions:[
                        'Sex == "Male"',
                        'Dose == "Dose 2"',
                        'AgeGroup.indexOf("and over") < 0'
                    ]
                },
            ]
        }
        dashboard.createDashboard(div, config)
    }
}
// var dose1PanelIDs = []
// var dose2PanelIDs = []
// for(var i=0 ; i < ageGroups.length ; i++)
// {
//     // vaccination for 1st dose
//     let name = 'dose1-1-'+ageGroups[i].replaceAll(/\s/g,'');
//     panels.push(
//     {
//         id: name, 
//         title: 'Age group ' + ageGroups[i],
//         dataField: 'CumulativePercentCoverage',
//         visualization: 'linechart',
//         color: '#555',
//         data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
//         mode: dashboard.MODE_PERCENT,
//         detail: dashboard.DETAIL_NARROW,
//         conditions:[
//             'Sex == "Total"',
//             'Dose == "Dose 1"',
//             "AgeGroup == '" + ageGroups[i] + "'"
//         ]
//     })
//     dose1PanelIDs.push(name)

//     // vaccination for 2nd dose
//     name = 'dose2-1-'+ageGroups[i].replaceAll(/\s/g,'');
//     panels.push(
//     {
//         id: name, 
//         title: 'Age group ' + ageGroups[i],
//         dataField: 'CumulativePercentCoverage',
//         visualization: 'linechart',
//         color: '#555',
//         data: Data.from(options.data, Data.Fields.COUNCIL_VACCINE_SEX_AGEGROUP),
//         mode: dashboard.MODE_PERCENT,
//         detail: dashboard.DETAIL_NARROW,
//         conditions:[
//             'Sex == "Total"',
//             'Dose == "Dose 2"',
//             "AgeGroup == '" + ageGroups[i] + "'"
//         ]
//     })
//     dose2PanelIDs.push(name)
// }

