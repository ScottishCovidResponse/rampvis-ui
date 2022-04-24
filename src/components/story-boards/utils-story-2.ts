import * as d3 from "d3";

import { readCSVFile } from "./utils-data";
import { detectFeatures } from "./utils-feature-detection";
import {
  combineBounds,
  eventsToGaussian,
  findDateIdx,
  maxBounds,
} from "./utils-aggregation-segmentation";

import { GraphAnnotation } from "./GraphAnnotation";
import { TimeSeries } from "./TimeSeries";
import { Rise } from "./Raise";
import { Fall } from "./Fall";
import { createDataGroup } from "./utils-data-processing";

/*What is the definition of a wave?
  src: https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/conditionsanddiseases/articles/coronaviruscovid19infectionsurveytechnicalarticle/wavesandlagsofcovid19inenglandjune2021

  "we define sustained increase in infection levels as lower bound estimates for
  R rate remaining above 1, and for growth rate above 0 for at least three weeks"

  So the peak must be > than three weeks (21 days) in width
*/

let dailyCasesByRegion = {};
let peaksByRegion = {};

export async function processDataAndGetRegions(): Promise<string[]> {
  await processDailyCasesByRegion();
  processPeaksByRegion();

  // console.log("processDataAndGetRegions: regions = ", Object.keys(dailyCasesByRegion).sort());
  return Object.keys(dailyCasesByRegion).sort();
}

async function processDailyCasesByRegion() {
  dailyCasesByRegion = {};

  const areaCodeToCountry = {
    S: "Scotland",
    E: "England",
    W: "Wales",
    N: "Northern Ireland",
  };

  const csv: any[] = await readCSVFile(
    "/static/story-boards/newCasesByPublishDateRollingSum.csv",
  );

  csv.forEach((row) => {
    const region = row.areaName;
    const date = new Date(row.date);
    const cases = +row.newCasesByPublishDateRollingSum / 7;
    const country = areaCodeToCountry[row.areaCode[0]];

    if (!dailyCasesByRegion[region]) {
      dailyCasesByRegion[region] = { country: country, data: [] };
    }

    dailyCasesByRegion[region].data.push({ date: date, y: cases });
  });

  for (const region in dailyCasesByRegion) {
    dailyCasesByRegion[region].data.sort((e1, e2) => e1.date - e2.date);
  }

  // prettier-ignore
  console.log("createDailyCasesByRegion: dailyCasesByRegion = ", dailyCasesByRegion);
}

function processPeaksByRegion() {
  peaksByRegion = {};

  for (const region in dailyCasesByRegion) {
    // Detect peaks in regional data
    const allPeaks = detectFeatures(dailyCasesByRegion[region].data, {
      peaks: true,
      metric: "Daily Cases",
    });

    // Detect falling and rising limbs of the peak. Return wave obj with all props
    let waves = allPeaks.map((p) => {
      const { rise, fall } = calcPeakRiseFall(
        p,
        dailyCasesByRegion[region].data,
      );
      return { peak: p, rise: rise, fall: fall };
    });

    // Assign relevant ranking to waves
    waves.map(rankFeatures);

    // Filter waves that do not meet criteria for being longer than 3 weeks
    waves = waves.filter((w) => w.peak.duration >= 21 && w.peak.rank >= 0.3);

    peaksByRegion[region] = waves;
  }

  // prettier-ignore
  console.log("createPeaksByRegion: peaksByRegion = ", peaksByRegion);
}

// Use properties of a peak object to create rise and fall objects
const calcPeakRiseFall = (peak, data) => {
  const [min, max] = d3.extent<number>(data.map((d) => d.y));

  // Get dates
  const start = peak._start;
  const date = peak._date;
  const end = peak._end;

  // Get idxs
  const startIdx = findDateIdx(start, data);
  const dateIdx = findDateIdx(date, data);
  const endIdx = findDateIdx(end, data);

  // Calculate properties of peak's rising segment
  const riseHeight = data[dateIdx].y - data[startIdx].y;
  const riseGrad = riseHeight / (dateIdx - startIdx);

  const normRiseHeight: number = riseHeight / (max - min);
  const normRiseGrad = normRiseHeight / (dateIdx - startIdx);

  // Calculate properties of peak's falling segment
  const fallHeight = data[dateIdx].y - data[endIdx].y;
  const fallGrad = fallHeight / (endIdx - dateIdx);

  const normFallHeight = fallHeight / (max - min);
  const normFallGrad = normFallHeight / (endIdx - dateIdx);

  const rise = new Rise(
    start,
    start,
    date,
    peak.metric,
    riseHeight,
    riseGrad,
  ).setNormGrad(normRiseGrad);
  const fall = new Fall(
    date,
    date,
    end,
    peak.metric,
    fallHeight,
    fallGrad,
  ).setNormGrad(normFallGrad);

  return { rise: rise, fall: fall };
};

// Ranking function that for events within wave obj
const rankFeatures = (waveObj) => {
  const { peak, rise, fall } = waveObj;

  peak.setRank(peak._normHeight * 5);
  rise.setRank(2);
  fall.setRank(1);
};

//
// When a region1 and region2 are selected, prepare data for that
//

let gauss = [];
let gaussMatchedWaves = [];
let annotations = [];
let visCtx;
let ts;
let maxCounter;
let counter = -1;

export function onSelectRegion(_region1, _region2, selector) {
  const region1 = _region1;
  const region2 = _region2;
  console.log("onSelectRegion: region1 = ", region1, ", region2 = ", region2);

  calculateCombGauss(region1, region2);
  calculateGaussMatchedWaves(region1, region2);
  calculateAnnotations(region1, region2);
  createTimeSeriesSVG(region1, region2, selector);

  maxCounter = annotations.length - 1;
  counter = -1;
}

function calculateCombGauss(region1, region2) {
  gauss = [];

  const reg1Waves = peaksByRegion[region1];
  const reg2Waves = peaksByRegion[region2];

  const region1Peaks = reg1Waves.reduce(
    (arr, obj) => arr.concat([obj.peak]),
    [],
  );
  const region2Peaks = reg2Waves.reduce(
    (arr, obj) => arr.concat([obj.peak]),
    [],
  );

  const reg1DailyCases = dailyCasesByRegion[region1].data;
  const reg2DailyCases = dailyCasesByRegion[region2].data;

  const largestDataSet =
    reg1DailyCases.length > reg2DailyCases.length
      ? reg1DailyCases
      : reg2DailyCases;

  const reg1Gauss = eventsToGaussian(region1Peaks, largestDataSet);
  const reg1Bounds = maxBounds(reg1Gauss);

  const reg2Gauss = eventsToGaussian(region2Peaks, largestDataSet);
  const reg2Bounds = maxBounds(reg2Gauss);

  // Combine gaussian time series
  gauss = combineBounds([reg1Bounds, reg2Bounds]);
  console.log("calculateCombGauss: gauss = ", gauss);
}

function calculateGaussMatchedWaves(region1, region2) {
  gaussMatchedWaves = [];

  // Peak distance functions
  const peakTimeDistance = (p1, p2) =>
    Math.abs(p1._date.getTime() - p2._date.getTime());

  const closestPeak = (p, data) =>
    data.reduce((closest, curr) =>
      peakTimeDistance(closest.peak, p) < peakTimeDistance(curr.peak, p)
        ? closest
        : curr,
    );

  const reg1DailyCases = dailyCasesByRegion[region1].data;
  const reg2DailyCases = dailyCasesByRegion[region2].data;

  const largestDataSet =
    reg1DailyCases.length > reg2DailyCases.length
      ? reg1DailyCases
      : reg2DailyCases;

  const gaussTS = gauss.map((g, i) => {
    return { date: largestDataSet[i].date, y: g };
  });

  const gaussPeaks = detectFeatures(gaussTS, {
    peaks: true,
  });

  const reg1Waves = peaksByRegion[region1];
  const reg2Waves = peaksByRegion[region2];

  console.log("calculateGaussMatchedWaves: reg1Waves", reg1Waves);
  console.log("calculateGaussMatchedWaves: reg2Waves", reg2Waves);

  let closestReg1Wave, closestReg2Wave, matchedWith1, matchedWith2;
  // Match gauss to corresponding regional and national waves
  gaussPeaks.forEach((gp) => {
    closestReg1Wave = closestPeak(gp, reg1Waves);
    closestReg2Wave = closestPeak(gp, reg2Waves);

    matchedWith1 =
      closestReg1Wave == closestPeak(closestReg2Wave.peak, reg1Waves);
    matchedWith2 =
      closestReg2Wave == closestPeak(closestReg1Wave.peak, reg2Waves);

    // Only add as pair of waves if closest together and not already paired
    if (
      matchedWith1 &&
      matchedWith2 &&
      !closestReg1Wave.paired &&
      !closestReg2Wave.paired
    ) {
      closestReg1Wave.paired = true;
      closestReg2Wave.paired = true;

      gaussMatchedWaves.push({
        date: gp._date,
        reg1Wave: closestReg1Wave,
        reg2Wave: closestReg2Wave,
      });
    }
  });

  reg1Waves.forEach((w) => {
    if (!w.paired) gaussMatchedWaves.push({ date: w.peak._date, reg1Wave: w });
  });

  reg2Waves.forEach((w) => {
    if (!w.paired) gaussMatchedWaves.push({ date: w.peak._date, reg2Wave: w });
  });

  // prettier-ignore
  console.log("calculateGaussMatchedWaves: gaussMatchedWaves = ", gaussMatchedWaves);
}

function calculateAnnotations(region1, region2) {
  annotations = [];

  const region1CasesData = dailyCasesByRegion[region1].data;
  const region1Waves = peaksByRegion[region1];
  const region1Color = "orange";

  const region2CasesData = dailyCasesByRegion[region2].data;
  const region2Waves = peaksByRegion[region2];
  const region2Color = "steelblue";

  console.log("calculateAnnotations: region1 waves", region1Waves);
  console.log("calculateAnnotations: region2 waves", region2Waves);
  console.log("calculateAnnotations: gaussMatchedWaves = ", gaussMatchedWaves);

  const maxReg1Wave = gaussMatchedWaves.reduce((max, w) =>
    w.reg1Wave &&
    (!max.reg1Wave || w.reg1Wave.peak.height > max.reg1Wave.peak.height)
      ? w
      : max,
  ).reg1Wave;
  const maxReg2Wave = gaussMatchedWaves.reduce((max, w) =>
    w.reg2Wave &&
    (!max.reg2Wave || w.reg2Wave.peak.height > max.reg2Wave.peak.height)
      ? w
      : max,
  ).reg2Wave;

  const maxReg1Rise = gaussMatchedWaves.reduce((max, w) =>
    w.reg1Wave &&
    (!max.reg1Wave || w.reg1Wave.rise._normGrad > max.reg1Wave.rise._normGrad)
      ? w
      : max,
  ).reg1Wave?.rise;
  const maxReg1Fall = gaussMatchedWaves.reduce((max, w) =>
    w.reg1Wave &&
    (!max.reg1Wave || w.reg1Wave.fall._normGrad > max.reg1Wave.fall._normGrad)
      ? w
      : max,
  ).reg1Wave?.fall;

  const maxReg2Rise = gaussMatchedWaves.reduce((max, w) =>
    w.reg2Wave &&
    (!max.reg2Wave || w.reg2Wave.rise._normGrad > max.reg2Wave.rise._normGrad)
      ? w
      : max,
  ).reg2Wave?.rise;
  const maxReg2Fall = gaussMatchedWaves.reduce((max, w) =>
    w.reg2Wave &&
    (!max.reg2Wave || w.reg2Wave.fall._normGrad > max.reg2Wave.fall._normGrad)
      ? w
      : max,
  ).reg2Wave?.fall;

  gaussMatchedWaves.sort((w1, w2) => w1.date - w2.date);

  const STEEP_THRESH = 0.004;
  const SLOW_THRESH = 0.002;

  const ordinal = (n) =>
    n + (n == 1 ? "st" : n == 2 ? "nd" : n == 3 ? "rd" : "th");

  let reg1WaveN = 0;
  let reg2WaveN = 0;
  let prev1Wave, prev2Wave;
  let annoText = "";

  for (let i = 0; i < gaussMatchedWaves.length; i++) {
    const { reg1Wave, reg2Wave } = gaussMatchedWaves[i];
    if (reg1Wave) reg1WaveN++;
    if (reg2Wave) reg2WaveN++;

    // Discuss the rise and peak of wave in reg2
    if (reg2Wave) {
      annotations.push(
        writeText(
          `${ordinal(reg2WaveN)} wave in ${region2} starts to ${
            reg2Wave.rise._normGrad > STEEP_THRESH ? "quickly" : "slowly"
          } rise.`,
          reg2Wave.rise._start,
          region2CasesData,
          false,
          region2Color,
        ),
      );

      annotations.push(
        writeText(
          `Wave reaches ${Math.round(reg2Wave.peak.height)} ${
            reg2Wave.peak.metric
          }.`,
          reg2Wave.peak._date,
          region2CasesData,
          true,
          region2Color,
        ),
      );

      if (prev2Wave) {
        const prevH = prev2Wave.peak.height;
        const currH = reg2Wave.peak.height;

        annoText = "";

        const hRatio = Math.max(prevH, currH) / Math.min(prevH, currH);

        if (reg2Wave == maxReg2Wave) {
          annoText = `This was the greatest wave ${region2} has experienced.`;
        } else if (hRatio >= 0.8 && hRatio <= 1.2) {
          annoText = `This wave was similar in size to the ${region2}'s previous peak.`;
        } else {
          annoText = `This was ${hRatio > 1.5 ? "far" : "slightly"} ${
            currH > prevH ? "greater" : "smaller"
          } than ${region2}'s last wave.`;
        }

        if (annoText.length)
          annotations.push(
            writeText(
              annoText,
              reg2Wave.peak._date,
              region2CasesData,
              false,
              region2Color,
            ),
          );
      }
    }

    // Discuss the rise and peak of wave in reg1
    if (reg1Wave) {
      annotations.push(
        writeText(
          `${ordinal(reg1WaveN)} local wave in ${region1} begins to rise ${
            reg1Wave.rise._normGrad > STEEP_THRESH ? "rapidly" : "steadily"
          }.`,
          reg1Wave.rise._start,
          region1CasesData,
          false,
          region1Color,
          true,
        ),
      );

      annotations.push(
        writeText(
          `Wave reaches ${Math.round(reg1Wave.peak.height)} ${
            reg1Wave.peak.metric
          }.`,
          reg1Wave.peak._date,
          region1CasesData,
          true,
          region1Color,
          true,
        ),
      );

      if (prev1Wave) {
        const prevH = prev1Wave.peak.height;
        const currH = reg1Wave.peak.height;

        annoText = "";

        const hRatio = Math.max(prevH, currH) / Math.min(prevH, currH);

        if (reg1Wave == maxReg1Wave) {
          annoText = `This was the greatest wave ${region1} has experienced.`;
        } else if (hRatio >= 0.8 && hRatio <= 1.2) {
          annoText = "This wave is similar in size to the previous local wave.";
        } else {
          annoText = `This was ${hRatio > 1.5 ? "far" : "slightly"} ${
            currH > prevH ? "greater" : "lower"
          } than ${region1}'s last wave.`;
        }

        if (annoText.length)
          annotations.push(
            writeText(
              annoText,
              reg1Wave.peak._date,
              region1CasesData,
              false,
              region1Color,
              true,
            ),
          );
      }
    }

    // Compare peak times between regions
    if (reg1Wave && reg2Wave) {
      const daysBetween =
        (reg1Wave.peak._date.getTime() - reg2Wave.peak._date.getTime()) /
        (1000 * 3600 * 24);

      annoText = "";
      if (daysBetween == 0) {
        annoText = "Both waves peak on the same day.";
      } else {
        annoText = `Peak of the ${region1} wave is ${Math.abs(
          daysBetween,
        )} days ${daysBetween > 0 ? "after" : "before"} the ${region2} wave.`;
      }
      if (annoText.length)
        annotations.push(
          writeText(
            annoText,
            reg1Wave.peak._date,
            region1CasesData,
            false,
            region1Color,
            true,
          ),
        );
    }

    // Discuss the fall of the wave in region 2
    if (reg2Wave) {
      annotations.push(
        writeText(
          `${region2} ${ordinal(reg2WaveN)} wave ${
            reg2Wave.fall.normGrad <= SLOW_THRESH
              ? "slowly falls back down"
              : reg2Wave.fall.rank >= STEEP_THRESH
              ? "rapidly declines"
              : "steadily reduces"
          }.`,
          reg2Wave.fall._end,
          region2CasesData,
          false,
          region2Color,
        ),
      );

      annoText = "";
      const regRise = reg2Wave.rise;
      const regFall = reg2Wave.fall;
      if (regRise == maxReg2Rise && regFall == maxReg2Fall) {
        annoText = `This wave was the fastest rising and falling of all of ${region2}'s waves.`;
      } else if (regRise == maxReg2Rise) {
        annoText = `This local wave emerged the fastest of all waves in ${region2}.`;
      } else if (regFall == maxReg2Fall) {
        annoText = `This local wave was ${region2}'s fastest falling.`;
      }

      if (annoText.length)
        annotations.push(
          writeText(
            annoText,
            reg2Wave.fall._end,
            region2CasesData,
            false,
            region2Color,
          ),
        );
    }

    // Discuss the fall of the wave in region 1
    if (reg1Wave) {
      annotations.push(
        writeText(
          `${region1} ${ordinal(reg1WaveN)} wave ${
            reg1Wave.fall.normGrad <= SLOW_THRESH
              ? "slowly falls back down"
              : reg1Wave.fall.rank >= STEEP_THRESH
              ? "rapidly declines"
              : "steadily reduces"
          }.`,
          reg1Wave.fall._end,
          region1CasesData,
          false,
          region1Color,
          true,
        ),
      );

      annoText = "";
      const regRise = reg1Wave.rise;
      const regFall = reg1Wave.fall;
      if (regRise == maxReg1Rise && regFall == maxReg1Fall) {
        annoText = `This wave was the fastest rising and falling of all of ${region1}'s waves.`;
      } else if (regRise == maxReg1Rise) {
        annoText = `This local wave emerged the fastest of all waves in ${region1}.`;
      } else if (regFall == maxReg1Fall) {
        annoText = `This local wave was ${region1}'s fastest falling.`;
      }

      if (annoText.length)
        annotations.push(
          writeText(
            annoText,
            reg1Wave.fall._end,
            region1CasesData,
            false,
            region1Color,
            true,
          ),
        );
    }

    if (reg1Wave && reg2Wave) {
      annotations.push(
        writeText(
          `In ${region1}, the ${ordinal(reg1WaveN)} wave declines ${
            reg1Wave.fall._normGrad > reg1Wave.fall._normGrad
              ? "quicker"
              : "slower"
          } than in ${region2}.`,
          reg1Wave.fall._end,
          region1CasesData,
          false,
          region1Color,
          true,
        ),
      );
    }

    if (reg1Wave) prev1Wave = reg1Wave;
    if (reg2Wave) prev2Wave = reg2Wave;
  }

  if (
    !annotations.find(
      (a: any) => !a.useData2 && a.end == region2CasesData.length - 1,
    )
  ) {
    annotations.push({ end: region2CasesData.length - 1, color: region2Color });
  }

  if (
    !annotations.find(
      (a: any) => a.useData2 && a.end == region1CasesData.length - 1,
    )
  ) {
    annotations.push({
      end: region1CasesData.length - 1,
      useData2: true,
      color: region1Color,
    });
  }

  const reg2Annos = annotations.filter((a: any) => !a.useData2);
  const reg1Annos = annotations.filter((a): any => a.useData2);

  reg2Annos.slice(1).forEach((anno, i) => (anno.start = reg2Annos[i].end));
  reg1Annos.slice(1).forEach((anno, i) => (anno.start = reg1Annos[i].end));
}

const writeText = (
  text,
  date,
  data,
  showRedCircle = false,
  color = "black",
  isSecondaryData = false,
) => {
  // Find idx of event in data and set location of the annotation in opposite half of graph
  const idx = findDateIdx(date, data);

  const target = data[idx];

  const anno = new GraphAnnotation()
    .title(date.toLocaleDateString())
    .label(text)
    .backgroundColor("#EEE")
    .wrap(500);

  // @ts-expect-error -- investigate
  anno.left = idx < data.length / 2;
  anno.unscaledTarget = [target.date, target.y];

  if (showRedCircle) {
    anno.circleHighlight();
  }

  return {
    end: idx,
    annotation: anno,
    date: date,
    fadeout: true,
    color: color,
    useData2: isSecondaryData,
  };
};

export function createTimeSeriesSVG(region1, region2, selector: string) {
  visCtx = TimeSeries.animationSVG(1200, 400, selector);

  const region1CasesData = dailyCasesByRegion[region1].data;
  const region2CasesData = dailyCasesByRegion[region2].data;

  ts = new TimeSeries(region2CasesData, selector)
    .border(60)
    .addExtraDatasets(createDataGroup([region1CasesData]), true)
    .svg(visCtx)
    .annoTop()
    .title(`Comparison of waves between ${region1} and ${region2}`)
    .yLabel("Cases per Day")
    .ticks(30);

  const xSc = ts.getXScale();
  const ySc = ts.getYScale();
  const ySc2 = ts.getYScale2();

  let annObj;
  annotations.forEach((a) => {
    annObj = a.annotation;
    if (annObj) {
      annObj.x(xSc(annObj.unscaledTarget[0])).y(ts._height / 2);

      annObj.target(
        xSc(annObj.unscaledTarget[0]),
        a.useData2
          ? ySc2(annObj.unscaledTarget[1])
          : ySc(annObj.unscaledTarget[1]),
        true,
        { left: annObj.left, right: !annObj.left },
      );
    }
  });
}

//
// When play animate button is clicked draw there
//

export function updateCounter(inc: number) {
  // prettier-ignore
  console.log("utils-story-2: updateCounter: counter = ", counter, ", inc = ", inc);

  if (inc === 0) {
    counter = 0;
  } else if (counter + inc >= 0 && counter + inc <= maxCounter) {
    counter += inc;
  }
  console.log("utils-story-2: updateCounter: counter = ", counter);

  ts.animate(annotations, counter, visCtx).plot();
}
