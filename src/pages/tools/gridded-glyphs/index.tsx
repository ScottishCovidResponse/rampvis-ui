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
        <DemographicsDashboard />
      </DashboardLayout>
    </>
  );
};

export default GriddedGlyphs;
