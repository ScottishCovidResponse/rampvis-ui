// https://observablehq.com/@scottwjones/jonathan-story
// https://observablehq.com/@scottwjones/lockdown-restriction-data#getCalendarEvents

import * as d3 from "d3";
import { ScrollingSvg } from "./ScrollingSvg";
import { SemanticEvent } from "./SemanticEvent";
import { TimeLine } from "./Timeline";
import { TimeSeries } from "./TimeSeries";
import { readCSVFile } from "./utils-data";
import { findDateIdx } from "./utils-feature-detection";
import { getCalendarEvents } from "./utils-lockdown-restriction-data";

// let testDataICU: any;
let nationCases: any;
let nationDeaths: any;
let ukCasesData: any;
let semanticCSV: any;

export async function prepareData() {
  nationCases = await prepareNationCases();
  nationDeaths = await prepareNationDeaths();
  ukCasesData = await prepareUKCasesData();
  semanticCSV = await prepareSemanticCSV();

  console.log("nationCases = ", nationCases);
}

export async function prepareNationCases() {
  const csv = await readCSVFile("/static/story-boards/nation_cases.csv");

  const casesObj = {};
  csv.forEach((d) => {
    if (!casesObj[d.areaName]) {
      casesObj[d.areaName] = [];
    }
    casesObj[d.areaName].push({
      date: new Date(d.date),
      y: +d.newCasesByPublishDate,
    });
  });

  for (const nation in casesObj) {
    casesObj[nation].sort((r1, r2) => r1.date - r2.date);
  }
  return casesObj;
}

export async function prepareNationDeaths() {
  const csv = await readCSVFile("/static/story-boards/nation_deaths.csv");

  const deathsObj = {};
  csv.forEach((d) => {
    if (!deathsObj[d.areaName]) {
      deathsObj[d.areaName] = [];
    }
    deathsObj[d.areaName].push({
      date: new Date(d.date),
      y: +d.newDeaths28DaysByDeathDate,
    });
  });

  for (const nation in deathsObj) {
    deathsObj[nation].sort((r1, r2) => r1.date - r2.date);
  }
  return deathsObj;
}

export async function prepareUKCasesData() {
  const csv = await readCSVFile("/static/story-boards/uk_daily_cases.csv");

  return csv.map((row) => {
    return { date: new Date(row.date), y: +row.newCasesByPublishDate };
  });
}

export async function prepareSemanticCSV() {
  const csv = await readCSVFile("/static/story-boards/semantic_events@3.csv");
  return csv;
}

export async function prepareCalendarEvents(region) {
  const lockdownEvents = await getCalendarEvents(region, [
    SemanticEvent.TYPES.LOCKDOWN_START,
    SemanticEvent.TYPES.LOCKDOWN_END,
  ]);

  // Convert csv to Event Objects
  const semanticEvents = semanticCSV.map((e) =>
    new SemanticEvent(new Date(e.date)).setDescription(e.text),
  );

  return lockdownEvents.concat(semanticEvents);
}

const writeText = (text, date, data) => {
  // Find idx of event in data and set location of the annotation in opposite half of graph
  const idx = findDateIdx(date, data);

  return { end: idx, date: date.toDateString().slice(4), description: text };
};

export function prepareAnnotations(region, calendarEvents) {
  const annos: { start?: number; end: number }[] = [{ start: 0, end: 0 }];

  // Load data
  const cases = nationCases[region];
  const deaths = nationDeaths[region];

  // ------------- Death based events -------------
  let firstDeath = false;
  let deathCount = 0;
  let deathDate, newDeaths;
  for (let i = 0; i < deaths.length; i++) {
    deathDate = deaths[i].date;
    newDeaths = deaths[i].y;
    deathCount += newDeaths;

    // Create Anno for first death
    if (!firstDeath && newDeaths > 0) {
      annos.push(
        writeText(`First death recorded in ${region}`, deathDate, cases),
      );
      firstDeath = true;
    }

    // Create Anno for first 1k deaths
    if (deathCount >= 1000 && deathCount - newDeaths < 1000) {
      annos.push(
        writeText(`Deaths in ${region} exceed one thousand.`, deathDate, cases),
      );
    }

    // Create Anno for first 20k deaths
    if (deathCount >= 20000 && deathCount - newDeaths < 20000) {
      annos.push(
        writeText(
          `Total of over 20,000 deaths in ${region}.`,
          deathDate,
          cases,
        ),
      );
    }

    // Create Anno for first 50k deaths
    if (deathCount >= 50000 && deathCount - newDeaths < 50000) {
      annos.push(
        writeText(`50,000 total deaths in ${region}.`, deathDate, cases),
      );
    }
  }

  // Create Anno for least deaths since jan 2021
  const janIdx = findDateIdx(new Date("2021-01-01"), deaths); // Get beginning idx to start search
  const seg = deaths.slice(janIdx);
  // Find min deaths value
  const minDeaths = seg.reduce((min, curr) => (min.y < curr.y ? min : curr));

  annos.push(
    writeText(
      `${minDeaths.y} deaths in ${region} - the least since January 2021.`,
      minDeaths.date,
      cases,
    ),
  );

  // ------------- Cases based events -------------
  let casesCount = 0;
  let casesDate, newCases;
  for (let i = 0; i < cases.length; i++) {
    casesDate = cases[i].date;
    newCases = cases[i].y;
    casesCount += newCases;

    // Create Anno for first 50k cases
    if (casesCount >= 50000 && casesCount - newCases < 50000) {
      annos.push(
        writeText(
          `Cases in ${region} exceed fifty thousand.`,
          casesDate,
          cases,
        ),
      );
    }

    // Create Anno for first 100k cases
    if (casesCount >= 100000 && casesCount - newCases < 100000) {
      annos.push(
        writeText(
          `Milestone of 100k total cases in ${region}.`,
          casesDate,
          cases,
        ),
      );
    }

    // Create Anno for first 1m cases
    if (casesCount >= 1000000 && casesCount - newCases < 1000000) {
      annos.push(
        writeText(
          `One million cases have been recorded in ${region} since the start of the pandemic.`,
          casesDate,
          cases,
        ),
      );
    }
  }

  // Create Anno for greatest weekly increase
  const maxIncrease = cases
    .slice(7)
    .reduce(
      (max, curr, i) =>
        curr.y / cases[i].y > max.ratio && cases[i].y > 0
          ? { ratio: curr.y / cases[i].y, max: curr }
          : max,
      { ratio: 1 },
    );

  annos.push(
    writeText(
      `Compared to last week, today had ${Math.round(
        maxIncrease.ratio,
      )}x more new cases.`,
      maxIncrease.max.date,
      cases,
    ),
  );

  // Create Anno for max cases
  const maxCases = cases.reduce((max, curr) => (max.y > curr.y ? max : curr));
  annos.push(
    writeText(
      `This day had the largest recorded cases for ${region}, with ${maxCases.y} new cases.`,
      maxCases.date,
      cases,
    ),
  );

  // ------------- Calendar based events -------------
  calendarEvents.forEach((e) => {
    if (findDateIdx(e._date, cases) !== -1)
      annos.push(writeText(e.description, e._date, cases));
  });

  annos.sort((a1, a2) => a1.end - a2.end);
  if (annos[annos.length - 1].end < cases.length - 1)
    annos.push({ end: cases.length - 1 });

  annos.slice(1).forEach((anno, i) => (anno.start = annos[i].end));

  return annos;
}

//
//
//

let annotations;
let scrollingSvg;
let timeline;
let timeseries;
let maxCounter;
let counter;

export async function createScrollingSvg(selector, nation) {
  d3.select(selector).selectAll("*").remove();

  const calendarEvents = await prepareCalendarEvents(nation);
  annotations = await prepareAnnotations(nation, calendarEvents);
  maxCounter = annotations.length - 1;
  // prettier-ignore
  console.log("utils-story-3: maxCounter = ", maxCounter, ", annotations = ", annotations);
  const casesData = nationCases[nation];

  scrollingSvg = new ScrollingSvg(
    selector,
    annotations.slice(1),
    1200,
    600,
    undefined,
    onScrollCallback,
  );

  timeseries = new TimeSeries(casesData)
    .svg(scrollingSvg.timeseriesContainer)
    .yLabel("New cases by publish date")
    .border(60);
  timeline = new TimeLine(casesData).svg(scrollingSvg.timelineContainer);

  // Catch the events generated by scroll event
  function onScrollCallback(_counter: number) {
    counter = _counter;
    console.log("utils-story-3: onScrollCallback: counter = ", counter);

    timeline.annotations(annotations).plot(counter);
    timeseries.animate(annotations, counter).plot();
  }

  timeline.annotations(annotations).plot(0);
  timeseries.animate(annotations, 0).plot();
}

export function updateCounter(inc) {
  // prettier-ignore
  console.log("utils-story-3: updateCounter: counter = ", counter, ", inc = ", inc);
  if (inc === 0) {
    counter = 0;
  }
  if (counter + inc > 0 && counter + inc < maxCounter) {
    counter += inc;
  }
  console.log("utils-story-3: updateCounter: counter = ", counter);

  scrollingSvg.updateCounter(counter);

  timeline.annotations(annotations).plot(counter);
  timeseries.animate(annotations, counter).plot();
}
