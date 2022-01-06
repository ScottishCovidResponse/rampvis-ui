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

const API = process.env.NEXT_PUBLIC_API_PY;

const today = new Date();
const lastDate = new Date(today.setDate(today.getDate() - 3));
const firstDate = new Date(today.setDate(today.getDate() - 33));
const initialFirstRunState = {
  // default user parameters for timeseries search
  targetCountry: "France",
  firstDate:
    String(firstDate.getFullYear()) +
    "-" +
    String(firstDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(firstDate.getDate()).padStart(2, "0"),
  lastDate:
    String(lastDate.getFullYear()) +
    "-" +
    String(lastDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(lastDate.getDate()).padStart(2, "0"),
  indicator: "biweekly_cases_per_million",
  method: "euclidean",
  numberOfResults: 10,
  minPopulation: 600000,
  startDate: "2021-01-01",
  endDate:
    String(today.getFullYear()) +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0"),
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
];

const defaultTimeSeriesBag = ["A", "B", "C"];

const TimeseriesSim = () => {
  //const { settings } = useSettings();
  const classes = useStyles();

  const [advancedFilterPopup, setAdvancedFilterPopup] = useState(false); // advanced filter popup state control

  const advancedFilterClickOpen = () => {
    // sets popup state to true
    setAdvancedFilterPopup(true);
  };
  const advancedFilterClickClose = () => {
    // sets popup state to false
    setAdvancedFilterPopup(false);
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
      benchmarkCountries.length < 5
    ) {
      setBenchmarkCountries((old) => [...old, manualCountry]);
    }
  };

  const removeCountry = (event) => {
    // remove selected benchmark country from the list
    let listNode = event.target;
    while (listNode.localName !== "li") {
      // icon button click fix to move up to parent until list is found
      listNode = listNode.parentNode;
    }
    const country = listNode.innerText;
    setBenchmarkCountries((old) => [...old.filter((item) => item !== country)]);
  };

  const removeTimeSeries = (event) => {
    console.log(event);
    // remove selected benchmark country from the list
    let listNode = event.target;
    while (listNode.localName !== "li") {
      // icon button click fix to move up to parent until list is found
      listNode = listNode.parentNode;
    }
    const timeSeries = listNode.innerText;
    setTimeSeriesBag((old) => [...old.filter((item) => item !== timeSeries)]);
  };

  const setBenchMarkToDefault = () => {
    setBenchmarkCountries(() => defaultBenchmarkCountries);
  };

  const multipleHandleChange = (event) => {
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

  const [responseData, setResponseData] = useState([]); // timeseries comparison response from API state control

  const plotSwitch = async () => {
    // summons segmented and aligment plots on response back from API
    if (responseData.length > 0) {
      alignmentPlot(responseData, timeSeriesBag, setTimeSeriesBag);
      SegmentedMultiLinePlot(responseData, firstRunForm);
    }
  };

  const searchPost = async () => {
    // post request to get similar timeseries back from API
    const apiUrl =
      "http://127.0.0.1:4010/stat/v1/timeseries-sim-search/search/";
    //const apiUrl = `${API}/timeseries-sim-search/`;
    const response = await axios.post(apiUrl, firstRunForm);
    console.log("response = ", response);
    if (response.data?.length > 0) {
      setResponseData(response.data);
      console.log("response.data = ", response.data);
    }
  };

  const comparePost = async () => {
    const apiUrl =
      "http://127.0.0.1:4010/stat/v1/timeseries-sim-search/compare/";
    //const apiUrl = `${API}/timeseries-sim-search/`;
    console.log({ countries: benchmarkCountries });
    const response = await axios.post(apiUrl, {
      countries: benchmarkCountries,
    });
    console.log("response = ", response);
    if (response.data?.length > 0) {
      setResponseData(response.data);
      console.log("response.data = ", response.data);
    }
  };

  const compareClick = async () => {
    // on clicking search button, fetch data , wait response and summon plots
    await comparePost();
    plotSwitch();
  };

  const searchClick = async () => {
    // on clicking search button, fetch data , wait response and summon plots
    await searchPost();
    plotSwitch();
  };

  return (
    <>
      <Helmet>
        <title>Timeseries Similarity</title>
      </Helmet>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <FirstForm
                  className={classes.firstRunForm}
                  form={firstRunForm}
                  onChange={multipleHandleChange}
                  indicator={covidIndicators}
                  method={similarityMeasures}
                />
                <AdvancedFilter
                  className={classes.firstRunForm}
                  open={advancedFilterClickOpen}
                  state={advancedFilterPopup}
                  close={advancedFilterClickClose}
                  continents={continents}
                  form={firstRunForm}
                  onChange={multipleHandleChange}
                />
                <SearchButton
                  className={classes.searchButton}
                  onClick={searchClick}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3}>
            <Card>
              <CardHeader title="Benchmark Country List" />
              <CardContent>
                <BenchmarkCountryList
                  list={benchmarkCountries}
                  manualValue={manualCountry}
                  manualValueChange={manualListInput}
                  manualValueAdd={addManualCountry}
                  removeFromList={removeCountry}
                  setToDefault={setBenchMarkToDefault}
                  onClick={compareClick}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3}>
            <Card>
              <CardHeader title="Timeseries Bag" />
              <CardContent>
                <TimeSeriesBag
                  list={timeSeriesBag}
                  removeFromList={removeTimeSeries}
                />
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
