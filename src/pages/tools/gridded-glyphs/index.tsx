import * as React from "react";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import Head from "next/head";
import DemographicsDashboard from "src/components/DemographicsDashboard";
import { Box } from "@mui/material";

const GriddedGlyphs = () => {
  return (
    <>
      <Head>
        <title>Gridded glyphs</title>
      </Head>
      <DashboardLayout>
        <Box
          sx={{
            position: "fixed",
            overflow: "visible",
            bottom: 0,
            left: { xs: 0, md: 280 },
            top: 60,
            right: 0,
          }}
        >
          <DemographicsDashboard />
        </Box>
      </DashboardLayout>
    </>
  );
};

export default GriddedGlyphs;
