import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@material-ui/core/styles";
import { Box, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import useSettings from "src/hooks/useSettings";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import AuthGuard from "src/components/auth/guards/AuthGuard";

import { visFactory } from "src/lib/vis/vis-factory";
import axios from "axios";

const useStyles = makeStyles((theme) => ({}));

const Ensemble = () => {

  console.clear();
  const theme = useTheme();
  const classes = useStyles();
  const { settings } = useSettings();

  function makeDataforVis(ageData, simulation, age) {

    function makeArray(x) {
      return ageData.map(obj => obj[x])
    }

    return {
      simulation: simulation,
      age: age,
      x: {
        label: "Day",
        values: makeArray("day")
      },
      ys: [
        {
          label: "Susceptible",
          values: makeArray("S_mean")
        },
        {
          label: "Exposed",
          values: makeArray("E_mean")
        },
        {
          label: "Hospitalised",
          values: makeArray("H_mean")
        },
        {
          label: "Recovered",
          values: makeArray("R_mean")
        },
        {
          label: "Death",
          values: makeArray("D_mean")
        },
        {
          label: "Asymptomatic",
          values: makeArray("I_mean")
        },
        {
          label: "Symptomatic",
          values: makeArray("IS_mean")
        },
      ],
      axes: [
        "Day",
        "Population"
      ],
      dashed: "Recovered"
    }
  }

  function makeDataforParallelVis(ageData, age) {
    ageData.forEach((i) => (i["age_group"] = age))
    return ageData
  }

  const fetchData = useCallback(async () => {
    // Adhitya: the simulation index is hard coded for testing
    var simulation = 0;
    var currentAgeSelection = 0;

    var allAgeData = [];

    // Adhitya: I can ask the generic developers to put this in a better format,
    // instead of sending multiple requests for each age group
    // and get rid of this entire loop altogether
    for (var age_index = 0; age_index < 8; age_index++){
      const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data?path=data/output/simu_${simulation}/age_${age_index}.csv`;
      const res = await axios.get(apiUrl);
      const ageData = res.data;
      var currentAge = makeDataforVis(ageData, simulation, age_index)
      allAgeData.push(currentAge)
    }
    
    visFactory('LineJunk', {
      chartElement: "line_junk",
      data: allAgeData,
      currentSelection: currentAgeSelection
    });
    
  }, []);

  const fetchData2 = useCallback(async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/meta`;
    const res = await axios.get(apiUrl);
    const parameters = res.data.posterior_parameters;

    visFactory("ParallelJunk", {
      chartElement: "parallel_junk",
      data: [{
        values: parameters,
        removedDimensions: ["Index"]
      }],
    });

  }, []);

  const fetchData3 = useCallback(async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data?path=data/output/simu_0/age_0.csv`;
    const res = await axios.get(apiUrl);
    const ageData = res.data;

    const apiUrl2 = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data?path=data/output/simu_0/avgPolyline.csv`;
    const res2 = await axios.get(apiUrl2);
    const polyLineData = res2.data;

    visFactory("ParallelJunk", {
      chartElement: "parallel_junk2",
      data: [{
        values: makeDataforParallelVis(ageData, 0),
        displayedDimensions: ["age_group", "day", "S_mean", "E_mean", "H_mean", "R_mean", "D_mean", "I_mean", "IS_mean"],
        additionalData: polyLineData
      }],
    });
  }, []);

  const fetchData4 = useCallback(async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data?path=data/output/pca/d/age_mean.csv`;
    const res = await axios.get(apiUrl);
    const pcaData = res.data;

    visFactory("ScatterJunk", {
      chartElement: "scatter_junk",
      data: [{
        values: pcaData
      }],
    });

  }, []);

  const fetchData5 = useCallback(async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/meta`;
    const res = await axios.get(apiUrl);
    const parameters = res.data.posterior_parameters;

    visFactory("MatrixJunk", {
      chartElement: "matrix_junk",
      data: [{
        values: parameters,
        displayedDimensions: ["p_inf", "p_hcw", "c_hcw", "d", "q"]
      }],
    });

  }, []);


  const fetchData6 = useCallback(async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/meta`;
    const res = await axios.get(apiUrl);
    const table_data = res.data.posterior_parameters;
    const table_keys = Object.keys(table_data[0]);
    const columns = table_keys.map((key) => ({ accessor: key, Header: key }))
    const table_metadata = res.data.posterior_parameters_meta;

    visFactory("TableJunk", {
      chartElement: "table_junk",
      data: table_data,
      metadata: table_metadata[2],
      meandata: table_metadata[1],
      columns: columns,
      retainedDimensions: ["Index"]
    });

  }, []);

  useEffect(() => {
    fetchData();
    fetchData2();
    fetchData3();
    fetchData4();
    fetchData5();
    fetchData6();
  }, [fetchData, fetchData2, fetchData3, fetchData4, fetchData5, fetchData6]);


  return (
    <div>
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
        <div id="line_junk" />
        <div id="parallel_junk" />
        <div id="parallel_junk2" />
        <div id="scatter_junk" />
        <div id="matrix_junk" />
        <div id="table_junk" />
      </Box>
    </div>
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
