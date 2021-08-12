class CountryAgeGroupSex {
    CHART_WIDTH = 1000
    CHART_HEIGHT = 400
    URL = 'http://localhost:5000/6113da6097a136112fd842e0';

    constructor(options) {
        console.log('Input data', options.data);
        var div = d3.select('#' + options.chartElement)
            .append('div')
                .attr('class', 'vis-example-container')
                .style('width', this.CHART_WIDTH + 'px')
                .style('height', this.CHART_HEIGHT + 'px')
                .text('an awesome visualisation');

        console.log('>> Data.Fields', Data.Fields)
        console.log('>>options.data', options.data)
        
        var ageGroups = [
            '18 - 29',
            '30 - 39',
            '40 - 49',
            '50 - 54',
            '55 - 59',
            '60 - 64',
            '65 - 69',
            '70 - 74',
            '75 - 79',
            '80 years and over' 
        ]

        // create panels
        var panels = [];
        var vaccinationPanelIds = []
        for(var i=0 ; i < ageGroups.length ; i++)
        {
            // vaccination panel
            let name = 'dose2-1-'+ageGroups[i].replaceAll(/\s/g,'');
            panels.push(
            {
                name: name, 
                title: 'Age group ' + ageGroups[i],
                dataField: 'PercentCoverage',
                type: 'stats',
                color: '#555',
                data: Data.from(options.data, Data.Fields.COUNTRY_VACCINE_SEX_AGEGROUP),
                mode: dashboard.MODE_PERCENT,
                detail: dashboard.DETAIL_NARROW,
                conditions:[
                    'Sex == "Total"',
                    'Dose == "Dose 2"',
                    "AgeGroup == '" + ageGroups[i] + "'"
                ]
            })
            vaccinationPanelIds.push(name)
        }

        var config = {
            layout: [
                'vaccinated'
            ],
            groups: [
                {
                    name: 'vaccinated',
                    title: 'Fully Vaccinated', 
                    layout: [vaccinationPanelIds] 
                }
            ],
            panels: panels
        }
        dashboard.createDashboard(div, config)
    }
}

class Panel 
{
    constructor(object){
        for(var k in object){
            this[k] = object[k]
        }
    }
    set(attr, value){
        this[attr] = value;
        return this;
    }
    condition(condition)
    {
        if(!this.hasOwnProperty('conditions'))
        {
            this.conditions = [];
        }
        this['conditions'].push(condition)
        return this;
    }
}

function template(template){
    return new Panel(template);
}