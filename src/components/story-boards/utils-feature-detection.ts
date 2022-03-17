//
// Ported from https://observablehq.com/@scottwjones/feature-detection
//

import * as d3 from "d3";
import { Fall } from "./Fall";
import minIndex from "./min-index";
import maxIndex from "./max-index";
import { Peak } from "./Peak";
import { Rise } from "./Raise";

export const findDateIdx = (date, data) =>
  data.findIndex((d) => d.date.getTime() == date.getTime());

// Min-Max normalisation of data of the form [x0,x1,...xN]
export const normalise = (data) => {
  // Get min and maxvalues from data (for normalisation)
  const [min, max] = data
    .slice(1)
    .reduce(
      (res, d) => [Math.min(d, res[0]), Math.max(d, res[1])],
      [data[0], data[0]],
    );

  // Normalise y values to be between 0 and 1 using min-max
  return data.map((d) => (d - min) / (max - min));
};

/*
  Function to discover the end of a peak.
  We move forwards from the peak until the gradient stops being mostly negative.
*/

export const detectPeakEnd = (peakIdx, norm) => {
  const deltas = [];

  let i = peakIdx;

  for (; i < peakIdx + 20 && i < norm.length; i++) {
    deltas[i % 20] = norm[i + 1] - norm[i] < 0;
  }

  // Until line has a great majority of negative deltas keep incrementing i
  while (i < norm.length && deltas.reduce((sum, bool) => sum + bool) > 8) {
    deltas[i % 20] = norm[i + 1] - norm[i] < 0;
    i++;
  }

  // Extract line segment
  const segment = norm.slice(peakIdx, i + 1);
  const minIdx = peakIdx + minIndex(segment);

  return Math.min(Math.min(i, minIdx), norm.length - 1);
};

/*
  Function to discover the start of a peak.
  We move backwards from the peak until the gradient stops being mostly negative.
*/
export const detectPeakStart = (peakIdx, norm) => {
  const deltas = [];

  let i = peakIdx;

  for (; i > peakIdx - 20 && i >= 0; i--) {
    deltas[i % 20] = norm[i - 1] - norm[i] < 0;
  }

  // Until line has a great majority of negative deltas keep incrementing i
  while (i >= 0 && deltas.reduce((sum, bool) => sum + bool) > 8) {
    deltas[i % 20] = norm[i - 1] - norm[i] < 0;
    i--;
  }

  // Extract line segment
  const segment = norm.slice(i, peakIdx);
  const minIdx = i + minIndex(segment);

  return Math.max(Math.max(i, minIdx), 0);
};

/*
  Basic function that finds max points in a window.
  Based on height difference between window midpoint and edges.
*/

export const detectMaxes = (timeSeriesData, window = 30) => {
  const centre = Math.floor((window - 1) / 2); // Calculate window centre
  const maxes = [];

  let start, midPnt, end, diff1, diff2;
  for (let i = 0; i < timeSeriesData.length - window; i++) {
    start = i;
    midPnt = start + centre;
    end = start + window;

    diff1 = timeSeriesData[midPnt].y - timeSeriesData[start].y;
    diff2 = timeSeriesData[midPnt].y - timeSeriesData[end].y;

    // Max detected if midpoint above start and end
    if (diff1 > 0 && diff2 > 0) maxes.push(midPnt);
  }
  return maxes;
};

/*
  Main Peak finding function.
  For defined window sizes we detect peaks in segments.
  We remove duplicates and then remove peaks that are part of a larger peak.
*/

export const detectPeaks = (timeSeriesData, metric = undefined) => {
  const peaks = [];
  const maxes = detectMaxes(timeSeriesData, 5);
  const norm = normalise(timeSeriesData.map((o) => o.y));

  let start, end;
  for (const idx of maxes) {
    start = detectPeakStart(idx, norm);
    end = detectPeakEnd(idx, norm);

    peaks.push(
      new Peak()
        .setDate(timeSeriesData[idx].date)
        .setStart(timeSeriesData[start].date)
        .setEnd(timeSeriesData[end].date)
        .setHeight(timeSeriesData[idx].y)
        .setMetric(metric)
        .setNormWidth((end - start) / norm.length)
        .setNormHeight(norm[idx]),
    );
  }

  // Sort from lowest to highest
  peaks.sort((p1, p2) => p1.height - p2.height);

  // Peak intersection detection function
  const peaksIntersect = (p1, p2) => {
    const p1PeakIdx = findDateIdx(p1._date, timeSeriesData);
    const p2PeakIdx = findDateIdx(p2._date, timeSeriesData);

    return (
      (p1PeakIdx <= findDateIdx(p2._end, timeSeriesData) &&
        p1PeakIdx >= findDateIdx(p2._start, timeSeriesData)) ||
      (p2PeakIdx <= findDateIdx(p1._end, timeSeriesData) &&
        p2PeakIdx >= findDateIdx(p1._start, timeSeriesData))
    );
  };

  // For each peak if there is a larger peak that intersects it do not add to uniquePeaks
  const uniquePeaks = [];
  peaks.forEach((p1, i) => {
    const largerPeaks = peaks.slice(i + 1);
    const intersect = largerPeaks.find((p2) => peaksIntersect(p1, p2));
    if (!intersect) uniquePeaks.push(p1);
  });

  return uniquePeaks;
};

/*
  Fall detection function.
  Using a window size of 20 we count the number of negative gradients.
  If this number is above a threshold we keep sliding the window.
  Once our bool fails we save segment in falls array and continue searching.
*/

export const detectFalls = (timeSeriesData, metric = undefined) => {
  // Normalise y values between 0 and 1
  const norm = normalise(timeSeriesData.map((o) => o.y));
  const falls = [];
  const deltas = [];
  let start, mid, end, segment, normW, normGrad, grad, height, maxIdx, minIdx;

  let i = (start = end = 0);
  // Continue looping till we have looked at every point
  while (i + 20 < norm.length) {
    for (; i < end + 20 && i < norm.length - 1; i++) {
      deltas[i % 20] = norm[i + 1] - norm[i] < -0.001;
    }

    if (i >= norm.length - 1) continue;

    // While line does not have a majority negative deltas keep incrementing i
    while (
      i < norm.length - 1 &&
      !(deltas.reduce((sum, bool) => sum + bool) > 5)
    ) {
      deltas[i % 20] = norm[i + 1] - norm[i] < -0.001;
      i++;
    }

    if (i >= norm.length - 1) continue;
    start = i == 20 ? 0 : i - 15;

    // Until line has a great majority of negative deltas keep incrementing i
    while (
      i < norm.length - 1 &&
      deltas.reduce((sum, bool) => sum + bool) > 5
    ) {
      deltas[i % 20] = norm[i + 1] - norm[i] < 0;
      i++;
    }
    end = i >= norm.length - 1 ? norm.length - 1 : i - 15;

    // Extract line segment
    segment = norm.slice(start, end + 1);
    maxIdx = start + maxIndex(segment);
    minIdx = start + minIndex(segment);

    // Trim line so no overflowing segements
    start = Math.max(maxIdx, start); // Should start at the highest point
    end = Math.min(minIdx, end); // Should end at the lowest point
    mid = Math.floor((start + end) / 2);

    height = Math.abs(timeSeriesData[end].y - timeSeriesData[start].y);
    grad = height / (end - start);

    normW = (end - start) / norm.length; // Ratio of length of segment and total data size.
    normGrad = Math.abs((norm[end] - norm[start]) / normW);

    // If the increase in y is passed a certain threshold add to rises array.
    if (norm[end] - norm[start] < -normW * 0.6) {
      falls.push(
        new Fall()
          .setDate(timeSeriesData[mid].date)
          .setStart(timeSeriesData[start].date)
          .setEnd(timeSeriesData[end].date)
          .setHeight(height)
          .setMetric(metric)
          .setGrad(grad)
          .setNormGrad(normGrad),
      );
      i = end;
    }

    i++;
  }
  return falls;
};

/*
  Rise detection function.
  Using a window size of 20 we count the number of positive gradients.
  If this number is above a threshold we keep sliding the window.
  Once our bool fails we save segment in rises array and continue searching.
*/

export const detectRises = (timeSeriesData, metric = undefined) => {
  // Normalise y values between 0 and 1
  const norm = normalise(timeSeriesData.map((o) => o.y));

  const rises = [];
  const deltas = [];
  const rDeltas = [];
  let start, mid, end, segment, normW, normGrad, grad, height, maxIdx, minIdx;

  let i = (start = end = 0);
  // Continue looping till we have looked at every point
  while (i + 20 < norm.length) {
    for (; i < end + 20 && i < norm.length - 1; i++) {
      deltas[i % 20] = norm[i + 1] - norm[i] > 0.001;
    }

    if (i >= norm.length - 1) continue;

    // While line does not have a majority positive deltas keep incrementing i
    while (
      i < norm.length - 1 &&
      !(deltas.reduce((sum, bool) => sum + bool) > 5)
    ) {
      deltas[i % 20] = norm[i + 1] - norm[i] > 0.001;
      i++;
    }
    if (i >= norm.length - 1) continue;
    start = i == 20 ? 0 : i - 10;

    // Until line has a great majority of negative deltas keep incrementing i
    while (
      i < norm.length - 1 &&
      deltas.reduce((sum, bool) => sum + bool) > 5
    ) {
      deltas[i % 20] = norm[i + 1] - norm[i] > 0;
      i++;
    }
    end = i >= norm.length - 1 ? norm.length - 1 : i - 15;

    // Extract line segment
    segment = norm.slice(start, end + 1);
    maxIdx = start + maxIndex(segment);
    minIdx = start + minIndex(segment);

    // Trim line so no overflowing segements
    start = Math.max(minIdx, start); // Should start at the minimum point
    end = Math.min(maxIdx, end); // Should end at the maximum point
    mid = Math.floor((start + end) / 2);

    height = Math.abs(timeSeriesData[end].y - timeSeriesData[start].y);
    grad = height / (end - start);

    normW = (end - start) / norm.length; // Ratio of length of segment and total data size.
    normGrad = Math.abs((norm[end] - norm[start]) / normW);

    // If the decrease in y is passed a certain threshold add to rises array.
    if (norm[end] - norm[start] > normW * 0.6) {
      rises.push(
        new Rise()
          .setDate(timeSeriesData[mid].date)
          .setStart(timeSeriesData[start].date)
          .setEnd(timeSeriesData[end].date)
          .setHeight(height)
          .setGrad(grad)
          .setMetric(metric)
          .setNormGrad(normGrad),
      );
      i = end;
    }

    i++;
  }

  return rises;
};

/*
  Options should be object stating selection of features {rises: true, falls: false, peaks: true}.
  All features default to being false (unselected) if unmentioned options.
  From this selection we will return an array data events representing detected features in the data.
*/
export const detectFeatures = function (timeSeriesData, options) {
  const features = []
    .concat(options.rises ? detectRises(timeSeriesData) : [])
    .concat(options.falls ? detectFalls(timeSeriesData) : [])
    .concat(options.peaks ? detectPeaks(timeSeriesData) : []);

  if (options.metric) {
    features.forEach((f) => f.setMetric(options.metric));
  }

  console.log("detectFeatures: features = ", features);

  return features.sort((e1, e2) => e1.rank - e2.rank);
};
