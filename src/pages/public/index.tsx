import React from "react";
import Head from "next/head";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";

const Public = () => {
  return (
    <>
      <Head>
        <title>Public</title>
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

export default Public;
