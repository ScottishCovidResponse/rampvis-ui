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

export async function processDataAndGetRegions(): Promise<string[]> {
  await createDailyCasesByRegion();
  createPeaksByRegion();

  return Object.keys(dailyCasesByRegion).sort();
}

//
//
//
const dailyCasesByRegion = {};

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

const peaksByRegion = {};
let wavesByRegion = {};

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

    peaksByRegion[region] = allPeaks;
  }

  wavesByRegion = peaksByRegion;
  // prettier-ignore
  console.log("createPeaksByRegion: peaksByRegion/wavesByRegion = ", peaksByRegion);
}

//
//
//
let region1, region2;
export function onSelectRegion(_region1, _region2) {
  region1 = _region1;
  region2 = _region2;
  createCombGauss(region1, region2);
  calculateGaussMatchedWaves(region1, region2);
  createAnnotations(region1, region2);
}

//
//
//

let gauss;

function createCombGauss(region1, region2) {
  const reg1Waves = wavesByRegion[region1];
  const reg2Waves = wavesByRegion[region2];

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
  const combGauss = combineBounds([reg1Bounds, reg2Bounds]);

  gauss = combGauss;
  console.log("createCombGauss: combGauss/gauss = ", gauss);
}

//
//
//
let gaussMatchedWaves;

function calculateGaussMatchedWaves(region1, region2) {
  const peakTimeDistance = (p1, p2) =>
    Math.abs(p1._date.getTime() - p2._date.getTime());

  const reg1DailyCases = dailyCasesByRegion[region1].data;
  const reg2DailyCases = dailyCasesByRegion[region2].data;

  const largestDataSet =
    reg1DailyCases.length > reg2DailyCases.length
      ? reg1DailyCases
      : reg2DailyCases;

  const gaussTS = gauss.map((g, i) => {
    return { date: largestDataSet[i].date, y: g };
  });

  let gaussPeaks = detectFeatures(gaussTS, {
    peaks: true,
  });

  const reg1Waves = wavesByRegion[region1];
  const reg2Waves = wavesByRegion[region2];

  let closestReg1Wave, closestReg2Wave;
  // Match gauss to corresponding regional and national waves
  gaussPeaks = gaussPeaks.map((gp) => {
    closestReg1Wave = reg1Waves.reduce((closest, curr) =>
      peakTimeDistance(closest.peak, gp) < peakTimeDistance(curr.peak, gp)
        ? closest
        : curr,
    );
    closestReg2Wave = reg2Waves.reduce((closest, curr) =>
      peakTimeDistance(closest.peak, gp) < peakTimeDistance(curr.peak, gp)
        ? closest
        : curr,
    );

    return {
      gaussHeight: gp.height,
      reg1Wave: closestReg1Wave,
      reg2Wave: closestReg2Wave,
    };
  });

  // Sort based on gauss rank
  gaussPeaks.sort((gp1, gp2) => gp1.guassHeight - gp2.gaussHeight);
  gaussMatchedWaves = gaussPeaks;
  // prettier-ignore
  console.log("calculateGaussMatchedWaves: gaussMatchedWaves = ", gaussMatchedWaves);
}

//
//
//

let annotations;

function createAnnotations(region1, region2) {
  const region1CasesData = dailyCasesByRegion[region1].data;
  const region1Waves = wavesByRegion[region1];
  const region1Color = "orange";

  const region2CasesData = dailyCasesByRegion[region2].data;
  const region2Waves = wavesByRegion[region2];
  const region2Color = "steelblue";

  const waveNum = region1Waves.length;
  const cutOff = Math.ceil(waveNum * 0.3);

  const matchedWaves = gaussMatchedWaves;

  // prettier-ignore
  console.log("onSelectRegion: matchedWaves = ", gaussMatchedWaves, "cutOff = ", cutOff);

  const topWaves = matchedWaves.slice(-cutOff);

  const maxReg1Wave = topWaves[topWaves.length - 1].reg1Wave;
  const maxReg2Wave = topWaves[topWaves.length - 1].reg2Wave;

  const maxReg1Rise = d3.max(topWaves.map((w) => w.reg1Wave.rise._normGrad));
  const maxReg1Fall = d3.max(topWaves.map((w) => w.reg1Wave.fall._normGrad));

  const maxReg2Rise = d3.max(topWaves.map((w) => w.reg2Wave.rise._normGrad));
  const maxReg2Fall = d3.max(topWaves.map((w) => w.reg2Wave.fall._normGrad));

  topWaves.sort((w1, w2) => w1.reg1Wave.peak._date - w2.reg1Wave.peak._date);

  const STEEP_THRESH = 0.004;
  const SLOW_THRESH = 0.002;

  const graphAnnos: any = [{ start: 0, end: 0 }];
  let annoText = "";
  for (let i = 0; i < cutOff; i++) {
    const n = i + 1;
    const ordinal = n + (n == 1 ? "st" : n == 2 ? "nd" : n == 3 ? "rd" : "th");

    const { reg1Wave, reg2Wave } = topWaves[i];

    graphAnnos.push(
      writeText(
        `${ordinal} wave in ${region2} starts to ${
          reg2Wave.rise._normGrad > STEEP_THRESH ? "quickly" : "slowly"
        } rise.`,
        reg2Wave.rise._start,
        region2CasesData,
        false,
        region2Color,
      ),
    );

    graphAnnos.push(
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

    if (i > 0) {
      const prevWave = topWaves[i - 1].reg2Wave;
      const prevH = prevWave.peak.height;
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

      graphAnnos.push(
        writeText(
          annoText,
          reg2Wave.peak._date,
          region2CasesData,
          false,
          region2Color,
        ),
      );
    }

    graphAnnos.push(
      writeText(
        `${ordinal} local wave in ${region1} begins to rise ${
          reg1Wave.rise._normGrad > STEEP_THRESH ? "rapidly" : "steadily"
        }.`,
        reg1Wave.rise._start,
        region1CasesData,
        false,
        region1Color,
        true,
      ),
    );

    graphAnnos.push(
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

    const daysBetween =
      (reg1Wave.peak._date.getTime() - reg2Wave.peak._date.getTime()) /
      (1000 * 3600 * 24);

    annoText = "";
    if (daysBetween == 0) {
      annoText = "Both waves peak on the same day.";
    } else {
      annoText = `Peak of the ${region1} wave is ${Math.abs(
        daysBetween,
      )} days ${daysBetween > 0 ? "before" : "after"} the ${region2} wave.`;
    }
    graphAnnos.push(
      writeText(
        annoText,
        reg1Wave.peak._date,
        region1CasesData,
        false,
        region1Color,
        true,
      ),
    );

    if (i > 0) {
      const prevWave = topWaves[i - 1].reg1Wave;
      const prevH = prevWave.peak.height;
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

      graphAnnos.push(
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

    graphAnnos.push(
      writeText(
        `${region2} ${ordinal} wave ${
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

    graphAnnos.push(
      writeText(
        `In ${region1}, the ${ordinal} wave declines ${
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

    annoText = "";
    const regRise = reg1Wave.rise._normGrad;
    const regFall = reg1Wave.fall._normGrad;
    if (regRise == maxReg1Rise && regFall == maxReg1Fall) {
      annoText =
        "This wave was the fastest rising and falling of all of ${region1}'s' waves.";
    } else if (regRise == maxReg1Rise) {
      annoText = `This local wave emerged the fastest of all waves in ${region1}.`;
    } else if (regFall == maxReg1Fall) {
      annoText = `This local wave was ${region1}'s fastest falling.`;
    }
  }

  if (
    !graphAnnos.find(
      (a: any) => !a.useData2 && a.end == region2CasesData.length - 1,
    )
  ) {
    graphAnnos.push({ end: region2CasesData.length - 1, color: region2Color });
  }

  if (
    !graphAnnos.find(
      (a: any) => a.useData2 && a.end == region1CasesData.length - 1,
    )
  ) {
    graphAnnos.push({
      end: region1CasesData.length - 1,
      useData2: true,
      color: region1Color,
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
  const region1CasesData = dailyCasesByRegion[region1].data;
  const region2CasesData = dailyCasesByRegion[region2].data;

  const ts = new TimeSeries(region2CasesData, selector)
    .border(60)
    .addExtraDatasets(createDataGroup([region1CasesData]), true)
    .svg(visCtx)
    .annoTop()
    .title(`Comparison of waves between ${region1} and ${region2}.`)
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

  // legends
  // const key = d3
  //   .select(visCtx)
  //   .append("g")
  //   .attr("transform", "translate(70,50)");
  //
  // key.append("text").text("Key");
  // key
  //   .append("rect")
  //   .style("fill", "orange")
  //   .attr("width", 10)
  //   .attr("height", 10)
  //   .attr("y", 10);
  //
  // key
  //   .append("text")
  //   .attr("y", 20)
  //   .attr("x", 15)
  //   .style("font-size", 12)
  //   .text(`${region1} Weekly Average of Cases`);
  //
  // key
  //   .append("rect")
  //   .style("fill", "steelblue")
  //   .attr("width", 10)
  //   .attr("height", 10)
  //   .attr("y", 30);
  //
  // key
  //   .append("text")
  //   .attr("y", 40)
  //   .attr("x", 15)
  //   .style("font-size", 12)
  //   .text(`${region2} Weekly Average of Cases`);
}
