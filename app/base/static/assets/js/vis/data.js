class Data {
    static Fields = {
        'COUNTRY_NEW_CASES': 'component=date-country-new_cases_reported',
        'COUNTRY_HOSPITAL': 'component=date-country-covid19_patients_in_hospital-confirmed',
        'COUNTRY_ICU': 'component=date-country-covid19_patients_in_icu-confirmed',
        'COUNTRY_VACCINE_TOTAL': 'vaccination&component=daily_total',
        'COUNTRY_VACCINE_SEX_AGEGROUP': 'vaccination&component=daily_sex_agegroup',
        
        'COUNCIL_ALL_DEATHS': 'component=council_area/week-all_deaths',
        'COUNCIL_COVID_DEATHS': 'component=council_area/week-covid_related_deaths',
        'COUNCIL_VACCINE_SEX_AGEGROUP': 'vaccination&component=daily_local_authority',
        
        'HEALTH_BOARD_TESTS': 'component=nhsboard/date-total_daily_tests_reported',
        'HEALTH_BOARD_TESTS_NORMALIZED': 'component=nhsboard/date-total_daily_tests_reported_normalized',
        'HEALTH_BOARD_HOSPITAL': 'component=nhs_health_board/date-covid19_patients_in_hospital-confirmed',
        'HEALTH_BOARD_HOSPITAL_NORMALIZED': 'component=nhs_health_board/date-covid19_patients_in_hospital-confirmed_normalized',
        'HEALTH_BOARD_ICU': 'component=nhs_health_board/date-covid19_patients_in_icu-confirmed',
        'HEALTH_BOARD_ICU_NORMALIZED': 'component=nhs_health_board/date-covid19_patients_in_icu-confirmed_normalized',
        'HEALTH_BOARD_COVID_DEATHS': 'component=nhs_health_board/week-covid_related_deaths',
        'HEALTH_BOARD_COVID_DEATHS_NORMALIZED': 'component=nhs_health_board/week-covid_related_deaths_normalized',
        'HEALTH_BOARD_ALL_DEATHS': 'component=nhs_health_board/week-all_deaths',
        'HEALTH_BOARD_ALL_DEATHS_NORMALIZED': 'component=nhs_health_board/week-all_deaths_normalized',
        'HEALTH_BOARD_VACCINE_SEX_AGEGROUP': 'vaccination&component=daily_health_board',
    }

    static from(data, field) {
        return data.find(d => d.endpoint.includes(field)).values;
    };
}