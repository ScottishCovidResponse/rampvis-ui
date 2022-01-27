import * as d3 from "d3";
import { ScrollingSvg } from "./ScrollingSvg";
import { TimeLine } from "./Timeline";
import { TimeSeries } from "./TimeSeries";
import { readJSONFile } from "./utils-data";

let testDataICU: any;

export async function createData() {
  const parseDate = d3.timeParse("%Y-%m-%d");
  testDataICU = await readJSONFile("/static/story-boards/icuGlasgow.json");
  testDataICU = testDataICU.map(Object.values).map((d) => {
    return { date: parseDate(d[0]), y: d[1] };
  });
}

export function createScrollingSvg(selector) {
  let scrollSvg = ScrollingSvg(
    selector,
    [
      { date: "11th October", description: "This is an example" },
      { date: "16th October", description: "Even more text" },
      { date: "20th December", description: "This would be a description" },
      { date: "12th Jan", description: "This is the last event" },
    ],
    800,
    500,
  );

  console.log("utils-story-3: scrollSvg = ", scrollSvg);
  // prettier-ignore
  console.log("utils-story-3: scrollSvg.graphSvg = ", d3.select(scrollSvg).select("#graphSvg"));

  const ts = new TimeSeries(testDataICU, undefined).svg(
    d3.select(scrollSvg).select("#graphSvg").node(),
  );
  const tl = new TimeLine(testDataICU).svg(
    d3.select(scrollSvg).select("#timelineSvg").node(),
  );
  //d3.select(scrollSvg.graphSvg).selectAll("*").remove();
  //d3.select(scrollSvg.timelineSvg).selectAll("*").remove();
  d3.select(scrollSvg).select("#graphSvg").selectAll("*").remove();
  d3.select(scrollSvg).select("#timelineSvg").selectAll("*").remove();

  const annotations = [
    { start: 0, end: 0 },
    { start: 0, end: 30 },
    { start: 30, end: 35 },
    { start: 35, end: 100 },
    { start: 100, end: testDataICU.length - 1 },
  ];
  tl.annotations(annotations).plot(scrollSvg.event);
  ts.animate(annotations, 0, scrollSvg.event).plot();
}
