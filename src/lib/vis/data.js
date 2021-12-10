/* eslint-disable @typescript-eslint/no-unused-vars */

export class Data {
  static Fields = {
    COUNTRY_NEW_CASES: "component=date-country-new_cases_reported",
    COUNTRY_HOSPITAL:
      "component=date-country-covid19_patients_in_hospital-confirmed",
    COUNTRY_ICU: "component=date-country-covid19_patients_in_icu-confirmed",
    COUNTRY_VACCINE_TOTAL: "vaccination&component=daily_total",
    COUNTRY_VACCINE_SEX_AGEGROUP: "vaccination&component=daily_sex_agegroup",

    COUNCIL_ALL_DEATHS: "component=council_area/week-all_deaths",
    COUNCIL_COVID_DEATHS: "component=council_area/week-covid_related_deaths",
    COUNCIL_VACCINE_SEX_AGEGROUP: "vaccination&component=daily_local_authority",
    COUNCIL_VACCINE_SEX_AGEGROUP_ALL:
      "vaccination&component=daily_local_authorities",

    HEALTH_BOARD_TESTS: "component=nhsboard/date-total_daily_tests_reported",
    HEALTH_BOARD_TESTS_NORMALIZED:
      "component=nhsboard/date-total_daily_tests_reported_normalized",
    HEALTH_BOARD_HOSPITAL:
      "component=nhs_health_board/date-covid19_patients_in_hospital-confirmed",
    HEALTH_BOARD_HOSPITAL_NORMALIZED:
      "component=nhs_health_board/date-covid19_patients_in_hospital-confirmed_normalized",
    HEALTH_BOARD_ICU:
      "component=nhs_health_board/date-covid19_patients_in_icu-confirmed",
    HEALTH_BOARD_ICU_NORMALIZED:
      "component=nhs_health_board/date-covid19_patients_in_icu-confirmed_normalized",
    HEALTH_BOARD_COVID_DEATHS:
      "component=nhs_health_board/week-covid_related_deaths",
    HEALTH_BOARD_COVID_DEATHS_NORMALIZED:
      "component=nhs_health_board/week-covid_related_deaths_normalized",
    HEALTH_BOARD_ALL_DEATHS: "component=nhs_health_board/week-all_deaths",
    HEALTH_BOARD_ALL_DEATHS_NORMALIZED:
      "component=nhs_health_board/week-all_deaths_normalized",
    HEALTH_BOARD_VACCINE_SEX_AGEGROUP:
      "vaccination&component=daily_health_board",
    HEALTH_BOARD_VACCINE_SEX_AGEGROUP_ALL:
      "vaccination&component=daily_health_boards",

    PHE_UK_CUM_ADMISSIONS: "product=phe&component=cumAdmissions&",
    PHE_UK_CUM_CASES: "product=phe&component=cumCasesBySpecimenDate&",
    PHE_UK_CUM_DEATHS_28_DAYS: "product=phe&component=cumDeaths28DaysByDeathDate&",
    PHE_UK_CUM_VACC_FIRST: "product=phe&component=cumPeopleVaccinatedFirstDoseByPublishDate&",
    PHE_UK_CUM_VACC_SECOND: "product=phe&component=cumPeopleVaccinatedSecondDoseByPublishDate&",
    PHE_UK_CUM_VACC_THIRD: "product=phe&component=cumPeopleVaccinatedThirdInjectionByPublishDate&",
    PHE_UK_NEW_AMISSIONS: "product=phe&component=newAdmissions&",
    PHE_UK_NEW_CASES: "product=phe&component=newCasesBySpecimenDate&",
    PHE_UK_NEW_DEATHS_28_DAYS: "product=phe&component=newDeaths28DaysByDeathDate&",
    PHE_UK_NEW_VACC_FIRST: "product=phe&component=newPeopleVaccinatedFirstDoseByPublishDate&",
    PHE_UK_NEW_VACC_SECOND: "product=phe&component=newPeopleVaccinatedSecondDoseByPublishDate&",
    PHE_UK_NEW_VACC_THIRD: "product=phe&component=newPeopleVaccinatedThirdInjectionByPublishDate&",

  };


  static from(data, field) {
    return data.find((d) => d.endpoint.includes(field)).values;
  }
}
