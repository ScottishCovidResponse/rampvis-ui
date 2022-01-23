import { Card, CardContent, Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { GetStaticProps } from "next";
import React, { ReactElement } from "react";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";

const Home = () => {
  return (
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
            <Typography variant="h4">Welcome to RAMPVIS</Typography>
            <br />
            <Typography variant="body2">
              RAMP VIS is a visualization application that has been created by a
              group of{" "}
              <a
                href="https://sites.google.com/view/rampvis/volunteers"
                target="_blank"
                rel="noreferrer"
              >
                volunteers
              </a>{" "}
              specialised in Data Visualization and Visual Analytics, who
              answered a call to support the modelling scientists and
              epidemiologists in the{" "}
              <a
                href="https://github.com/ScottishCovidResponse"
                target="_blank"
                rel="noreferrer"
              >
                <a>Scottish COVID-19 Response Consortium (SCRC)</a>
              </a>
              .
            </Typography>
            <br />
            <Typography variant="body2">
              RAMP VIS is part of an ongoing research project and is a work in
              progress. We welcome any comments, questions, or suggestions from
              your experience in using this tool. All of the plots, dashboards,
              and tools in this application are freely available to be used. The
              data underneath the platform is currently out-of-date as we are
              working on the data infrastructure.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getStaticProps: GetStaticProps = async () => {
  const pageId = process.env.NEXT_PUBLIC_PAGE_ID_HOME;

  if (pageId) {
    return {
      redirect: {
        destination: `/page?id=${pageId}`,
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default Home;
