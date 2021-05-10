class Data {
    static Fields = {
        'COUNCIL_ALL_DEATHS': 'component=council_area/week-all_deaths',
        'COUNCIL_COVID_DEATHS': 'component=council_area/week-covid_related_deaths'
    }

    static from(data, field) {
        return data.find(d => d.endpoint.includes(field)).values;
    };
}