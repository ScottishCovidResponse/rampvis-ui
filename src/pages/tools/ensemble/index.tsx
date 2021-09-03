/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTheme , makeStyles } from "@material-ui/core/styles";
import { Box, Container } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";

import useSettings from "src/hooks/useSettings";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import AuthGuard from "src/components/auth/guards/AuthGuard";

const useStyles = makeStyles((theme) => ({}));

const Ensemble = () => {
  console.log("Ensemble:");
  const theme = useTheme();
  const classes = useStyles();
  const { settings } = useSettings();

  useEffect(() => {}, []);

  return (
    <>
      <Helmet>
        <title>Ensemble</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false} />
      </Box>
    </>
  );
};

Ensemble.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </AuthGuard>
  );
};

export default Ensemble;
