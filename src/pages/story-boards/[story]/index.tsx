import { ReactElement, useEffect } from "react";
import Head from "next/head";
import { Box } from "@mui/system";
import { Card, CardContent, Container } from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import { storyboardA } from "src/components/story-boards/storyboard-a";

const Story = () => {
  useEffect(() => {
    storyboardA();
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
              <CardContent></CardContent>
            </Card>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Story;
