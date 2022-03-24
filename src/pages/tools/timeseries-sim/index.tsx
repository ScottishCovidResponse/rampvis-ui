import { useState, ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import {
  Grid,
  Box,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogContentText,
  Snackbar,
  Alert,
} from "@mui/material";
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
import GraphArea from "src/components/timeseries-sim/GraphArea";
import { alignmentPlot } from "src/components/timeseries-sim/plotfunctions/alignmentplot";
import BenchmarkCountryList from "src/components/timeseries-sim/BenchmarkCountryList";
import TimeSeriesBag from "src/components/timeseries-sim/TimeSeriesBag";
import ComparePopUp from "src/components/timeseries-sim/ComparePopUp";
import { benchmarkPlot } from "src/components/timeseries-sim/plotfunctions/benchmarkplot";
import PredictPopUp from "src/components/timeseries-sim/PredictPopUp";
import { predictPlot } from "src/components/timeseries-sim/plotfunctions/predictplot";
import InfoPopUp from "src/components/timeseries-sim/InfoPopUp";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

const API = process.env.NEXT_PUBLIC_API_PY;
const API_PY = API + "/timeseries-sim-search";
const today = new Date();
const lastDate = new Date(today.setDate(today.getDate() - 4));
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
  method: ["euclidean"],
  numberOfResults: 20,
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

  const [advancedFilterPopup, setAdvancedFilterPopup] = useState(false); // advanced filter popup state control
  const [infoPopUp, setInfoPopUp] = useState(false);
  const [comparePopUp, setComparePopUp] = useState(false);
  const [predictPopUp, setPredictPopUp] = useState(false);
  const [successSnack, setSuccessSnack] = useState(false);
  const [successMessage, setSuccessMessage] = useState("test");
  const [warningSnack, setWarningSnack] = useState(false);
  const [warningMessage, setWarningMessage] = useState("test");
  const [infoSnack, setInfoSnack] = useState(false);
  const [infoMessage, setInfoMessage] = useState("test");
  const [errorSnack, setErrorSnack] = useState(false);
  const [errorMessage, setErrorMessage] = useState("test");

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

  const [loadPopUp, setLoadPopUp] = useState(false);

  const searchPost = async () => {
    //const apiUrl = API_PY + "/search/";
    const apiUrl =
      "http://0.0.0.0:4010" + "/stat/v1/timeseries-sim-search/search/";

    const response = await axios.post(apiUrl, firstRunForm);

    console.log("response = ", response);
    if (response.data?.length > 0) {
      console.log("response.data = ", response.data);
      console.log(timeSeriesBag);
      alignmentPlot(
        response.data,
        firstRunForm.indicator,
        timeSeriesBag,
        benchmarkCountries,
        setTimeSeriesBag,
        setBenchmarkCountries,
        setSuccessSnack,
        setSuccessMessage,
        setWarningSnack,
        setWarningMessage,
      );

      SegmentedMultiLinePlot(response.data, firstRunForm);
    }
  };

  const comparePost = async () => {
    const apiUrl = API_PY + "/compare/";

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
    //const apiUrl = API_PY + "/predict/";
    const apiUrl =
      "http://0.0.0.0:4010" + "/stat/v1/timeseries-sim-search/predict/";

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
    setLoadPopUp(true);
    await predictPost();
    setLoadPopUp(false);
  };

  const compareClick = async () => {
    // on clicking search button, fetch data , wait response and summon plots
    // in order to make d3 queries, have to open pop-up first before filling with d3 graphs
    comparePopUpOpen();
    setLoadPopUp(true);
    await comparePost();
    setLoadPopUp(false);
  };

  const searchClick = async () => {
    // on clicking search button, fetch data , wait response and summon plots
    setLoadPopUp(true);
    await searchPost();
    setLoadPopUp(false);
    setInfoMessage(() => "Plots are generated successfully. Check below");
    setInfoSnack(() => true);
    //plotSwitch();
  };

  return (
    <>
      <Helmet>
        <title>Timeseries Similarity</title>
      </Helmet>
      <Box>
        <Grid container spacing={2} sx={{ marginLeft: "5px" }}>
          <Grid item xs={3} sx={{ minWidth: "350px" }}>
            <Card>
              <CardContent>
                <CardHeader title="Time Period Search" />

                <p style={{ fontSize: "13px" }}>
                  This panel allows the user to enter the criteria for selecting
                  a target time-series and retrieving most similar patterns from
                  the past upon clicking search button. The detailed technical
                  information about the similarity measures is given below:
                </p>

                <h2>
                  <InfoPopUp
                    open={infoPopUpClickOpen}
                    state={infoPopUp}
                    close={infoPopUpClickClose}
                  />
                </h2>

                <p style={{ fontSize: "13px" }}>
                  Two plots are generated as the output of time-period search.
                  Alignment plot highlights the quality of comparison by
                  aligning the patterns in time. In the second plot the found
                  data patterns are placed correctly at the time period when
                  each data pattern occurs.
                </p>

                <p style={{ fontSize: "13px" }}>
                  The user can select a country by clicking the corresponding
                  time series. This clicking action adds the country to the
                  Observation-based Forecasting panel.
                </p>

                <FirstForm
                  form={firstRunForm}
                  onChange={multipleHandleChange}
                  indicator={covidIndicators}
                  method={similarityMeasures}
                  formChange={setFirstRunForm}
                  dateParse={dateParse}
                />
                <h2>
                  <AdvancedFilter
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
                  <SearchButton onClick={searchClick} />
                </h2>

                <h2>
                  <Dialog open={loadPopUp}>
                    <DialogContent>
                      <DialogContentText>
                        <CircularProgress />
                      </DialogContentText>
                    </DialogContent>
                  </Dialog>
                </h2>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3} sx={{ minWidth: "350px" }}>
            <Card>
              <CardContent>
                <CardHeader title="Observation-based Forecasting" />
                <p style={{ fontSize: "13px" }}>
                  This panel allows the user to use the data of the selected
                  countries to make an ensemble prediction. The prediction is
                  based on the time periods after the matching data patterns.
                  The countries can be added to the list from the time-period
                  search outputs.
                </p>

                <TimeSeriesBag
                  list={timeSeriesBag}
                  removeFromList={removeTimeSeries}
                  onClick={predictClick}
                />
                <PredictPopUp state={predictPopUp} close={predictPopUpClose} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3} sx={{ minWidth: "350px" }}>
            <Card>
              <CardContent>
                <CardHeader title="Comprehensive Country Comparison" />
                <p style={{ fontSize: "13px" }}>
                  This panel allowss the user to select a set of country to make
                  routine comparative observation without a search action. The
                  user can further analyze the dynamics of the pandemic in the
                  selected countries. Countries selected from the time period
                  search are also added to the list below:
                </p>
                <BenchmarkCountryList
                  list={benchmarkCountries}
                  manualValue={manualCountry}
                  manualValueChange={manualListInput}
                  manualValueAdd={addManualCountry}
                  removeFromList={removeCountry}
                  setToDefault={setBenchMarkToDefault}
                  onClick={compareClick}
                  manualCountrySet={setManualCountry}
                  form={firstRunForm}
                />
                <ComparePopUp state={comparePopUp} close={comparePopUpClose} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid>
          <Card id="segmentedcard" sx={{ visibility: "hidden" }}>
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

      <Snackbar
        open={successSnack}
        autoHideDuration={1000}
        onClose={() => setSuccessSnack(false)}
      >
        <Alert
          onClose={() => setSuccessSnack(false)}
          severity="success"
          sx={{ width: "100%", fontSize: "32px" }}
          iconMapping={{
            success: <CheckCircleIcon sx={{ fontSize: "48px" }} />,
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={warningSnack}
        autoHideDuration={1000}
        onClose={() => setWarningSnack(false)}
      >
        <Alert
          onClose={() => setWarningSnack(false)}
          severity="warning"
          sx={{ width: "100%", fontSize: "32px" }}
          iconMapping={{
            warning: <WarningIcon sx={{ fontSize: "48px" }} />,
          }}
        >
          {warningMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={infoSnack}
        autoHideDuration={1000}
        onClose={() => setInfoSnack(false)}
      >
        <Alert
          onClose={() => setInfoSnack(false)}
          severity="info"
          sx={{ width: "100%", fontSize: "32px" }}
          iconMapping={{
            info: <InfoIcon sx={{ fontSize: "48px" }} />,
          }}
        >
          {infoMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={errorSnack} autoHideDuration={200}>
        <Alert
          onClose={() => setErrorSnack(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

TimeseriesSim.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default TimeseriesSim;
