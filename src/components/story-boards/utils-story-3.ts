// https://observablehq.com/@scottwjones/jonathan-story
// https://observablehq.com/@scottwjones/lockdown-restriction-data#getCalendarEvents

import * as d3 from "d3";
import { ScrollingSvg } from "./ScrollingSvg";
import { SemanticEvent } from "./SemanticEvent";
import { TimeLine } from "./Timeline";
import { TimeSeries } from "./TimeSeries";
import { readJSONFile, readCSVFile } from "./utils-data";

// let testDataICU: any;
let nationCases: any;
let nationDeaths: any;
let ukCasesData: any;
let semanticCSV: any;
let calendarEvents: any;

export async function createData() {
  // const parseDate = d3.timeParse("%Y-%m-%d");
  // testDataICU = await readJSONFile("/static/story-boards/icuGlasgow.json");
  // testDataICU = testDataICU.map(Object.values).map((d) => {
  //   return { date: parseDate(d[0]), y: d[1] };
  // });

  nationCases = await prepareNationCases();
  nationDeaths = await prepareNationDeaths();
  ukCasesData = await prepareUKCasesData();
  semanticCSV = await prepareSemanticCSV();
}

export async function prepareNationCases() {
  let csv = await readCSVFile("/static/story-boards/nation_cases.csv");

  let casesObj = {};
  csv.forEach((d) => {
    if (!casesObj[d.areaName]) {
      casesObj[d.areaName] = [];
    }
    casesObj[d.areaName].push({
      date: new Date(d.date),
      y: +d.newCasesByPublishDate,
    });
  });

  for (let nation in casesObj) {
    casesObj[nation].sort((r1, r2) => r1.date - r2.date);
  }
  return casesObj;
}

export async function prepareNationDeaths() {
  let csv = await readCSVFile("/static/story-boards/nation_deaths.csv");

  let deathsObj = {};
  csv.forEach((d) => {
    if (!deathsObj[d.areaName]) {
      deathsObj[d.areaName] = [];
    }
    deathsObj[d.areaName].push({
      date: new Date(d.date),
      y: +d.newDeaths28DaysByDeathDate,
    });
  });

  for (let nation in deathsObj) {
    deathsObj[nation].sort((r1, r2) => r1.date - r2.date);
  }
  return deathsObj;
}

export async function prepareUKCasesData() {
  let csv = await readCSVFile("/static/story-boards/uk_daily_cases.csv");

  return csv.map((row) => {
    return { date: new Date(row.date), y: +row.newCasesByPublishDate };
  });
}

export async function prepareSemanticCSV() {
  let csv = await readCSVFile("/static/story-boards/semantic_events@3.csv");
  return csv;
}

export async function prepareCalendarEvents() {
  const lockdownEvents = getCalendarEvents(region, [
    SemanticEvent.TYPES.LOCKDOWN_START,
    SemanticEvent.TYPES.LOCKDOWN_END,
  ]);

  // Convert csv to Event Objects
  const semanticEvents = semanticCSV.map((e) =>
    new SemanticEvent(new Date(e.date)).setDescription(e.text),
  );

  return lockdownEvents.concat(semanticEvents);
}

//

let getCalendarEvents = (placeName, types) => {
  // If given place name is a country we will use its first alphabetical local authority
  let isCountry = countryRegions[placeName];
  let localAuthority = isCountry ? isCountry[0] : placeName;

  let country;
  for (let key in countryRegions) {
    if (countryRegions[key].includes(localAuthority)) country = key;
  }

  const localAuthorityData = countryRestrictionData[country].filter(
    (row) => row["Local Authority"] == localAuthority,
  );
  const events = [];
  let eventDates = [];
  types.forEach((type) => {
    switch (type) {
      case SemanticEvent.TYPES.LOCKDOWN:
        eventDates = findEventStartEnd("National Lockdown", localAuthorityData);
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setStart(d.start)
              .setEnd(d.end)
              .setDescription("National Lockdown begins."),
          ),
        );
        break;
      case SemanticEvent.TYPES.LOCKDOWN_START:
        eventDates = findEventStartEnd("National Lockdown", localAuthorityData);
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setDescription("Start of National Lockdown."),
          ),
        );
        break;
      case SemanticEvent.TYPES.LOCKDOWN_END:
        eventDates = findEventStartEnd("National Lockdown", localAuthorityData);
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.end)
              .setType(type)
              .setDescription("End of National Lockdown."),
          ),
        );
        break;
      case SemanticEvent.TYPES.VACCINE_1:
        eventDates = findEventStartEnd(
          "Pfizer Vaccine Rollout",
          localAuthorityData,
        );
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setDescription("Pfizer vaccine rollout begins."),
          ),
        );
        eventDates = findEventStartEnd(
          "Astrazeneca Vaccine Rollout",
          localAuthorityData,
        );
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setDescription("Astrazeneca rollout in the UK starts."),
          ),
        );
        eventDates = findEventStartEnd(
          "Moderna Vaccine Rollout",
          localAuthorityData,
        );
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setDescription("First Moderna vaccines administered."),
          ),
        );
        break;
      case SemanticEvent.TYPES.VACCINE_2:
        eventDates = findEventStartEnd(
          "Second Dose Rollout",
          localAuthorityData,
        );
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setDescription(
                "First person in the UK given second dose of vaccine.",
              ),
          ),
        );
        break;
      case SemanticEvent.TYPES.VACCINE_3:
        eventDates = findEventStartEnd(
          "Booster Vaccine Rollout",
          localAuthorityData,
        );
        eventDates.forEach((d) =>
          events.push(
            new SemanticEvent(d.start)
              .setType(type)
              .setDescription("Booster campaign begins in the UK."),
          ),
        );
        break;
      default:
        break;
    }
  });
  return events;
};

//

let tl, ts;
let annotations;

export function createScrollingSvg(selector) {
  const scrollSvg = ScrollingSvg(
    selector,
    [
      { date: "11th October", description: "This is an example" },
      { date: "16th October", description: "Even more text" },
      { date: "20th December", description: "This would be a description" },
      { date: "12th Jan", description: "This is the last event" },
    ],
    800,
    500,
    undefined,
    onChangeContainer,
  );

  console.log("utils-story-3: scrollSvg = ", scrollSvg);
  // prettier-ignore
  console.log("utils-story-3: scrollSvg.graphSvg = ", d3.select(scrollSvg).select("#graphSvg"));

  ts = new TimeSeries(testDataICU).svg(
    d3.select(scrollSvg).select("#graphSvg").node(),
  );
  tl = new TimeLine(testDataICU).svg(
    d3.select(scrollSvg).select("#timelineSvg").node(),
  );

  //d3.select(scrollSvg.graphSvg).selectAll("*").remove();
  //d3.select(scrollSvg.timelineSvg).selectAll("*").remove();
  d3.select(scrollSvg).select("#graphSvg").selectAll("*").remove();
  d3.select(scrollSvg).select("#timelineSvg").selectAll("*").remove();

  annotations = [
    { start: 0, end: 0 },
    { start: 0, end: 30 },
    { start: 30, end: 35 },
    { start: 35, end: 100 },
    { start: 100, end: testDataICU.length - 1 },
  ];

  tl.annotations(annotations).plot(0);
  ts.animate(annotations, 0).plot();

  // Timeline scroll event will generate a number
  // Catch the events
  function onChangeContainer(val: number) {
    d3.select(scrollSvg).select("#graphSvg").selectAll("*").remove();
    d3.select(scrollSvg).select("#timelineSvg").selectAll("*").remove();

    console.log("utils-story-3: onChangeContainer: val = ", val);

    tl.annotations(annotations).plot(val);
    ts.animate(annotations, val).plot();
  }
}
