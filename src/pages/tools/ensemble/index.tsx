import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@material-ui/core/styles";
import { Box, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import useSettings from "src/hooks/useSettings";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";

import { visFactory } from "src/components/ensemble/vis-factory";
import { Controller } from "src/components/ensemble/controller";
import CustomTable from "src/components/ensemble/table-plot";
import ReactDOM from "react-dom";

const useStyles = makeStyles((theme) => ({}));

const Ensemble = () => {
  console.clear();
  const theme = useTheme();
  const classes = useStyles();
  const { settings } = useSettings();

  let controller = new Controller();

  const lineChart = useCallback(async () => {
    let allAgeData = await controller.getSimulationData(0);

    let line = visFactory("LineChart", {
      chartElement: "line_chart",
      data: allAgeData,
      currentSelection: 0,
      controller: controller,
    });

    controller.line = line;
  }, []);

  const parallelVerticalChart = useCallback(async () => {
    const metadata = await controller.getMetaData();
    const parameters = metadata.posterior_parameters;

    let parallel1 = visFactory("ParallelVerticalChart", {
      chartElement: "parallel_vertical_chart",
      data: [
        {
          values: parameters,
          removedDimensions: ["Index"],
        },
      ],
      controller: controller,
    });

    controller.parallel1 = parallel1;
  }, []);

  const parallelAdditionalChart = useCallback(async () => {
    const visualizationData = await controller.getSimulationAgeData();
    const polylineData = await controller.getPolylineData();

    let parallel2 = visFactory("ParallelChart", {
      chartElement: "parallel_chart",
      data: [
        {
          values: visualizationData,
          displayedDimensions: [
            "age_group",
            "day",
            "S_mean",
            "E_mean",
            "H_mean",
            "R_mean",
            "D_mean",
            "I_mean",
            "IS_mean",
          ],
          additionalData: polylineData,
        },
      ],
      controller: controller,
    });

    controller.parallel2 = parallel2;
  }, []);

  const scatterPlot = useCallback(async () => {
    const pcaData = await controller.getMeanData();

    let scatter = visFactory("ScatterPlot", {
      chartElement: "scatter_plot",
      data: [
        {
          values: pcaData,
        },
      ],
      controller: controller,
    });

    controller.scatter = scatter;
  }, []);

  // const matrixPlot = useCallback(async () => {
  //   const metadata = await controller.getMetaData();
  //   const parameters = metadata.posterior_parameters;

  //   let matrix = visFactory("MatrixJunk", {
  //     chartElement: "matrix_junk",
  //     data: [{
  //       values: parameters,
  //       displayedDimensions: ["p_inf", "p_hcw", "c_hcw", "d", "q"]
  //     }],
  //     controller: controller
  //   });

  //   controller.matrix = matrix;

  // }, []);

  const tablePlot = useCallback(async () => {
    const metadata = await controller.getMetaData();
    const table_data = metadata.posterior_parameters;

    const table_keys = Object.keys(table_data[0]);
    const columns = table_keys.map((key) => ({ accessor: key, Header: key }));
    const table_metadata = metadata.posterior_parameters_meta;

    const options = {
      data: table_data,
      metadata: table_metadata[2],
      meandata: table_metadata[1],
      columns: columns,
      retainedDimensions: ["Index"],
      controller: controller,
    };

    let table = <CustomTable options={options} />;

    ReactDOM.render(table, document.getElementById("table_plot"));
    controller.table = table;
  }, []);

  useEffect(() => {
    lineChart();
    parallelVerticalChart();
    parallelAdditionalChart();
    scatterPlot();
    tablePlot();
  }, [
    lineChart,
    parallelVerticalChart,
    parallelAdditionalChart,
    scatterPlot,
    tablePlot,
  ]);

  const setDatasetIndex = useCallback(async (event) => {
    let datasetIndex = event.target.value;
    controller.setDatasetIndex(datasetIndex);
  }, []);

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

        {/* <select id="dataset" onChange={setDatasetIndex}>
          <option value="1">Original</option>
          <option value="2">Test</option>
        </select> */}

        <div id="container">
          <div id="line-chart">
            <div id="line_chart" />
          </div>
          <div id="parallel-chart">
            <div id="parallel_chart" />
          </div>
          <div id="scatter-plot">
            <div id="scatter_plot" />
          </div>
          <div id="table"></div>
        </div>

        <div id="container2">
          <div id="vertical-chart">
            <div id="parallel_vertical_chart" />
          </div>
          <div id="table-plot">
            <div id="table_plot" />
          </div>
        </div>
      </Box>
    </div>
  );
};

Ensemble.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Ensemble;
