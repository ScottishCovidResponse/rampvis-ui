var nhsBoardField = '';
var latestUpdateTime = '';

class CountryOverview {
    CHART_WIDTH = 1000
    CHART_HEIGHT = 400

    constructor(options) {
        console.log('Input data', options.data);

        // Notes: please use these
        console.log('COUNTRY_NEW_CASES', Data.from(options.data, Data.Fields.COUNTRY_NEW_CASES));
        console.log('COUNTRY_HOSPITAL', Data.from(options.data, Data.Fields.COUNTRY_HOSPITAL));
        console.log('COUNTRY_ICU', Data.from(options.data, Data.Fields.COUNTRY_ICU));
        console.log('COUNTRY_VACCINE_TOTAL', Data.from(options.data, Data.Fields.COUNTRY_VACCINE_TOTAL));
        console.log('COUNTRY_VACCINE_SEX_AGEGROUP', Data.from(options.data, Data.Fields.COUNTRY_VACCINE_SEX_AGEGROUP));
        console.log('HEALTH_BOARD_TESTS_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_TESTS_NORMALIZED));
        console.log('HEALTH_BOARD_HOSPITAL_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_HOSPITAL_NORMALIZED));
        console.log('HEALTH_BOARD_ICU_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_ICU_NORMALIZED));
        console.log('HEALTH_BOARD_COVID_DEATHS_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_COVID_DEATHS_NORMALIZED));
        console.log('HEALTH_BOARD_ALL_DEATHS_NORMALIZED', Data.from(options.data, Data.Fields.HEALTH_BOARD_ALL_DEATHS_NORMALIZED));

        var div = d3.select('#' + options.chartElement)
            .append('div')
                .attr('class', 'vis-example-container')
    
        nhsBoardField = Object.keys(options.data[0].values[0])[1];
        latestUpdateTime = console.log(options.data[0].values[options.data[0].values.length-1].index);
        var data = options.data;
        var links = options.links;

        var config = {  
            layout: [
                [
                    'summary',
                    'vaccinations'
                ]
                ,'regions'
        ],
            groups: [
                {
                    name: 'summary',
                    title: 'Nation Summary',
                    layout: [['cases', 'deaths','patients']]
                }, 
                {
                    name: 'vaccinations',
                    title: 'Vaccinations',
                    layout: [['vaccinated1', 'vaccinated2',['vaccinated3', 'vaccinated4']]]
                }, 
                {
                    name: 'regions',
                    title: 'NHS Boards',
                    layout: [
                        [['regionsTestsNorm','covidInHospital','covidInICU'],
                        ['covidDeaths','allDeaths']]
                    ]
                }
            ], 
            panels:[
                {
                    name: 'cases', 
                    title: 'New Cases',
                    dataField: 'Testing - New cases reported',
                    type: 'stats',
                    color: COLOR_CASES,
                    data: Data.from(options.data, Data.Fields.COUNTRY_NEW_CASES),
                    mode: dashboard.MODE_DAILY,
                    link: links[0]
                },{
                    name: 'vaccinated1',
                    title: '1st Dose Vaccination',
                    dataField: 'NumberVaccinated',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).brighter(.6),
                    data: Data.from(options.data, Data.Fields.COUNTRY_VACCINE_TOTAL),
                    mode: dashboard.MODE_DAILY,
                    conditions: [
                        'Dose == "Dose 1"', 
                        'AgeBand == "18 years and over"', 
                        'Product == "Total"'
                    ]
                },{
                    name: 'vaccinated2',
                    title: '2nd Dose Vaccination',
                    dataField: 'NumberVaccinated',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON),
                    data: Data.from(options.data, Data.Fields.COUNTRY_VACCINE_TOTAL),
                    mode: dashboard.MODE_DAILY,
                    conditions: [
                        'Dose == "Dose 2"', 
                        'Product == "Total"'
                    ]
                },{
                    name: 'vaccinated3',
                    title: 'Vaccination (30-39 age group)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(.5),
                    data: Data.from(options.data, Data.Fields.COUNTRY_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: dashboard.DETAIL_COMPACT,
                    conditions: [
                        'Dose == "Dose 1"', 
                        'Sex == "Total"', 
                        'AgeGroup == "30 - 39"'
                    ]

                },{
                    name: 'vaccinated4',
                    title: 'Vaccination (40-49 age group)',
                    dataField: 'CumulativePercentCoverage',
                    type: 'stats',
                    color: d3.color(COLOR_VACCINATON).darker(1.4),
                    data: Data.from(options.data, Data.Fields.COUNTRY_VACCINE_SEX_AGEGROUP),
                    mode: dashboard.MODE_PERCENT,
                    detail: dashboard.DETAIL_COMPACT,
                    conditions: [
                        'Dose == "Dose 1"', 
                        'Sex == "Total"', 
                        'AgeGroup == "40 - 49"'
                    ]
                },{
                    name: 'deaths',
                    title: 'COVID-19 Patients in Hospital',
                    dataField: 'COVID-19 patients in hospital - Confirmed',
                    type: 'stats',
                    color: d3.color(COLOR_HOSPITAL).brighter(1.5),
                    data: Data.from(options.data, Data.Fields.COUNTRY_HOSPITAL),
                    mode: dashboard.MODE_CUMULATIVE
                },{
                    name: 'patients',
                    title: "Covid Patients in ICU",
                    dataField: "COVID-19 patients in ICU - Confirmed",
                    color: COLOR_HOSPITAL,
                    type: 'stats',
                    data: Data.from(options.data, Data.Fields.COUNTRY_ICU),
                    mode: dashboard.MODE_CURRENT
                },
                {
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_TESTS_NORMALIZED),
                    name: 'regionsTestsNorm',
                    title: 'Tests per 1000 people',
                    type: 'cartogram',
                    color: COLOR_TESTS, 
                    normalized: true
                },
                {
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_HOSPITAL_NORMALIZED),
                    name: 'covidInHospital',
                    title: 'Covid Patients in Hospital',
                    color: d3.color(COLOR_HOSPITAL).brighter(1.5),
                    type: 'cartogram',
                    normalized: true
                },
                {
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_ICU_NORMALIZED),
                    name: 'covidInICU',
                    title: 'Covid Patients in ICU',
                    type: 'cartogram',
                    color: COLOR_HOSPITAL,
                    normalized: true
                },
                {
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_COVID_DEATHS_NORMALIZED),
                    name: 'covidDeaths',
                    title: 'Weekly Covid Deaths',
                    type: 'cartogram',
                    color: COLOR_DEATHS,
                    normalized: true 
                },
                {
                    data: Data.from(options.data, Data.Fields.HEALTH_BOARD_ALL_DEATHS_NORMALIZED),
                    name: 'allDeaths',
                    title: 'Weekly All Deaths',
                    type: 'cartogram',
                    color: d3.color(COLOR_DEATHS).darker(1),
                    normalized: true
                }
            ]
        }

        dashboard.createDashboard(div, config)
    }
}