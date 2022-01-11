import React, { useEffect } from "react";
import Head from "next/head";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";

import Papa from "papaparse";
import { LookupTable } from "src/components/story-boards/LookupTable";
import { SemanticEvent } from "src/components/story-boards/SemanticEvent";
import { Peak } from "src/components/story-boards/Peak";

const StoryBoards = () => {
  useEffect(() => {
    async function readCSVData() {
      const response = await fetch(
        "/static/mock/story-boards-data/Lookup Table Output - Sheet1 (4).csv",
      );
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value); // the csv text
      const parsed = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
      const csvTableOutputs = parsed.data; // array of objects
      console.log(csvTableOutputs);

      let table = new LookupTable(csvTableOutputs);
      const vax_u = new SemanticEvent(
        new Date("08/12/20"),
        3,
        "Some event has happened",
      );
      console.log(table.generateOutput(vax_u));

      // Create lookup table from csv
      table = new LookupTable(csvTableOutputs);

      // Create Peak event
      const peak = new Peak(
        new Date("08/12/19"),
        new Date("08/12/20"),
        new Date("08/12/21"),
      )
        .setMetric("deaths")
        .setHeight(100);

      // Use the table to lookup Peak event and generate output
      const output = table.generateOutput(peak);

      console.log(output);
    }
    readCSVData();
  }, []); // [] means just do this once, after initial render

  return (
    <>
      <Head>
        <title>Storyboards</title>
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
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="body2">
                  This page is under development
                </Typography>
                <br />
              </CardContent>
            </Card>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default StoryBoards;
