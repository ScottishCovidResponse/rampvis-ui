import * as React from "react";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import Head from "next/head";
import DemographicsDashboard from "src/components/DemographicsDashboard";

const GriddedGlyphs = () => {
  return (
    <>
      <Head>
        <title>Gridded glyphs</title>
      </Head>
      <DashboardLayout>
        <div
          // TODO: Fix styles for mobile (remove left 280 or change approach)
          style={{
            position: "fixed",
            overflow: "visible",
            bottom: 0,
            left: 280,
            top: 60,
            right: 0,
          }}
        >
          <DemographicsDashboard />
        </div>
      </DashboardLayout>
    </>
  );
};

export default GriddedGlyphs;
