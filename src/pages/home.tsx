import { Card, CardContent, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import Link from "next/link";

const Home = () => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h4">Welcome to RAMP VIS</Typography>
        <br />
        <Typography variant="body2">
          RAMP VIS is a visualization application that has been created by a
          group of{" "}
          <Link href="https://sites.google.com/view/rampvis/volunteers">
            <a>volunteers</a>
          </Link>{" "}
          specialised in Data Visualization and Visual Analytics, who answered a
          call to support the modelling scientists and epidemiologists in the{" "}
          <Link href="https://github.com/ScottishCovidResponse">
            <a>Scottish COVID-19 Response Consortium (SCRC)</a>
          </Link>
          .
        </Typography>
        <br />
        <Typography variant="body2">
          RAMP VIS is part of an ongoing research project and is a work in
          progress. We welcome any comments, questions, or suggestions from your
          experience in using this tool. All of the plots, dashboards, and tools
          in this application are freely available to be used. The data
          underneath the platform is currently out-of-date as we are working on
          the data infrastructure.
        </Typography>
      </CardContent>
    </Card>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Home;
