import { useState, ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
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
const API = process.env.NEXT_PUBLIC_API_PY;

//first run object initalization
const today = new Date();

const initialFirstRunState = {
  targetCountry: "France",
  firstDate: "2021-10-01",
  lastDate: "2021-12-01",
  indicator: "new_cases",
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
    Asia: true,
    Australia: false,
    Europe: true,
    "North America": false,
    "South America": false,
  },
};

const TimeseriesSim = () => {
  //const { settings } = useSettings();
  const classes = useStyles();

  const [advancedFilterPopup, setAdvancedFilterPopup] = useState(false);
  const advancedFilterClickOpen = () => {
    setAdvancedFilterPopup(true);
  };
  const advancedFilterClickClose = () => {
    setAdvancedFilterPopup(false);
  };

  const [firstRunForm, setFirstRunForm] = useState(initialFirstRunState);
  const [timeSeriesBag, setTimeSeriesBag] = useState([]);
  const [manualCountry, setManualCountry] = useState("");

  const [responseData, setResponseData] = useState([]);

  const manualListInput = (event) => {
    setManualCountry(event.target.value);
  };

  const multipleHandleChange = (event) => {
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

  const plotSwitch = () => {
    if (responseData.length > 0) {
      alignmentPlot(responseData, timeSeriesBag, setTimeSeriesBag);
      SegmentedMultiLinePlot(responseData, firstRunForm);
    }
  };

  const fetchData = async () => {
    const apiUrl = `${API}/timeseries-sim-search/`;
    const response = await axios.post(apiUrl, firstRunForm);
    console.log("response = ", response);
    if (response.data?.length > 0) {
      setResponseData(response.data);
      console.log("response.data = ", response.data);
    }
  };

  const handleClick = async () => {
    await fetchData();
    plotSwitch();
  };

  const addManualCountry = () => {
    if (manualCountry.length > 0 && !timeSeriesBag.includes(manualCountry)) {
      setTimeSeriesBag((old) => [...old, manualCountry]);
    }
  };

  const removeCountry = (event) => {
    console.log(event.target);
  };

  return (
    <>
      <Helmet>
        <title>Timeseries Similarity</title>
      </Helmet>
      <Box>
        <Grid>
          <Grid sx={{ width: 300 }}>
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
                  onClick={handleClick}
                />
              </CardContent>
            </Card>
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
          <Grid sx={{ width: 300 }}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      type="text"
                      color="primary"
                      variant="standard"
                      name="timeSeries"
                      value={manualCountry}
                      onChange={manualListInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addManualCountry}
                    >
                      +
                    </Button>
                  </Grid>
                </Grid>

                <div>
                  <List>
                    {timeSeriesBag.map(
                      (
                        series, // time series bag list creation
                      ) => (
                        <ListItem
                          key={series}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={removeCountry}
                            >
                              <DeleteOutline />
                            </IconButton>
                          }
                        >
                          <ListItemText primary={series} />
                        </ListItem>
                      ),
                    )}
                  </List>
                </div>

                <div>
                  <Button variant="contained" color="primary">
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

TimeseriesSim.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default TimeseriesSim;
