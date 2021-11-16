import axios from "axios";
import { visFactory } from "src/pages/tools/ensemble/vis-factory";

export class Controller {
  constructor() {
    this.line = null;
    this.table = null;
    this.matrix = null;
    this.parallel1 = null;
    this.parallel2 = null;
    this.scatter = null;

    this.scatterPoints = [];
    this.parallelPoints = [];
    this.tablePoints = [];

    this.simulationIndex = 0;
    this.metadata = null;
    this.simulationData = null;
    this.ageIndex = 0;

    this.datasetIndex = 1;
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

  tableToggled(points) {
    this.tablePoints = points;

    // Always make sure that the first one is present
    if (this.tablePoints.length == 0) {
      this.tablePoints = [0];
    }

    // get first of the displayed table points
    var simulationIndex = this.tablePoints[0];

    var _this = this;

    this.getSimulationData(simulationIndex).then(function (ageData) {
      _this.line.removeContainer();
      _this.line.displayData(ageData);
    });

    this.changeParallelChart();
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

  randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async setDatasetIndex(datasetIndex) {
    this.datasetIndex = datasetIndex;

    // if (this.datasetIndex == 2) {
    //   // Adhitya: this is only for testing purposes
    //   var simulationIndex = this.randomIntFromInterval(0, 159);
    //   console.log("Random Simulation Index: " + simulationIndex);

    //   var _this = this;

    //   this.getSimulationData(simulationIndex).then(function (ageData) {
    //     _this.line.removeContainer();
    //     _this.line.displayData(ageData);
    //   });

    //   this.changeParallelChart();
    // }
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

  async getSimulationData(simulation) {
    this.simulationIndex = simulation;

    var allAgeData = [];

    for (var age_index = 0; age_index < 8; age_index++) {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data?path=data/output/simu_${simulation}/age_${age_index}.csv`;
      const res = await axios.get(apiUrl);
      const ageData = res.data;

      var currentAge = this.makeDataforLineVis(ageData, simulation, age_index);

      allAgeData.push(currentAge);
    }

    this.simulationData = allAgeData;

    return this.simulationData;
  }

  async getMetaData() {
    if (this.metadata !== null) {
      return this.metadata;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/meta`;
    const res = await axios.get(apiUrl);
    return res.data;
  }

  async getMeanData() {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data?path=data/output/pca/d/age_mean.csv`;
    const res = await axios.get(apiUrl);
    return res.data;
  }

  async getPolylineData() {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data?path=data/output/simu_${this.simulationIndex}/avgPolyline.csv`;
    const res = await axios.get(apiUrl);
    return res.data;
  }

  async getSimulationAgeData() {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_PY}/ensemble/data?path=data/output/simu_${this.simulationIndex}/age_${this.ageIndex}.csv`;
    const res = await axios.get(apiUrl);
    const ageData = res.data;
    return this.makeDataforParallelVis(ageData, this.ageIndex);
  }

  async changeParallelChart() {
    var _this = this;
    this.getSimulationAgeData().then(function (visualizationData) {
      _this.getPolylineData().then(function (polylineData) {
        _this.parallel2.removeContainer().then(function (controller) {
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

          _this.parallel2 = parallel2;
        });
      });
    });
  }
}
