import { ReactElement } from "react";
import Head from "next/head";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";

const Story = () => {
  return (
    <>
      <Head>
        <title>Public</title>
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

export default Story;
