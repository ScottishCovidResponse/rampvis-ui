//
// Ported from https://observablehq.com/@scottwjones/ranked-time-series-aggregation-and-segmentation
//

export const splitDataAndEvents = (events, splits, timeSeriesData) => {
  const segNum = splits.length + 1;

  const dataEventsZip = timeSeriesData.map((d) => {
    return {
      date: d.date,
      y: d.y,
      events: events.filter((e) => e._date.getTime() == d.date.getTime()),
    };
  });

  splits.sort((s1, s2) => s1.date - s2.date);
  const dataEventsBySegment = [...Array(segNum)].map((_, i) =>
    splits[i]
      ? dataEventsZip.slice(i > 0 && splits[i - 1].idx, splits[i].idx)
      : dataEventsZip.slice(splits[i - 1].idx),
  );

  return dataEventsBySegment;
};

/*
    Segments gaussian time series at peaks.
    Returns list of peaks ordered to optimise for height and distance from each other.
  */
export const peakSegment = (
  combinedBounds,
  timeSeriesData,
  ignoreHeight = false,
) => {
  const dataLen = timeSeriesData.length;
  const peaks = detectPeaks(
    combinedBounds.map((d, i) => {
      return { date: timeSeriesData[i].date, y: d };
    }),
  );

  // Copy important properties and calculate peak position/index
  export const peaksCpy = peaks.map((o) => {
    return {
      idx: findDateIdx(o._date, timeSeriesData),
      h: o._normHeight,
      date: o._date,
    };
  });

  // Each time we iterate over peaks we remove the next best split point and add it to ordering
  // We are left with an ordered list of splits
  const ordering = [];
  while (peaksCpy.length) {
    let bestPeak;

    // For each remaining peak calculate its score using its height and proximity to other peaks in ordering
    peaksCpy.forEach((v1, idx) => {
      // Calculate smallest distance from current peak to those in ordering array (or edges)
      let closestDist = ordering.reduce(
        (closest, v2) => Math.min(closest, Math.abs(v1.idx - v2.idx)),
        Math.min(v1.idx, dataLen - v1.idx),
      );
      let score = (closestDist / dataLen) * (ignoreHeight || v1.h / 2);

      // The best peak has the highest score - tallest and most distant
      bestPeak =
        bestPeak && bestPeak.score > score
          ? bestPeak
          : { valley: v1, idx: idx, score: score };
    });

    // Remove the best peak from the peaks list and add to ordering
    peaksCpy.splice(bestPeak.idx, 1);
    ordering.push(bestPeak.valley);
  }
  return ordering;
};

/*
    Combines ranked time series by averaging their bounds at each point.
    Takes an array of max bounds as input [bounds1, bounds2, ...].
    Returns a single combined bound.
  */
export const combineBounds = function (bounds) {
  const tsLength = bounds[0].length;
  const nBounds = bounds.length;
  const combination = [...Array(tsLength).fill(0)];
  bounds.forEach((b) => b.forEach((d, i) => (combination[i] += d / nBounds)));
  return combination;
};

/*
    Given a group of gaussian curve it extracts the line that touches the max
    value at each point. 
    Takes an array of gaussians [gauss1, gauss2, ...].
    Returns a value array as output [y1,y2,...yN].
  */
export const maxBounds = function (gaussians) {
  const dataLen = gaussians[0].length;
  const maxResults = [...Array(dataLen).fill(0)];

  gaussians.forEach((g) =>
    g.forEach((d, i) => (maxResults[i] = Math.max(maxResults[i], d))),
  );
  return maxResults;
};

/* 
    Creates a gaussian distribution with mean, height and width parameters.
    DataLen is used to size the return vector to the same length as the
    timeseries data. 
    If width is not specified we calcuate a default one to keep gaussian curves    a similar shape.
  
    Returns array of values [y1, y2, ...].
  */
export const gaussian = function (mean, h, dataLen, w = undefined) {
  const std = w ? w / 3 : (h * 8) / 3;
  const gaus_arr = [...Array(dataLen).fill(0)];
  for (let i = 0; i < dataLen; i++) {
    gaus_arr[i] = h * Math.exp(-((i - mean) ** 2) / (2 * std ** 2));
  }
  return gaus_arr;
};

/*
    Given an an array of events it calculates gaussian curves to represent their ranks.
    Takes array of events [event1, event2, ...].
    Returns array of gaussians as output [gauss1, gauss2, ...].
  */
export const eventsToGaussian = function (events, data) {
  const gaussians = events.map((e) => {
    let dateIdx = findDateIdx(e._date, data);
    return gaussian(dateIdx, e.rank, data.length);
  });

  return gaussians;
};

export const findDateIdx = (date, data) =>
  data.findIndex((d) => d.date.getTime() == date.getTime());
