import { useState, ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { Grid, Box, Card, CardContent, CardHeader } from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import FirstForm from "src/components/timeseries-sim/FirstForm";
import AdvancedFilter from "src/components/timeseries-sim/AdvancedFilter";
import SearchButton from "src/components/timeseries-sim/SearchButton";
import { SegmentedMultiLinePlot } from "src/components/timeseries-sim/plotfunctions/segmentedmultilineplot";
import {
  covidIndicators,
  similarityMeasures,
  continents,
} from "src/components/timeseries-sim/variables/variables";
import { useStyles } from "src/components/timeseries-sim/style/style";
import GraphArea from "src/components/timeseries-sim/GraphArea";
import GraphTitle from "src/components/timeseries-sim/GraphTitle";
import { alignmentPlot } from "src/components/timeseries-sim/plotfunctions/alignmentplot";
import BenchmarkCountryList from "src/components/timeseries-sim/BenchmarkCountryList";
import TimeSeriesBag from "src/components/timeseries-sim/TimeSeriesBag";
import ComparePopUp from "src/components/timeseries-sim/ComparePopUp";
import { benchmarkPlot } from "src/components/timeseries-sim/plotfunctions/benchmarkplot";
import PredictPopUp from "src/components/timeseries-sim/PredictPopUp";
import { predictPlot } from "src/components/timeseries-sim/plotfunctions/predictplot";
import InfoPopUp from "src/components/timeseries-sim/InfoPopUp";
const API = process.env.NEXT_PUBLIC_API_PY;
const API_PY = API + "/timeseries-sim-search";
const today = new Date();
const lastDate = new Date(today.setDate(today.getDate() - 2));
const firstDate = new Date(today.setDate(today.getDate() - 30));

const dateParse = function (date) {
  return (
    String(date.getFullYear()) +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
};

const initialFirstRunState = {
  // default user parameters for timeseries search
  targetCountry: "Belgium",
  firstDate: dateParse(firstDate),
  lastDate: dateParse(lastDate),
  indicator: "biweekly_cases_per_million",
  method: "euclidean",
  numberOfResults: 30,
  minPopulation: 600000,
  startDate: "2021-01-01",
  endDate: dateParse(lastDate),
  continentCheck: {
    Africa: false,
    Asia: false,
    Australia: false,
    Europe: true,
    "North America": false,
    "South America": false,
  },
};

const defaultBenchmarkCountries = [
  // default benchmark countries
  "France",
  "Germany",
  "Switzerland",
  "Belgium",
  "Spain",
  "Italy",
  "United Kingdom",
  "Netherlands",
];

const defaultTimeSeriesBag = [];

const TimeseriesSim = () => {
  //const { settings } = useSettings();
  const classes = useStyles();

  const [advancedFilterPopup, setAdvancedFilterPopup] = useState(false); // advanced filter popup state control
  const [infoPopUp, setInfoPopUp] = useState(false);
  const [comparePopUp, setComparePopUp] = useState(false);
  const [predictPopUp, setPredictPopUp] = useState(false);

  const advancedFilterClickOpen = () => {
    // sets popup state to true
    setAdvancedFilterPopup(true);
  };
  const advancedFilterClickClose = () => {
    // sets popup state to false
    setAdvancedFilterPopup(false);
  };
  const infoPopUpClickOpen = () => {
    // sets popup state to true
    setInfoPopUp(true);
  };
  const infoPopUpClickClose = () => {
    // sets popup state to false
    setInfoPopUp(false);
  };

  const comparePopUpOpen = () => {
    setComparePopUp(true);
  };

  const comparePopUpClose = () => {
    setComparePopUp(false);
  };

  const predictPopUpOpen = () => {
    setPredictPopUp(true);
  };

  const predictPopUpClose = () => {
    setPredictPopUp(false);
  };

  const [firstRunForm, setFirstRunForm] = useState(initialFirstRunState); // time series search state control
  const [timeSeriesBag, setTimeSeriesBag] = useState(defaultTimeSeriesBag); // time series selection by results state control

  const [benchmarkCountries, setBenchmarkCountries] = useState(
    // benchmark countries for comparison state control
    defaultBenchmarkCountries,
  );

  const [manualCountry, setManualCountry] = useState(""); // manual user input for benchmark countries state control

  const manualListInput = (event) => {
    // follows the manual user input on change for benchmark countries
    setManualCountry(event.target.value);
  };

  const addManualCountry = () => {
    // add followed manual country input to benchmark list
    if (
      manualCountry.length > 0 &&
      !benchmarkCountries.includes(manualCountry) &&
      benchmarkCountries.length <= 10
    ) {
      setBenchmarkCountries((old) => [...old, manualCountry]);
    }
  };

  const removeCountry = function (event) {
    // remove selected benchmark country from the list
    let listNode = event.target;

    while (listNode.localName !== "li") {
      // icon button click fix to move up to parent until list is found
      listNode = listNode.parentNode;
    }
    const country = listNode.textContent;
    setBenchmarkCountries((old) => [...old.filter((item) => item !== country)]);
  };

  const removeTimeSeries = (event) => {
    // remove selected benchmark country from the list
    let listNode = event.target;
    while (listNode.localName !== "li") {
      // icon button click fix to move up to parent until list is found
      listNode = listNode.parentNode;
    }
    const timeSeries = listNode.textContent;
    setTimeSeriesBag((old) => [...old.filter((item) => item !== timeSeries)]);
  };

  const setBenchMarkToDefault = () => {
    setBenchmarkCountries(() => defaultBenchmarkCountries);
  };

  const multipleHandleChange = (event) => {
    console.log(event.target.value);
    // changes user form for timeseries search
    if (event.target.type == "checkbox") {
      const temp_obj = { ...firstRunForm };
      const temp_state = temp_obj.continentCheck;
      temp_state[event.target.value] = event.target.checked;
      temp_obj.continentCheck = temp_state;
      setFirstRunForm(temp_obj);
    } else {
      const { name, value } = event.target;
      setFirstRunForm({
        ...firstRunForm,
        [name]: value,
      });
    }
  };

  const searchPost = async () => {
    // post request to get similar timeseries back from API
    const apiUrl = API_PY + "/search/";
    //const apiUrl = `${API}/timeseries-sim-search/`;
    const response = await axios.post(apiUrl, firstRunForm);
    console.log("response = ", response);
    if (response.data?.length > 0) {
      //setResponseDataSearch(response.data);
      console.log("response.data = ", response.data);
      alignmentPlot(
        response.data,
        firstRunForm.indicator,
        timeSeriesBag,
        benchmarkCountries,
        setTimeSeriesBag,
        setBenchmarkCountries,
      );
      SegmentedMultiLinePlot(response.data, firstRunForm);
    }
  };

  const comparePost = async () => {
    const apiUrl = API_PY + "/compare/";
    //const apiUrl = `${API}/timeseries-sim-search/`;
    console.log({ countries: benchmarkCountries });
    const response = await axios.post(apiUrl, {
      countries: benchmarkCountries,
    });
    console.log("response = ", response);
    if (response.data?.length > 0) {
      console.log("response.data = ", response.data);
      benchmarkPlot(response.data);
    }
  };

  const predictPost = async () => {
    const apiUrl = API_PY + "/predict/";
    const predictObj = {
      series: timeSeriesBag,
      query: {
        country: firstRunForm.targetCountry,
        first_date: firstRunForm.firstDate,
        last_date: firstRunForm.lastDate,
      },
    };
    const response = await axios.post(apiUrl, predictObj);
    console.log("response = ", response);
    if (response.data?.length > 0) {
      console.log("response.data = ", response.data);
      predictPlot(response.data, firstRunForm.targetCountry);
    }
  };

  const predictClick = async () => {
    predictPopUpOpen();
    await predictPost();
  };

  const compareClick = async () => {
    // on clicking search button, fetch data , wait response and summon plots
    comparePopUpOpen(); // in order to make d3 queries, have to open pop-up first before filling with d3 graphs
    await comparePost();
  };

  const searchClick = async () => {
    // on clicking search button, fetch data , wait response and summon plots
    await searchPost();
    //plotSwitch();
  };

  return (
    <>
      <Helmet>
        <title>Timeseries Similarity</title>
      </Helmet>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={3} sx={{ minWidth: "350px" }}>
            <Card>
              <CardContent>
                <CardHeader title="Time Period Search" />
                <h2>
                  <InfoPopUp
                    open={infoPopUpClickOpen}
                    state={infoPopUp}
                    close={infoPopUpClickClose}
                  />
                </h2>
                <FirstForm
                  className={classes.firstRunForm}
                  form={firstRunForm}
                  onChange={multipleHandleChange}
                  indicator={covidIndicators}
                  method={similarityMeasures}
                  formChange={setFirstRunForm}
                  dateParse={dateParse}
                />
                <h2>
                  <AdvancedFilter
                    className={classes.firstRunForm}
                    open={advancedFilterClickOpen}
                    state={advancedFilterPopup}
                    close={advancedFilterClickClose}
                    continents={continents}
                    form={firstRunForm}
                    onChange={multipleHandleChange}
                    formChange={setFirstRunForm}
                    dateParse={dateParse}
                    initialValue={initialFirstRunState}
                  />
                </h2>
                <h2>
                  <SearchButton
                    className={classes.searchButton}
                    onClick={searchClick}
                  />
                </h2>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3} sx={{ minWidth: "350px" }}>
            <Card>
              <CardContent>
                <CardHeader title="Comprehensive Country Comparison" />
                <BenchmarkCountryList
                  list={benchmarkCountries}
                  manualValue={manualCountry}
                  manualValueChange={manualListInput}
                  manualValueAdd={addManualCountry}
                  removeFromList={removeCountry}
                  setToDefault={setBenchMarkToDefault}
                  onClick={compareClick}
                  manualCountrySet={setManualCountry}
                />
                <ComparePopUp state={comparePopUp} close={comparePopUpClose} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3} sx={{ minWidth: "350px" }}>
            <Card>
              <CardContent>
                <CardHeader title="Observation-based Forecasting" />
                <TimeSeriesBag
                  list={timeSeriesBag}
                  removeFromList={removeTimeSeries}
                  onClick={predictClick}
                />
                <PredictPopUp state={predictPopUp} close={predictPopUpClose} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid>
          <Card id="segmentedcard" sx={{ visibility: "hidden" }}>
            <GraphTitle />
            <GraphArea />
          </Card>
        </Grid>
        <Grid>
          <Card id="alignmentcard" sx={{ width: 1, visibility: "hidden" }}>
            <CardContent>
              <div id="alignmentchart" />
            </CardContent>
          </Card>
        </Grid>
      </Box>
    </>
  );
};

TimeseriesSim.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default TimeseriesSim;
