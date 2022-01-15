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

    // UK DATA
    PHE_UK_CUM_ADMISSIONS: "product=phe/overview&component=cumAdmissions&",
    PHE_UK_CUM_CASES: "product=phe/overview&component=cumCasesBySpecimenDate&",
    PHE_UK_CUM_DEATHS_28_DAYS: "product=phe/overview&component=cumDeaths28DaysByDeathDate&",
    PHE_UK_CUM_VACC_FIRST: "product=phe/overview&component=cumPeopleVaccinatedFirstDoseByPublishDate&",
    PHE_UK_CUM_VACC_SECOND: "product=phe/overview&component=cumPeopleVaccinatedSecondDoseByPublishDate&",
    PHE_UK_CUM_VACC_THIRD: "product=phe/overview&component=cumPeopleVaccinatedThirdInjectionByPublishDate&",
    PHE_UK_NEW_AMISSIONS: "product=phe/overview&component=newAdmissions&",
    PHE_UK_NEW_CASES: "product=phe/overview&component=newCasesBySpecimenDate&",
    PHE_UK_NEW_DEATHS_28_DAYS: "product=phe/overview&component=newDeaths28DaysByDeathDate&",
    PHE_UK_NEW_VACC_FIRST: "product=phe/overview&component=newPeopleVaccinatedFirstDoseByPublishDate&",
    PHE_UK_NEW_VACC_SECOND: "product=phe/overview&component=newPeopleVaccinatedSecondDoseByPublishDate&",
    PHE_UK_NEW_VACC_THIRD: "product=phe/overview&component=newPeopleVaccinatedThirdInjectionByPublishDate&",

    // NATION DATA
    // Phong...
    PHE_NATION_ADMISSIONS: "areaType=nation&metric=cumAdmissions&",
    PHE_NATION_CASES: "areaType=nation&metric=cumCasesBySpecimenDate&",
    PHE_NATION_DEATHS: "areaType=nation&metric=cumOnsDeathsByRegistrationDate&",

    PHE_NATION_VACC_1: "areaType=nation&metric=cumVaccinationFirstDoseUptakeByVaccinationDatePercentage&",
    PHE_NATION_VACC_2: "areaType=nation&metric=cumVaccinationSecondDoseUptakeByVaccinationDatePercentage&",
    PHE_NATION_VACC_3: "areaType=nation&metric=cumVaccinationThirdInjectionUptakeByPublishDatePercentage&",

    // ENGLAND NHS REGION
    PHE_ENGNHS_CASES: [],
    PHE_ENGNHS_CASES_UNIQUE: [],
    PHE_ENGNHS_DEATHS: [],
    PHE_ENGNHS_VACC: [],

    // UTLA DATA
    // Phong...
    // See UTLA dashboard

    // LTLA DATA (discarded)
    PHE_LTLA_NEW_CASES: ["product=phe/ltla/", "component=newCasesBySpecimenDate&"],
    PHE_LTLA_NEW_DEATHS: ["product=phe/ltla/", "component=newWeeklyNsoDeathsByRegDate&"],
    PHE_LTLA_NEW_VACCINATION: ["product=phe/ltla/", "component=cumVaccinationSecondDoseUptakeByVaccinationDatePercentage&"],
    PHE_LTLA_NEW_VACC_AGE_DEMOGRAPHICS: ["product=phe/ltla/", "component=vaccinationsAgeDemographics&"],

    // MSOA DATA
    PHE_MSOA_ALL: "areaType=msoa"

  };
  
  static from(data, field) {
    let x;
    if (typeof(field) == 'string') {
      x = data.find((d) => d.endpoint.includes(field));
    } else {
      // Array of AND conditions
      x = data.find((d) => field.every((f) => d.endpoint.includes(f)));
    }

    if (x) {
      // PHE: the data has 'body' field
      return x.values.body ? x.values.body : x.values;
    } else {
      console.error('Data stream not found with' + field);
      return undefined;
    }
  }
}
