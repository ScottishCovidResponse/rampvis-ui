/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState, ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  Typography,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
  FormControlLabel,
  FormGroup,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TimelineIcon from "@material-ui/icons/Timeline";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import PropTypes from "prop-types";
import useSettings from "src/hooks/useSettings";
import { visFactory } from "src/lib/vis/vis-factory";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import {
  ConfirmationNumberTwoTone,
  EventNote,
  SignalWifiConnectedNoInternet4Sharp,
} from "@material-ui/icons";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: blue[500],
  },
  icon: {
    fill: blue[500],
  },
  firstRunForm: {
    marginBottom: theme.spacing(2),
  },
}));

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        p: 1,
        borderRadius: 1,
        textAlign: "left",
        fontSize: 19,
        fontWeight: "700",
        width: "auto",
        ...sx,
      }}
      {...other}
    />
  );
}
Item.propTypes = {
  sx: PropTypes.object,
};

const covidIndicators = [
  {
    label: "Daily Deaths",
    value: "new_deaths",
  },
  {
    label: "Daily Cases",
    value: "new_cases",
  },
  {
    label: "Daily Deaths per million",
    value: "new_deaths_per_million",
  },
  {
    label: "Daily Cases per million",
    value: "new_cases_per_million",
  },

  {
    label: "Cumulative Deaths",
    value: "total_deaths",
  },
  {
    label: "Cumulative Cases",
    value: "total_cases",
  },

  {
    label: "Cumulative Deaths per million",
    value: "total_deaths_per_million",
  },
  {
    label: "Cumulative Cases per million",
    value: "total_cases_per_million",
  },
  {
    label: "Biweekly Cases per million",
    value: "biweekly_cases_per_million",
  },
  {
    label: "Biweekly Deaths per million",
    value: "biweekly_deaths_per_million",
  },

  {
    label: "Biweekly Cases",
    value: "biweekly_cases",
  },
  {
    label: "Biweekly Deaths",
    value: "biweekly_deaths",
  },
  {
    label: "Weekly Cases per million",
    value: "weekly_cases_per_million",
  },
  {
    label: "Weekly Deaths per million",
    value: "weekly_deaths_per_million",
  },
  {
    label: "Weekly Cases",
    value: "weekly_cases",
  },
  {
    label: "Weekly Deaths",
    value: "weekly_deaths",
  },
  {
    label: "Weekly Cases Rate",
    value: "weekly_cases_rate",
  },
  {
    label: "Weekly Deaths Rate",
    value: "weekly_deaths_rate",
  },
  {
    label: "Biweekly Cases Rate",
    value: "biweekly_cases_rate",
  },
  {
    label: "Biweekly Deaths Rate",
    value: "biweekly_deaths_rate",
  },
];
const similarityMeasures = [
  {
    label: "Euclidean Distance",
    value: "euclidean",
  },
  {
    label: "Manhattan Distance",
    value: "manhattan",
  },
  {
    label: "Chebyshev Distance",
    value: "chebyshev",
  },
  {
    label: "Dynamic Time Warping Distance",
    value: "dtw",
  },
  {
    label: "Longest Common Subsequence Distance",
    value: "lcs",
  },
];
const continents = [
  {
    value: "Africa",
  },
  {
    value: "Asia",
  },
  {
    value: "Australia",
  },
  {
    value: "Europe",
  },
  {
    value: "North America",
  },
  {
    value: "South America",
  },
];

const initialFirstRunState2 = {
  targetCountry: "",
  firstDate: "",
  lastDate: "",
  indicator: "new_cases",
  method: "euclidean",
  numberOfResults: 10,
  minPopulation: 600000,
  startDate: "",
  endDate: "",
  continentCheck: {
    Africa: false,
    Asia: false,
    Australia: false,
    Europe: false,
    "North America": false,
    "South America": false,
  },
};

const TimeseriesSim = () => {
  const { settings } = useSettings();
  const classes = useStyles();
  const ref = useRef();
  const [advancedFilterPopup, setAdvancedFilterPopup] = useState(false);

  const advancedFilterClickOpen = () => {
    setAdvancedFilterPopup(true);
  };
  const advancedFilterClickClose = () => {
    setAdvancedFilterPopup(false);
  };

  const [firstRunForm, setFirstRunForm] = useState(initialFirstRunState2);

  const multipleHandleChange = (event) => {
    if (event.target.type == "checkbox") {
      let temp_obj = { ...firstRunForm };
      let temp_state = temp_obj.continentCheck;
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

  console.log(firstRunForm);

  const fetchAPI = useCallback(async () => {
    //const apiUrl = "http://127.0.0.1:4000/stat/v1/timeseries-sim-search/firstRunForm";
    //const res = await axios.post(apiUrl,initialFirstRunState);
    //console.log("TimeseriesSim: res = ", res);
  }, []);
  // if xx changes, useEffect will run again
  // if you want to run only once, just leave array empty []

  useEffect(() => {
    console.log("TimeseriesSim: useEffect:");
    fetchAPI();
  }, [fetchAPI]);

  //console.log(`${firstDate}-${lastDate}`)

  return (
    <>
      <Helmet>
        <title>Timeseries Similarity</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
          display: "grid",
          gap: 1,
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        <Item>
          <Card>
            <CardContent>
              <form>
                <div className={classes.firstRunForm}>
                  <TextField
                    id="first_run"
                    label="Target Country"
                    type="text"
                    color="primary"
                    variant="standard"
                    name="targetCountry"
                    value={firstRunForm.targetCountry}
                    onChange={multipleHandleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              </form>
              <form>
                <div className={classes.firstRunForm}>
                  <TextField
                    id="first_run"
                    label="First Date"
                    type="date"
                    color="primary"
                    variant="standard"
                    name="firstDate"
                    value={firstRunForm.firstDate}
                    onChange={multipleHandleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
                <div className={classes.firstRunForm}>
                  <TextField
                    id="first_run"
                    label="Last Date"
                    type="date"
                    color="primary"
                    variant="standard"
                    name="lastDate"
                    value={firstRunForm.lastDate}
                    onChange={multipleHandleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
                <div className={classes.firstRunForm}>
                  <TextField
                    select
                    label="Covid Indicator"
                    value={firstRunForm.indicator}
                    variant="standard"
                    name="indicator"
                    onChange={multipleHandleChange}
                  >
                    {covidIndicators.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className={classes.firstRunForm}>
                  <TextField
                    select
                    label="Similarity Measure"
                    name="method"
                    value={firstRunForm.method}
                    variant="standard"
                    onChange={multipleHandleChange}
                  >
                    {similarityMeasures.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className={classes.firstRunForm}>
                  <TextField
                    variant="standard"
                    id="first_run"
                    label="Number of results"
                    type="number"
                    color="primary"
                    name="numberOfResults"
                    value={firstRunForm.numberOfResults}
                    onChange={multipleHandleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{ inputProps: { min: 0, max: 10 } }}
                  />
                </div>
                <div className={classes.firstRunForm}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={advancedFilterClickOpen}
                  >
                    Advanced Filters
                  </Button>
                </div>
                <div className={classes.firstRunForm}>
                  <Button variant="outlined" color="primary">
                    Submit
                  </Button>
                </div>
                <Dialog
                  open={advancedFilterPopup}
                  onClose={advancedFilterClickClose}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogTitle id="form-dialog-title">
                    Advanced Filters
                  </DialogTitle>
                  <DialogTitle>Continents to include:</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      <FormGroup>
                        {continents.map((continent) => (
                          <label>
                            {continent.value}
                            <input
                              type="checkbox"
                              value={continent.value}
                              onChange={multipleHandleChange}
                            />
                          </label>
                        ))}
                      </FormGroup>
                    </DialogContentText>
                  </DialogContent>
                  <DialogContent>
                    <DialogContentText>
                      <FormGroup>
                        <div className={classes.firstRunForm}>
                          <TextField
                            id="first_run"
                            label="Minimum Population"
                            type="number"
                            color="primary"
                            variant="standard"
                            name="minPopulation"
                            value={firstRunForm.minPopulation}
                            onChange={multipleHandleChange}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              inputProps: { min: 500000, step: 50000 },
                            }}
                          />
                        </div>
                        <div className={classes.firstRunForm}>
                          <TextField
                            id="first_run"
                            label="Start Date"
                            type="date"
                            color="primary"
                            variant="standard"
                            name="startDate"
                            value={firstRunForm.startDate}
                            onChange={multipleHandleChange}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </div>
                        <div className={classes.firstRunForm}>
                          <TextField
                            id="first_run"
                            label="End Date"
                            type="date"
                            color="primary"
                            variant="standard"
                            name="endDate"
                            value={firstRunForm.endDate}
                            onChange={multipleHandleChange}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </div>
                      </FormGroup>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={advancedFilterClickClose} color="primary">
                      Apply
                    </Button>
                  </DialogActions>
                </Dialog>
              </form>
            </CardContent>
          </Card>
        </Item>

        <Item>
          <Container maxWidth={settings.compact ? "xl" : false}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ pt: "8px" }}>
                    {/* <svg ref={ref}/> */}
                    <div id="charts" />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Item>
        <Item>3</Item>
        <Item>4</Item>
      </Box>
    </>
  );
};
TimeseriesSim.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
export default TimeseriesSim;
