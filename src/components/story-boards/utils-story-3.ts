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

let tl, ts;
let annotations;

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
