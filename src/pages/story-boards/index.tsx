import React from "react";
import Head from "next/head";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";

const Public = () => {
  return (
    <>
      <Head>
        <title>Storyboards</title>
      </Head>
      <DashboardLayout>
        <div
          style={{
            position: "fixed",
            overflow: "visible",
            bottom: 0,
            left: 280,
            top: 60,
            right: 0,
          }}
        ></div>
      </DashboardLayout>
    </>
  );
};

export default Public;
