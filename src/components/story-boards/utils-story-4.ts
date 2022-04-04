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

//
// Region data
//

// {
//   { Aberdeenshire: { "country": "Scotland", "data": [{ "date": "", "y": 0 }, ..] }  },
//   { ... }
// },
const dailyCasesByRegion = {};

// {
//   { Aberdeenshire: { "peak": Peak, "rise": Raise, "fall": Fall  }  },
//   { ... }
// },
const wavesByRegion = {};

export async function processDataAndGetRegions(): Promise<string[]> {
  await createDailyCasesByRegion();
  createPeaksByRegion();

  return Object.keys(dailyCasesByRegion).sort();
}

async function createDailyCasesByRegion() {
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

    if (!dailyCasesByRegion[region])
      dailyCasesByRegion[region] = { country: country, data: [] };

    dailyCasesByRegion[region].data.push({ date: date, y: cases });
  });

  for (const region in dailyCasesByRegion) {
    dailyCasesByRegion[region].data.sort((e1, e2) => e1.date - e2.date);
  }

  // prettier-ignore
  console.log("createDailyCasesByRegion: dailyCasesByRegion = ", dailyCasesByRegion);
}

function createPeaksByRegion() {
  for (const region in dailyCasesByRegion) {
    let allPeaks = detectFeatures(dailyCasesByRegion[region].data, {
      peaks: true,
      metric: "Daily Cases",
    });

    allPeaks = allPeaks.map((p) => {
      const { rise, fall } = calcPeakRiseFall(
        p,
        dailyCasesByRegion[region].data,
      );
      return { peak: p, rise: rise, fall: fall };
    });

    allPeaks.map(rankFeatures);
    wavesByRegion[region] = allPeaks;
  }

  // prettier-ignore
  console.log("createPeaksByRegion: wavesByRegion = ", wavesByRegion);
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

const rankFeatures = (featureObj) => {
  const { peak, rise, fall } = featureObj;

  peak.setRank(peak._normHeight * 5);
  rise.setRank(2);
  fall.setRank(1);
};

//
// Nation data
//
let dailyCasesByNation = {};
const wavesByNation = {};

export async function processDataAndGetNations(): Promise<string[]> {
  await prepareDailyCasesByNation();
  preparePeaksByNation();

  return Object.keys(dailyCasesByNation).sort();
}

async function prepareDailyCasesByNation() {
  const csv = await readCSVFile("/static/story-boards/nation_cases.csv");

  const casesObj = {};
  csv.forEach((d) => {
    // there is a undefined value in the areaName, exclude it
    if (d.areaName) {
      if (!casesObj[d.areaName]) {
        casesObj[d.areaName] = [];
      }
      casesObj[d.areaName].push({
        date: new Date(d.date),
        y: +d.newCasesByPublishDate,
      });
    }
  });

  for (const nation in casesObj) {
    casesObj[nation].sort((r1, r2) => r1.date - r2.date);
  }

  dailyCasesByNation = casesObj;

  // prettier-ignore
  console.log("prepareDailyCasesByNation: dailyCasesByNation = ", dailyCasesByNation);
}

function preparePeaksByNation() {
  for (const nation in dailyCasesByNation) {
    let allPeaks = detectFeatures(dailyCasesByNation[nation], {
      peaks: true,
      metric: "Daily Cases",
    });
    allPeaks = allPeaks.map((p) => {
      const { rise, fall } = calcPeakRiseFall(p, dailyCasesByNation[nation]);
      return { peak: p, rise: rise, fall: fall };
    });
    allPeaks.map(rankFeatures);
    wavesByNation[nation] = allPeaks;
  }

  // prettier-ignore
  console.log("preparePeaksByNation: wavesByNation = ", wavesByNation);
}

//
// When a nation and region are selected, return the data for that
//

let nation, region;
let gauss;
let gaussMatchedWaves;
let annotations;

export function onSelectRegion(_nation, _region) {
  nation = _nation;
  region = _region;
  createCombGauss(nation, region);
  calculateGaussMatchedWaves(nation, region);
  createAnnotations(nation, region);
}

function createCombGauss(nation, region) {
  const nationWaves = wavesByNation[nation];
  const regionWaves = wavesByRegion[region];

  const nationPeaks = nationWaves.reduce(
    (arr, obj) => arr.concat([obj.peak]),
    [],
  );
  const regionPeaks = regionWaves.reduce(
    (arr, obj) => arr.concat([obj.peak]),
    [],
  );

  const nationDailyCases = dailyCasesByNation[nation];
  const regionDailyCases = dailyCasesByRegion[region].data;

  const largestDataSet =
    nationDailyCases.length > regionDailyCases.length
      ? nationDailyCases
      : regionDailyCases;

  const nationGauss = eventsToGaussian(nationPeaks, largestDataSet);
  const nationBounds = maxBounds(nationGauss);

  const regionGauss = eventsToGaussian(regionPeaks, largestDataSet);
  const regionBounds = maxBounds(regionGauss);

  // Combine gaussian time series
  gauss = combineBounds([nationBounds, regionBounds]);

  console.log("createCombGauss: gauss = ", gauss);
}

function calculateGaussMatchedWaves(nation, region) {
  const peakTimeDistance = (p1, p2) =>
    Math.abs(p1._date.getTime() - p2._date.getTime());

  const nationDailyCases = dailyCasesByNation[nation];
  const regionDailyCases = dailyCasesByRegion[region].data;

  const largestDataSet =
    nationDailyCases.length > regionDailyCases.length
      ? nationDailyCases
      : regionDailyCases;

  const gaussTS = gauss.map((g, i) => {
    return { date: largestDataSet[i].date, y: g };
  });

  let gaussPeaks = detectFeatures(gaussTS, {
    peaks: true,
  });

  const nationWaves = wavesByNation[nation];
  const regionWaves = wavesByRegion[region];

  let closestNationWave, closestRegionWave;
  // Match gauss to corresponding regional and national waves
  gaussPeaks = gaussPeaks.map((gp) => {
    closestNationWave = nationWaves.reduce((closest, curr) =>
      peakTimeDistance(closest.peak, gp) < peakTimeDistance(curr.peak, gp)
        ? closest
        : curr,
    );
    closestRegionWave = regionWaves.reduce((closest, curr) =>
      peakTimeDistance(closest.peak, gp) < peakTimeDistance(curr.peak, gp)
        ? closest
        : curr,
    );

    return {
      gaussHeight: gp.height,
      nationWave: closestNationWave,
      regionWave: closestRegionWave,
    };
  });

  // Sort based on gauss rank
  gaussPeaks.sort((gp1, gp2) => gp1.guassHeight - gp2.gaussHeight);
  gaussMatchedWaves = gaussPeaks;
  // prettier-ignore
  console.log("calculateGaussMatchedWaves: gaussMatchedWaves = ", gaussMatchedWaves);
}

function createAnnotations(nation, region) {
  const nationCasesData = dailyCasesByNation[nation];
  const nationWaves = wavesByNation[nation];
  const nationColor = "orange";

  const regionCasesData = dailyCasesByRegion[region].data;
  const regionWaves = wavesByRegion[region];
  const regionColor = "steelblue";

  const waveNum = nationWaves.length;
  const cutOff = Math.ceil(waveNum * 0.3);

  const matchedWaves = gaussMatchedWaves;

  // prettier-ignore
  console.log("onSelectRegion: matchedWaves = ", gaussMatchedWaves, "cutOff = ", cutOff);

  const topWaves = matchedWaves.slice(-cutOff);

  const maxNationWave = topWaves[topWaves.length - 1].nationWave;
  const maxRegionWave = topWaves[topWaves.length - 1].regionWave;

  const maxNationRise = d3.max(
    topWaves.map((w) => w.nationWave.rise._normGrad),
  );
  const maxNationFall = d3.max(
    topWaves.map((w) => w.nationWave.fall._normGrad),
  );

  const maxRegionRise = d3.max(
    topWaves.map((w) => w.regionWave.rise._normGrad),
  );
  const maxRegionFall = d3.max(
    topWaves.map((w) => w.regionWave.fall._normGrad),
  );

  topWaves.sort(
    (w1, w2) => w1.nationWave.peak._date - w2.nationWave.peak._date,
  );

  const STEEP_THRESH = 0.004;
  const SLOW_THRESH = 0.002;

  const graphAnnos: any = [{ start: 0, end: 0 }];
  let annoText = "";
  for (let i = 0; i < cutOff; i++) {
    const n = i + 1;
    const ordinal = n + (n == 1 ? "st" : n == 2 ? "nd" : n == 3 ? "rd" : "th");

    const { nationWave, regionWave } = topWaves[i];

    graphAnnos.push(
      writeText(
        `${ordinal} wave in ${region} starts to ${
          regionWave.rise._normGrad > STEEP_THRESH ? "quickly" : "slowly"
        } rise.`,
        regionWave.rise._start,
        regionCasesData,
        false,
        regionColor,
      ),
    );

    graphAnnos.push(
      writeText(
        `Wave reaches ${Math.round(regionWave.peak.height)} ${
          regionWave.peak.metric
        }.`,
        regionWave.peak._date,
        regionCasesData,
        true,
        regionColor,
      ),
    );

    if (i > 0) {
      const prevWave = topWaves[i - 1].regionWave;
      const prevH = prevWave.peak.height;
      const currH = regionWave.peak.height;

      annoText = "";

      const hRatio = Math.max(prevH, currH) / Math.min(prevH, currH);

      if (regionWave == maxRegionWave) {
        annoText = `This was the greatest wave ${region} has experienced.`;
      } else if (hRatio >= 0.8 && hRatio <= 1.2) {
        annoText = `This wave was similar in size to the ${region}'s previous peak.`;
      } else {
        annoText = `This was ${hRatio > 1.5 ? "far" : "slightly"} ${
          currH > prevH ? "greater" : "smaller"
        } than ${region}'s last wave.`;
      }

      graphAnnos.push(
        writeText(
          annoText,
          regionWave.peak._date,
          regionCasesData,
          false,
          regionColor,
        ),
      );
    }

    graphAnnos.push(
      writeText(
        `${ordinal} local wave in ${nation} begins to rise ${
          nationWave.rise._normGrad > STEEP_THRESH ? "rapidly" : "steadily"
        }.`,
        nationWave.rise._start,
        nationCasesData,
        false,
        nationColor,
        true,
      ),
    );

    graphAnnos.push(
      writeText(
        `Wave reaches ${Math.round(nationWave.peak.height)} ${
          nationWave.peak.metric
        }.`,
        nationWave.peak._date,
        nationCasesData,
        true,
        nationColor,
        true,
      ),
    );

    const daysBetween =
      (nationWave.peak._date.getTime() - regionWave.peak._date.getTime()) /
      (1000 * 3600 * 24);

    annoText = "";
    if (daysBetween == 0) {
      annoText = "Both waves peak on the same day.";
    } else {
      annoText = `Peak of the ${nation} wave is ${Math.abs(daysBetween)} days ${
        daysBetween > 0 ? "before" : "after"
      } the ${region} wave.`;
    }
    graphAnnos.push(
      writeText(
        annoText,
        nationWave.peak._date,
        nationCasesData,
        false,
        nationColor,
        true,
      ),
    );

    if (i > 0) {
      const prevWave = topWaves[i - 1].nationWave;
      const prevH = prevWave.peak.height;
      const currH = nationWave.peak.height;

      annoText = "";

      const hRatio = Math.max(prevH, currH) / Math.min(prevH, currH);

      if (nationWave == maxNationWave) {
        annoText = `This was the greatest wave ${nation} has experienced.`;
      } else if (hRatio >= 0.8 && hRatio <= 1.2) {
        annoText = "This wave is similar in size to the previous local wave.";
      } else {
        annoText = `This was ${hRatio > 1.5 ? "far" : "slightly"} ${
          currH > prevH ? "greater" : "lower"
        } than ${nation}'s last wave.`;
      }

      graphAnnos.push(
        writeText(
          annoText,
          nationWave.peak._date,
          nationCasesData,
          false,
          nationColor,
          true,
        ),
      );
    }

    graphAnnos.push(
      writeText(
        `${region} ${ordinal} wave ${
          regionWave.fall.normGrad <= SLOW_THRESH
            ? "slowly falls back down"
            : regionWave.fall.rank >= STEEP_THRESH
            ? "rapidly declines"
            : "steadily reduces"
        }.`,
        regionWave.fall._end,
        regionCasesData,
        false,
        regionColor,
      ),
    );

    graphAnnos.push(
      writeText(
        `In ${nation}, the ${ordinal} wave declines ${
          nationWave.fall._normGrad > nationWave.fall._normGrad
            ? "quicker"
            : "slower"
        } than in ${region}.`,
        nationWave.fall._end,
        nationCasesData,
        false,
        nationColor,
        true,
      ),
    );

    annoText = "";
    const regRise = nationWave.rise._normGrad;
    const regFall = nationWave.fall._normGrad;
    if (regRise == maxNationRise && regFall == maxNationFall) {
      annoText =
        "This wave was the fastest rising and falling of all of ${region1}'s' waves.";
    } else if (regRise == maxNationRise) {
      annoText = `This local wave emerged the fastest of all waves in ${nation}.`;
    } else if (regFall == maxNationFall) {
      annoText = `This local wave was ${nation}'s fastest falling.`;
    }
  }

  if (
    !graphAnnos.find(
      (a: any) => !a.useData2 && a.end == regionCasesData.length - 1,
    )
  ) {
    graphAnnos.push({ end: regionCasesData.length - 1, color: regionColor });
  }

  if (
    !graphAnnos.find(
      (a: any) => a.useData2 && a.end == nationCasesData.length - 1,
    )
  ) {
    graphAnnos.push({
      end: nationCasesData.length - 1,
      useData2: true,
      color: nationColor,
    });
  }

  const reg2Annos = graphAnnos.filter((a: any) => !a.useData2);
  const reg1Annos = graphAnnos.filter((a): any => a.useData2);

  reg2Annos.slice(1).forEach((anno, i) => (anno.start = reg2Annos[i].end));
  reg1Annos.slice(1).forEach((anno, i) => (anno.start = reg1Annos[i].end));

  annotations = graphAnnos;
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

//
// Create SVG
// When play animate button is clicked draw there
//

let visCtx;

export function createTimeSeriesSVG(selector: string) {
  visCtx = TimeSeries.animationSVG(1200, 400, selector);
}

export function onClickAnimate(animationCounter: number, selector: string) {
  console.log("onClickAnimate: ", nation, region);
  console.log(
    "onClickAnimate",
    dailyCasesByNation[nation],
    dailyCasesByRegion[region],
  );

  const nationCasesData = dailyCasesByNation[nation];
  const regionCasesData = dailyCasesByRegion[region].data;

  const ts = new TimeSeries(regionCasesData, selector)
    .border(60)
    .addExtraDatasets(createDataGroup([nationCasesData]), true)
    .svg(visCtx)
    .annoTop()
    .title(`Comparison of waves between ${nation} and ${region}`)
    .yLabel("Cases per Day")
    .ticks(30);

  const xSc = ts.getXScale();
  const ySc = ts.getYScale();
  const ySc2 = ts.getYScale2();

  let annoObj;
  annotations.forEach((a) => {
    annoObj = a.annotation;
    if (annoObj) {
      annoObj.x(xSc(annoObj.unscaledTarget[0])).y(ts._height / 2);

      annoObj.target(
        xSc(annoObj.unscaledTarget[0]),
        a.useData2
          ? ySc2(annoObj.unscaledTarget[1])
          : ySc(annoObj.unscaledTarget[1]),
        true,
        { left: annoObj.left, right: !annoObj.left },
      );
    }
  });

  console.log("utils-story-2.ts: onClickAnimate: annotations = ", annotations);
  console.log("utils-story-2.ts: onClickAnimate: annoObj = ", annoObj);

  ts.animate(annotations, animationCounter, visCtx).plot();
}
