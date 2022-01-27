import React, { ReactElement, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Container, useTheme, Card, CardContent } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ReactDOM from "react-dom";
import useSettings from "src/hooks/useSettings";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import { visFactory } from "src/components/ensemble/vis-factory";
import { Controller } from "src/components/ensemble/controller";
import CustomTable from "src/components/ensemble/table-plot";

const useStyles = makeStyles((theme) => ({}));

const Ensemble = () => {
  console.clear();
  const theme = useTheme();
  const classes = useStyles();
  const { settings } = useSettings();

  const controller = new Controller();

  const lineChart = useCallback(async () => {
    const allAgeData = await controller.getSimulationData(0);

    const line = visFactory("LineChart", {
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

    const parallel1 = visFactory("ParallelVerticalChart", {
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

    const parallel2 = visFactory("ParallelChart", {
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

    const scatter = visFactory("ScatterPlot", {
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

    const table = <CustomTable options={options} />;

    ReactDOM.render(table, document.getElementById("table_plot"));
    controller.table = table;
  }, []);

  const heatMap = useCallback(async () => {
    const metadata = await controller.getMetaData();
    const table_data = metadata.posterior_parameters;

    const table_keys = Object.keys(table_data[0]);

    const options = {
      chartElement: "heatmap_chart",
      data: table_data,
      columns: table_keys,
      retainedDimensions: ["Index"],
      controller: controller,
      intersectionPoints: Array.from(
        { length: table_data.length },
        (x, i) => i,
      ),
    };

    const heatmap = visFactory("HeatMap", options);
    controller.heatmap = heatmap;
  }, []);

  const stackedBarChart = useCallback(async () => {
    const metadata = await controller.getMetaData();
    const table_data = metadata.posterior_parameters;

    const table_keys = Object.keys(table_data[0]);

    const options = {
      chartElement: "stacked_chart",
      data: table_data,
      columns: table_keys,
      retainedDimensions: ["Index"],
      controller: controller,
      intersectionPoints: Array.from(
        { length: table_data.length },
        (x, i) => i,
      ),
    };

    const stacked = visFactory("StackedChart", options);
    controller.stacked = stacked;
  }, []);

  const datasetList = useCallback(async () => {
    const datasetNames = await controller.getDatasetList();
    const datasetListElement = document.getElementById("dataset_list");

    for (let i = 0; i < datasetNames.length; i++) {
      const datasetName = document.createElement("option");
      datasetName.innerText = datasetNames[i];
      datasetName.value = datasetNames[i];
      datasetListElement.appendChild(datasetName);
    }
  }, []);

  useEffect(() => {
    //datasetList();
    lineChart();
    parallelVerticalChart();
    parallelAdditionalChart();
    scatterPlot();
    tablePlot();
    heatMap();
    stackedBarChart();
  }, [
    //datasetList,
    lineChart,
    parallelVerticalChart,
    parallelAdditionalChart,
    scatterPlot,
    tablePlot,
    heatMap,
    stackedBarChart,
  ]);

  const setDatasetName = useCallback(async (event) => {
    const datasetName = event.target.value;
    controller.setDatasetName(datasetName);
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
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Card sx={{ minWidth: 1600 }}>
            <CardContent>
              {/* <select
                name="dataset-list"
                id="dataset_list"
                onChange={setDatasetName}
              ></select> */}
              <div id="container">
                <div id="line-chart">
                  <h3 className="title">Cases change across time</h3>
                  <div id="line_chart" />
                </div>
                <div id="parallel-chart">
                  <h3 className="title">Mean case change across age-groups</h3>
                  <div id="parallel_chart" />
                </div>
                <div id="scatter-plot">
                  <h3 className="scattertitle">PCA scatter plot of a & b</h3>
                  <div id="scatter_plot" />
                </div>
                <div id="table"></div>
              </div>

              <div id="container2">
                <div id="vertical-chart">
                  <h3 className="title">Parallel chart of parameters</h3>
                  <div id="parallel_vertical_chart" />
                </div>
                <div id="table-plot">
                  <h3 className="title">
                    Variation of parameters over their mean [pink below mean,
                    green above mean]
                  </h3>
                  <div id="table_plot" />
                </div>
              </div>

              <div id="container5">
                <div id="container3">
                  <div id="stacked-chart">
                    <h3 className="title">
                      Parameters normalized across runs/parameter
                    </h3>
                    <div id="stacked_chart" />
                  </div>
                </div>

                <div id="container4">
                  <div id="heatmap-chart">
                    <h3 className="title">Pixel Map of parameters</h3>
                    <div id="heatmap_chart" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </div>
  );
};

Ensemble.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Ensemble;
