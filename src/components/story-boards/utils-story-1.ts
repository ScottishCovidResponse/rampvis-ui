import { readCSVFile } from "./utils-data";
import { SemanticEvent } from "./SemanticEvent";
import { detectFeatures } from "./utils-feature-detection";
import {
  combineBounds,
  eventsToGaussian,
  findDateIdx,
  maxBounds,
  peakSegment,
  splitDataAndEvents,
} from "./utils-aggregation-segmentation";

import { GraphAnnotation } from "./GraphAnnotation";
import { DataEvent } from "./DataEvent";
import { TimeSeries } from "./TimeSeries";

export async function processDataAndGetRegions(): Promise<string[]> {
  await createDailyCasesByRegion();
  createCalenderEvents();
  createPeaksByRegion();
  createPeaksByRegion();
  createGaussByRegion();

  return Object.keys(dailyCasesByRegion).sort();
}

//
//
//
const dailyCasesByRegion = {};

async function createDailyCasesByRegion() {
  const csv: any[] = await readCSVFile(
    "/static/mock/story-boards-data/newCasesByPublishDateRollingSum.csv",
  );

  csv.forEach((row) => {
    const region = row.areaName;
    const date = new Date(row.date);
    const cases = +row.newCasesByPublishDateRollingSum;

    if (!dailyCasesByRegion[region]) dailyCasesByRegion[region] = [];

    dailyCasesByRegion[region].push({ date: date, y: cases });
  });

  for (const region in dailyCasesByRegion) {
    dailyCasesByRegion[region].sort((e1, e2) => e1.date - e2.date);
  }

  // prettier-ignore
  console.log("createDailyCasesByRegion: dailyCasesByRegion = ", dailyCasesByRegion);
}

//
//
//
let calendarEvents = [];

function createCalenderEvents() {
  // We need to construct Calendar Data Because
  // Lockdown events
  const lockdownStart1 = new SemanticEvent(new Date("2020-03-24"))
    .setType(SemanticEvent.TYPES.LOCKDOWN_START)
    .setDescription("Start of First Lockdown.");
  const lockdownStart2 = new SemanticEvent(new Date("2021-01-05"))
    .setType(SemanticEvent.TYPES.LOCKDOWN_END)
    .setDescription("Start of Second Lockdown.");
  const lockdownEnd1 = new SemanticEvent(new Date("2020-05-28"))
    .setType(SemanticEvent.TYPES.LOCKDOWN_START)
    .setDescription("End of First Lockdown.");
  const lockdownEnd2 = new SemanticEvent(new Date("2021-04-01"))
    .setType(SemanticEvent.TYPES.LOCKDOWN_END)
    .setDescription("End of Second Lockdown.");

  // Vaccine Events
  const pfizer1 = new SemanticEvent(new Date("2020-12-08"))
    .setType(SemanticEvent.TYPES.VACCINE)
    .setDescription("UK begins rollout of Pfizer Vaccine.");
  const astra1 = new SemanticEvent(new Date("2021-01-04"))
    .setType(SemanticEvent.TYPES.VACCINE)
    .setDescription(
      "Astrazeneca Vaccine approved and begins being administered.",
    );
  const moderna1 = new SemanticEvent(new Date("2021-04-13"))
    .setType(SemanticEvent.TYPES.VACCINE)
    .setDescription("Moderna Vaccine rollout begins in the UK.");
  const booster = new SemanticEvent(new Date("2021-09-16"))
    .setType(SemanticEvent.TYPES.VACCINE)
    .setDescription("Booster campaign in the UK starts.");

  // Create an array of semantic events and return
  calendarEvents = [
    lockdownStart1,
    lockdownEnd1,
    lockdownStart2,
    lockdownEnd2,
    pfizer1,
    astra1,
    moderna1,
    booster,
  ];

  console.log("createCalenderEvents: calendarEvents = ", calendarEvents);

  const ranking = {};
  ranking[SemanticEvent.TYPES.LOCKDOWN_START] = 5;
  ranking[SemanticEvent.TYPES.VACCINE] = 4;
  ranking[SemanticEvent.TYPES.LOCKDOWN_END] = 3;

  calendarEvents.forEach((e) => e.setRank(ranking[e.type]));

  // prettier-ignore
  console.log("createCalenderEvents: calendarEvents (ranked) = ", calendarEvents);
}

//
//
//
const peaksByRegion = {};

function createPeaksByRegion() {
  for (const region in dailyCasesByRegion) {
    //console.log(region);
    peaksByRegion[region] = detectFeatures(dailyCasesByRegion[region], {
      peaks: true,
      metric: "Daily Cases",
    });
  }

  console.log("createPeaksByRegion: peaksByRegion = ", peaksByRegion);

  const rankPeaks = (peaks) => {
    const sorted = [...peaks].sort((p1, p2) => p1.height - p2.height);
    const nPeaks = peaks.length;
    const fifth = nPeaks / 5;

    sorted.forEach((p, i) => p.setRank(1 + Math.floor(i / fifth)));
  };

  // for each region we apply the ranking function to the peak events
  for (const region in peaksByRegion) {
    rankPeaks(peaksByRegion[region]);
  }

  console.log("createPeaksByRegion: peaksByRegion (ranked) = ", peaksByRegion);
}

//
//
//
const gaussByRegion = {};

function createGaussByRegion() {
  for (const region in peaksByRegion) {
    const peaks = peaksByRegion[region];
    const dailyCases = dailyCasesByRegion[region];

    console.log("createGaussByRegion: dailyCases = ", dailyCases);

    // Calculate gaussian time series for peaks
    const peaksGauss = eventsToGaussian(peaks, dailyCases);
    const peaksBounds = maxBounds(peaksGauss);

    console.log("createGaussByRegion: peaksBounds = ", peaksBounds);

    // Calculate gaussian time series for calendar events
    const calGauss = eventsToGaussian(calendarEvents, dailyCases);
    const calBounds = maxBounds(calGauss);

    // Combine gaussian time series
    const combGauss = combineBounds([peaksBounds, calBounds]);
    gaussByRegion[region] = combGauss;
  }

  // prettier-ignore
  console.log("createGaussByRegion: gaussByRegion = ", gaussByRegion, Object.keys(gaussByRegion));
}

//
//
//
const splitsByRegion = {};
let segNum: number;

export function segmentData(_segNum: number) {
  segNum = _segNum;
  for (const region in peaksByRegion) {
    const dailyCases = dailyCasesByRegion[region];
    splitsByRegion[region] = peakSegment(
      gaussByRegion[region],
      dailyCases,
    ).slice(0, segNum - 1);
  }

  // prettier-ignore
  console.log("segmentData: splitsByRegion = ", splitsByRegion);
}

//
// region
//

let region;
let casesData;
const annotations = [{ start: 0, end: 0 }];

export function onSelectRegion(_region: string) {
  region = _region;
  console.log("onSelectRegion: region =  ", region);

  //
  // annotations
  //
  casesData = dailyCasesByRegion[region];
  console.log("onSelectRegion: dailyCasesByRegion", dailyCasesByRegion);
  console.log("onSelectRegion: caseData", casesData);

  // We now combine the event arrays and segment them based on our splits
  console.log("onSelectRegion: peaksByRegion", peaksByRegion);
  const peaks = peaksByRegion[region];
  console.log("onSelectRegion: peaks", peaks);
  const events = peaks.concat(calendarEvents);
  const splits = splitsByRegion[region].sort((s1, s2) => s1.date - s2.date);

  // Segment data and events according to the splits
  const dataEventsBySegment = splitDataAndEvents(events, splits, casesData);

  // Loop over all segments and apply feature-action rules
  // let annotations = [{ start: 0, end: 0 }];
  let currSeg = 0;
  let currData, firstDate, lastDate;
  for (; currSeg < segNum; currSeg++) {
    // Get segment data based on segment number
    currData = dataEventsBySegment[currSeg];
    firstDate = currData[0].date;
    lastDate = currData[currData.length - 1].date;

    // Apply different rules for first, middle and last segment
    if (currSeg == 0) {
      /*
          ------- First Segment Rules -------
        */

      /*
          ------- Rules based on entire segment -------
        */

      // Add annotation for positive line of best fit
      const slope = linRegGrad(currData.map((d) => d.y));
      const posGrad = slope > 0;
      if (posGrad)
        annotations.push(
          writeText(
            "The number of cases continues to grow.",
            firstDate,
            casesData,
          ),
        );

      // Add annotation based on gradient of line of best fit
      let gradText = "";
      if (Math.abs(slope) >= 0.25) {
        // Steep case
        gradText =
          `By ${lastDate.toLocaleDateString()}, the number of cases ` +
          (posGrad
            ? "continued to climb higher."
            : "continued to come down noticeably.");
        annotations.push(writeText(gradText, lastDate, casesData));
      } else if (Math.abs(slope) >= 0.05) {
        // Shallow case
        gradText =
          `By ${lastDate.toLocaleDateString()}, the number of cases continued to ` +
          (posGrad ? "increase." : "decrease.");
        annotations.push(writeText(gradText, lastDate, casesData));
      }

      /*
          ------- Rules based on datapoints in segment -------
        */

      // Set up variables for tracking highest peak and first non-zero value
      let highestPeak;
      let foundNonZero = false;
      currData.forEach((d) => {
        // Add annotation for the first non-zero value
        if (!foundNonZero && d.y > 0) {
          const nonZeroText = `On ${d.date.toLocaleDateString()}, ${region} recorded its first COVID-19 case.`;
          annotations.push(writeText(nonZeroText, d.date, casesData));
          foundNonZero = true;
        }

        d.events.forEach((e) => {
          // Add annotation for semantic events that are rank > 3
          if (e.rank > 3 && e instanceof SemanticEvent) {
            annotations.push(
              writeText(e.description, e._date, casesData, true),
            );
          }

          // Find tallest peak that is ranked > 3
          if (e.rank > 3 && e.type == DataEvent.TYPES.PEAK) {
            highestPeak =
              highestPeak && highestPeak.height > e.height ? highestPeak : e;
          }
        });
      });

      // Add annotation if we have a tall enough peak
      if (highestPeak) {
        const peakText = `By ${highestPeak.date}, the number of cases reached ${highestPeak.height}.`;
        annotations.push(writeText(peakText, highestPeak._date, casesData));
      }
    } else if (currSeg < segNum - 1) {
      /*
          ------- Middle Segments Rules -------
        */

      /*
          ------- Rules based on datapoints in segment -------
        */
      currData.forEach((d) => {
        d.events.forEach((e) => {
          // Add annotation for semantic events that are rank > 3
          if (e.rank > 3 && e instanceof SemanticEvent) {
            annotations.push(
              writeText(e.description, e._date, casesData, true),
            );
          }

          // Add annotation for peak events that are rank > 3
          if (e.rank > 3 && e.type == DataEvent.TYPES.PEAK) {
            const peakText = `By ${e.date}, the number of cases peaks at ${e.height}.`;
            annotations.push(writeText(peakText, e._date, casesData, true));
          }
        });
      });
    } else {
      /*
          ------- Last Segment Rules -------
        */

      /*
          ------- Rules based entire segment -------
        */

      // Add annotation based on gradient of line of best fit
      let gradText = "";
      const slope = linRegGrad(currData.map((d) => d.y));
      if (slope >= 0.25) {
        // Steep case
        gradText = `By ${lastDate.toLocaleDateString()}, the number of cases continued to climb higher.
                      Let us all make a great effort to help bring the number down. Be safe, and support the NHS.`;
      } else if (slope >= 0.05) {
        // Shallow case
        gradText = `By ${lastDate.toLocaleDateString()}, the number of cases continued to increase.
                      Let us continue to help bring the number down. Be safe, and support the NHS.`;
      } else if (slope > -0.05) {
        // Flat case
        const cases = casesData[casesData.length - 1].y;

        // Add annotation based on final case number
        if (cases >= 200) {
          gradText = `The number of cases remains very high. Let us be safe, and support the NHS.`;
        } else if (cases >= 50) {
          gradText = `The number of cases remains noticeable. Let us be safe and support the NHS.`;
        } else {
          gradText = `The number of cases remains low. We should continue to be vigilant.`;
        }
      } else if (slope > -0.25) {
        // Negative shallow case
        gradText = `By ${lastDate.toLocaleDateString()}, the number of cases continued to decrease.
                      The trend is encouraging. Let us be vigilant, and support the NHS.`;
      } else {
        // Negative steep case
        gradText = `By ${lastDate.toLocaleDateString()}, the number of cases continued to come down noticeably.
                      We should continue to be vigilant.`;
      }
      annotations.push(writeText(gradText, lastDate, casesData));

      /*
          ------- Rules based on datapoints in segement -------
        */
      currData.forEach((d) => {
        d.events.forEach((e) => {
          // Add annotation for semantic events that are rank > 3
          if (e.rank > 3 && e instanceof SemanticEvent) {
            annotations.push(
              writeText(e.description, e._date, casesData, true),
            );
          }

          // Add annotation for peak events that are rank > 3
          if (e.rank > 3 && e.type == DataEvent.TYPES.PEAK) {
            const peakText = `By ${e.date}, the number of cases peaks at ${e.height}.`;
            annotations.push(writeText(peakText, e._date, casesData, true));
          }
        });
      });
    }
  }

  // Sort annotations and set annotations starts to the end of the previous annotation
  annotations.sort((a1, a2) => a1.end - a2.end);
  annotations.push({ end: casesData.length - 1 });
  annotations.slice(1).forEach((anno, i) => (anno.start = annotations[i].end));

  console.log("onSelectRegion: annotations", annotations);
}

const writeText = (text, date, data, showRedCircle = false) => {
  // Find idx of event in data and set location of the annotation in opposite half of graph
  const idx = findDateIdx(date, data);
  const annoIdx = Math.floor(
    ((idx < data.length / 2 ? 3 : 1) / 4) * data.length,
  );

  const annoX = data[annoIdx].date;
  const target = data[idx];

  console.log("writeText:annoX = ", annoX, ", target = ", target);

  const anno = new GraphAnnotation()
    .title(date.toLocaleDateString())
    .label(text)
    .backgroundColor("white")
    .wrap(200);

  anno.unscaledX = annoX;
  anno.unscaledTarget = [target.date, target.y];

  if (showRedCircle) {
    anno.circleHighlight();
  }

  return { end: idx, annotation: anno, fadeout: true };
};

/*
    Linear regression function inspired by the answer found at: https://stackoverflow.com/a/31566791.
    We remove the need for array x as we assum y data is equally spaced and we only want the gradient.
 */

function linRegGrad(y) {
  let slope = {};
  const n = y.length;
  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_xx = 0;

  for (let i = 0; i < y.length; i++) {
    sum_x += i;
    sum_y += y[i];
    sum_xy += i * y[i];
    sum_xx += i * i;
  }

  slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  return slope;
}

//
//
//
let visCtx;
let ts;

export function createTimeSeriesSVG(selector: string) {
  visCtx = TimeSeries.animationSVG(1200, 400, selector);
}

//
//
//

export function onClickAnimate(animationCounter: number, selector: string) {
  const ts = new TimeSeries(casesData, selector)
    .svg(visCtx)
    .title(`Basic story of COVID-19 in ${region}`)
    .yLabel("Cases per Day")
    .ticks(30);

  const xSc = ts.getXScale();
  const ySc = ts.getYScale();

  let annoObj;

  console.log("annotations = ", annotations);

  annotations.forEach((a: any) => {
    annoObj = a.annotation;
    if (annoObj) {
      annoObj.x(xSc(annoObj.unscaledX)).y(ts._height / 2);

      annoObj.target(
        xSc(annoObj.unscaledTarget[0]),
        ySc(annoObj.unscaledTarget[1]),
        false,
      );
    }
  });

  console.log("createTimeSeriesSVG: annoObj = ", annoObj);
  ts.animate(annotations, animationCounter, visCtx).plot();
}
