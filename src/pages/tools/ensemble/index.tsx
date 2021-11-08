/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@material-ui/core/styles";
import { Box, Container } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

import useSettings from "src/hooks/useSettings";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import AuthGuard from "src/components/auth/guards/AuthGuard";

import axios from "axios";

const useStyles = makeStyles((theme) => ({}));

const Ensemble = () => {
  console.log("Ensemble:");
  const theme = useTheme();
  const classes = useStyles();
  const { settings } = useSettings();

  const fetchMeta = useCallback(async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/meta`;
    const res = await axios.get(apiUrl);
    console.log("ensemble: meta = ", res.data);
  }, []);

  const fetchData = useCallback(async () => {
    // path is the path to a specific csv file or folder
    // If a folder is given, such as `?path=data/output/simu_0/`, return an object with keys as filenames
    // const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data?path=data/output/simu_0/age_0.csv`;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data?path=data/output/simu_0`;
    const res = await axios.get(apiUrl);
    console.log("ensemble: data = ", res.data);
  }, []);

  useEffect(() => {
    console.log("ensemble: useEffect:");
    fetchMeta();
    fetchData()
  }, [fetchMeta, fetchData]);

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
        <Container maxWidth={settings.compact ? "xl" : false}></Container>
        <div>HELLO</div>
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
