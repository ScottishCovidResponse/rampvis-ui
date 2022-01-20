import * as d3 from "d3";
import React, { useEffect } from "react";
import Head from "next/head";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";

import { readJSONFile } from "src/components/story-boards/utils-data";
import { TimeSeries } from "src/components/story-boards/TimeSeries";
import { createDataGroup } from "src/components/story-boards/utils-data-processing";
import { GraphAnnotation } from "src/components/story-boards/GraphAnnotation";
import { TimelineAnnotation } from "src/components/story-boards/TimelineAnnotation";

const StoryBoards = () => {
  useEffect(() => {
    //
    // https://observablehq.com/@scottwjones/graphing-tools-v2
    //
    const parseDate = d3.timeParse("%Y-%m-%d");

    const fetchAndDraw = async () => {
      let testDataICU = await readJSONFile(
        "/static/mock/story-boards-data/icuGlasgow.json",
      );
      // Convert data ITimeSeriesData i.e. [{date: , y: }, ...]
      testDataICU = testDataICU.map(Object.values).map((d) => {
        return { date: parseDate(d[0]), y: d[1] };
      });

      let testDataHosp = await readJSONFile(
        "/static/mock/story-boards-data/hospitalGlasgow.json",
      );
      // Convert to ITimeSeriesData i.e. [{date: , y: }, ...]
      testDataHosp = testDataHosp.map(Object.values).map((d) => {
        return { date: parseDate(d[0]), y: d[1] };
      });

      //
      // 1 plot timeseries
      //
      new TimeSeries(testDataICU, "#chart1")
        .addExtraDatasets(createDataGroup([testDataHosp], ["Purple"]))
        .title("This is a title")
        .xLabel("This is an x-axis title")
        .yLabel("This is a y-axis title")
        .yLabel2("This is another y-axis title")
        .color("red")
        .width(1000)
        .height(300)
        .plot();

      //
      // 2 annotate
      //

      // Create time series and pre-render svg on page

      let ts = new TimeSeries(testDataICU, "#chart2");
      const xScale = ts.getXScale();
      const yScale = ts.getYScale();

      // Get some example points to annotate
      const maxDP = testDataICU.reduce((currMax, dp) =>
        currMax.y > dp.y ? currMax : dp,
      );

      console.log("maxDp", maxDP);

      const randDP = testDataICU[40];

      // Create annotation objects
      const maxAnno = new GraphAnnotation("anno-1")
        .target(xScale(parseDate(maxDP.date)), yScale(maxDP.y))
        .x(600)
        .y(100)
        .title("Max height")
        .label(`Height of: ${maxDP.y} things per thing`);

      const randAnno = new GraphAnnotation()
        .id("anno-2")
        .title("Random point")
        .target(xScale(parseDate(randDP.date)), yScale(randDP.y))
        .x(250)
        .y(200);

      ts.renderSVG();

      ts.title("This is a title")
        .xLabel("This is an x-axis title")
        .yLabel("This is a y-axis title")
        .annotate([maxAnno, randAnno])
        .showEventLines()
        .plot();

      //
      // 3 animation
      //

      const animCtx = TimeSeries.animationSVG(900, 300, "#chart3");

      ts = new TimeSeries(testDataICU, "#chart3")
        .svg(animCtx)
        .showEventLines()
        .title("Example Title")
        .yLabel("y-axis label")
        .color("Green");

      const xSc = ts.getXScale();
      const ySc = ts.getYScale();

      const anno1 = new TimelineAnnotation(ySc(0))
        .wrap(400)
        .target(xSc(testDataICU[30].date), ySc(testDataICU[30].y))
        .x(xSc(testDataICU[30].date))
        .y(ySc(0) + 50)
        .label(`this is an annotation`)
        .connectorColor("#ccc");

      const anno2 = new TimelineAnnotation(ySc(0))
        .wrap(400)
        .target(xSc(testDataICU[35].date), ySc(testDataICU[35].y))
        .x(xSc(testDataICU[35].date))
        .y(ySc(0) + 50)
        .label("Smaller point")
        .connectorColor("#ccc");

      const anno3 = new TimelineAnnotation(ySc(0))
        .wrap(400)
        .target(xSc(testDataICU[100].date), ySc(testDataICU[100].y))
        .x(xSc(testDataICU[100].date))
        .y(ySc(0) + 50)
        .label("Finishing point")
        .connectorColor("#ccc");

      ts.animate(
        [
          { start: 0, end: 0 },
          { start: 0, end: 30, color: "pink", annotation: anno1 },
          { start: 30, end: 35, annotation: anno2, fadeout: true },
          { start: 35, end: 100, annotation: anno3 },
          { start: 100, end: testDataICU.length },
        ],
        4,
        animCtx,
      ).plot();

      const annos = [anno1, anno2, anno3];

      // Timeline annotation requires svg resizing
      const maxHeight = TimelineAnnotation.arrangeAnnotations(annos);
      TimelineAnnotation.resizeSvg(animCtx, 900, ySc(0) + 50, maxHeight);
    };

    fetchAndDraw();
  }, []); // [] means just do this once, after initial render

  return (
    <>
      <Head>
        <title>[Test] Storyboards</title>
      </Head>
      <DashboardLayout>
        <Box
          sx={{
            backgroundColor: "background.default",
            minHeight: "100%",
            py: 8,
          }}
        >
          <Container>
            <Card sx={{ minWidth: 1600 }}>
              <CardContent>
                <Typography variant="body2">
                  Test Page for Storyboarding Functions
                </Typography>
                <br />
                <div id="chart1" />
                <div id="chart2" />
                <div id="chart3" />
              </CardContent>
            </Card>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default StoryBoards;
