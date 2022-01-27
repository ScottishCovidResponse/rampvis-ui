import axios from "axios";
import { visFactory } from "src/components/ensemble/vis-factory";

export class Controller {
  constructor() {
    this.line = null;
    this.table = null;
    this.matrix = null;
    this.parallel1 = null;
    this.parallel2 = null;
    this.scatter = null;
    this.heatmap = null;
    this.stacked = null;

    this.scatterPoints = [];
    this.parallelPoints = [];
    this.tablePoints = [];

    this.simulationIndex = 0;
    this.metadata = null;
    this.simulationData = null;
    this.ageIndex = 0;

    this.currentDataset = "default";
  }

  getIntersectionPoints() {
    if (!this.hasParallelPoints()) {
      if (!this.hasScatterPoints()) {
        return [];
      } else {
        return this.scatterPoints;
      }
    } else {
      if (!this.hasScatterPoints()) {
        return this.parallelPoints;
      } else {
        let intersection = this.parallelPoints.filter((x) =>
          this.scatterPoints.includes(x),
        );
        return intersection;
      }
    }
  }

  scatterStarted() {
    this.scatterPoints = [];
  }

  scattered(point) {
    this.scatterPoints.push(point);
  }

  scatterFinished() {
    this.parallel1.scatterFilter(this.scatterPoints);
    this.toggleRows(this.getIntersectionPoints());
  }

  scatterRemoved() {
    this.parallel1.scatterRemoved();
    this.toggleRows(this.getIntersectionPoints());
    this.changeStackedChart();
    this.changeHeatMap();
  }

  setAgeIndex(ageIndex) {
    this.ageIndex = ageIndex;
    this.changeParallelChart();
  }

  setParallelPoints(parallelPoints) {
    this.parallelPoints = parallelPoints;
    this.scatter.parallelFilter(this.parallelPoints);
    this.parallel1.scatterFilter(this.scatterPoints);
    this.toggleRows(this.getIntersectionPoints());
  }

  hasParallelPoints() {
    return this.parallelPoints.length != 0;
  }

  hasScatterPoints() {
    return this.scatterPoints.length != 0;
  }

  hasIntersectionPoints() {
    return this.getIntersectionPoints().length != 0;
  }

  changeLineChart(ageData) {
    this.line.removeContainer();
    this.line.displayData(ageData);
  }

  tableToggled(points) {
    this.tablePoints = points;

    // Always make sure that the first one is present
    if (this.tablePoints.length == 0) {
      this.tablePoints = [0];
    }

    // get first of the displayed table points
    var simulationIndex = this.tablePoints[0];

    this.getSimulationData(simulationIndex).then((ageData) => {
      this.changeLineChart(ageData);
    });

    this.changeParallelChart();

    // Adhitya: new functionality
    this.changeStackedChart();
    this.changeHeatMap();
  }

  toggleRows(points) {
    var rows = document.getElementsByClassName("rowToggle");

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];

      if (points.includes(parseInt(row.value))) {
        row.checked = true;
      } else {
        row.checked = false;
      }
    }

    this.tableToggled(points);
  }

  async setDatasetName(datasetName) {
    this.datasetName = datasetName;

    /// for now, this should work. there are other components that also have to be refreshed
    this.tableToggled([0]);
    // refresh everything on this page
  }

  makeDataforLineVis(ageData, simulation, age) {
    function makeArray(x) {
      return ageData.map((obj) => obj[x]);
    }

    return {
      simulation: simulation,
      age: age,
      x: {
        label: "Day",
        values: makeArray("day"),
      },
      ys: [
        {
          label: "Susceptible",
          values: makeArray("S_mean"),
        },
        {
          label: "Exposed",
          values: makeArray("E_mean"),
        },
        {
          label: "Hospitalised",
          values: makeArray("H_mean"),
        },
        {
          label: "Recovered",
          values: makeArray("R_mean"),
        },
        {
          label: "Death",
          values: makeArray("D_mean"),
        },
        {
          label: "Asymptomatic",
          values: makeArray("I_mean"),
        },
        {
          label: "Symptomatic",
          values: makeArray("IS_mean"),
        },
      ],
      axes: ["Day", "Population"],
      dashed: "Recovered",
    };
  }

  makeDataforParallelVis(ageData, age) {
    ageData.forEach((i) => (i["age_group"] = age));
    return ageData;
  }

  isCallback(callback) {
    return callback && typeof callback == "function";
  }

  async getDatasetList() {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data`;
    const res = await axios.get(apiUrl);
    this.datasetList = res.data;
    return this.datasetList;
  }

  async getSimulationData(simulation, callback) {
    this.simulationIndex = simulation;

    var allAgeData = [];

    for (var age_index = 0; age_index < 8; age_index++) {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data/${this.currentDataset}?path=data/output/simu_${simulation}/age_${age_index}.csv`;
      const res = await axios.get(apiUrl);
      const ageData = res.data;

      var currentAge = this.makeDataforLineVis(ageData, simulation, age_index);

      allAgeData.push(currentAge);
    }

    this.simulationData = allAgeData;

    if (this.isCallback(callback)) {
      callback.call(this.simulationData);
    } else {
      return this.simulationData;
    }
  }

  async getMetaData() {
    if (this.metadata !== null) {
      return this.metadata;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/meta/${this.currentDataset}`;
    const res = await axios.get(apiUrl);
    return res.data;
  }

  async getMeanData() {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data/${this.currentDataset}?path=data/output/pca/d/age_mean.csv`;
    const res = await axios.get(apiUrl);
    return res.data;
  }

  async getPolylineData(callback) {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data/${this.currentDataset}?path=data/output/simu_${this.simulationIndex}/avgPolyline.csv`;
    const res = await axios.get(apiUrl);
    if (this.isCallback(callback)) {
      callback.call(res.data);
    } else {
      return res.data;
    }
  }

  async getSimulationAgeData(callback) {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data/${this.currentDataset}?path=data/output/simu_${this.simulationIndex}/age_${this.ageIndex}.csv`;
    const res = await axios.get(apiUrl);
    const ageData = res.data;
    const data = this.makeDataforParallelVis(ageData, this.ageIndex);
    if (this.isCallback(callback)) {
      callback.call(data);
    } else {
      return data;
    }
  }

  async drawParallelChart(visualizationData, polylineData) {
    const controller = this.parallel2.removeContainer();

    var parallel2 = visFactory("ParallelChart", {
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

    this.parallel2 = parallel2;
  }

  async drawStackedChart(metadata, intersectionPoints) {
    const controller = this.stacked.removeContainer();

    const table_data = metadata.posterior_parameters;
    const table_keys = Object.keys(table_data[0]);

    const stacked = visFactory("StackedChart", {
      chartElement: "stacked_chart",
      data: table_data,
      columns: table_keys,
      retainedDimensions: ["Index"],
      controller: controller,
      intersectionPoints: intersectionPoints,
    });

    this.stacked = stacked;
  }

  async drawHeatMap(metadata, intersectionPoints) {
    const controller = this.heatmap.removeContainer();

    const table_data = metadata.posterior_parameters;
    const table_keys = Object.keys(table_data[0]);

    const heatmap = visFactory("HeatMap", {
      chartElement: "heatmap_chart",
      data: table_data,
      columns: table_keys,
      retainedDimensions: ["Index"],
      controller: controller,
      intersectionPoints: intersectionPoints,
    });

    this.heatmap = heatmap;
  }

  async changeParallelChart() {
    this.getSimulationAgeData().then((visualizationData) => {
      this.getPolylineData().then((polylineData) => {
        this.drawParallelChart(visualizationData, polylineData);
      });
    });
  }

  async changeStackedChart() {
    this.getMetaData().then((metadata) => {
      this.drawStackedChart(metadata, this.getIntersectionPoints());
    });
  }

  async changeHeatMap() {
    this.getMetaData().then((metadata) => {
      this.drawHeatMap(metadata, this.getIntersectionPoints());
    });
  }
}
