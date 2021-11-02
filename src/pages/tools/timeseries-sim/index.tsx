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
  listSubheaderClasses,
  Checkbox,
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
import * as d3 from "d3";
import { DateSchema } from "yup";

//react style function for creating css classes and assigning attributes
//https://casbin.org/CssToAndFromReact/ good website for conversions
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
  container: {
    display: "grid",
    gridTemplateColumns: "1.8fr 0.2fr",
    gridTemplateRows: "1fr",
    gap: "0px 0px",
    gridTemplateAreas: '"charts legend"',
  },
  legend: {
    gridArea: "legend",
  },
  charts: {
    gridArea: "charts",
  },
}));

//A high level container to separate forms and plots
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
        ...sx,
      }}
      {...other}
    />
  );
}
Item.propTypes = {
  sx: PropTypes.object,
};

//list of covid data streams
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
//list of similarity measures
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
//list of continents
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

//first run object initalization
const initialFirstRunState = {
  targetCountry: "United Kingdom",
  firstDate: "2021-08-02",
  lastDate: "2021-08-16",
  indicator: "new_cases",
  method: "euclidean",
  numberOfResults: 10,
  minPopulation: 600000,
  startDate: "2021-01-01",
  endDate: "2021-10-01",
  continentCheck: {
    Africa: false,
    Asia: false,
    Australia: false,
    Europe: true,
    "North America": false,
    "South America": false,
  },
};

//---D3 FUNCTIONS---

function findMaxValue(obj) {
  let max = 0;
  for (const res in obj) {
    for (const dat in obj[res]) {
      if (obj[res][dat]["measurement"] > max) {
        max = obj[res][dat]["measurement"];
      }
    }
  }
  return max;
}

function findMinValue(obj) {
  let min = Infinity;
  for (const res in obj) {
    for (const dat in obj[res]) {
      if (obj[res][dat]["measurement"] < min) {
        min = obj[res][dat]["measurement"];
      }
    }
  }
  return min;
}

const TimeseriesSim = () => {
  //const { settings } = useSettings();
  const classes = useStyles();
  //const ref = useRef();

  const [advancedFilterPopup, setAdvancedFilterPopup] = useState(false);
  const advancedFilterClickOpen = () => {
    setAdvancedFilterPopup(true);
  };
  const advancedFilterClickClose = () => {
    setAdvancedFilterPopup(false);
  };

  const [firstRunForm, setFirstRunForm] = useState(initialFirstRunState);

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

  const VizTrial = (response) => {
    const data = response.data;
    const width = 960;
    const height = 500;
    const margin = 5;
    const padding = 100;
    const adj = 100;
    d3.select("#charts").html("");
    d3.select("#legend").html("");
    const svg = d3
      .select("#charts")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        "viewBox",
        "-" +
          adj +
          " -" +
          adj +
          " " +
          (width + adj * 3) +
          " " +
          (height + adj * 3),
      )
      .style("padding", padding)
      .style("margin", margin)
      .classed("svg-content", true);

    const parseTime = d3.timeParse("%Y-%m-%d");
    const formatTime = d3.timeFormat("%B %d, %Y");

    const minValue = findMinValue(data);
    const maxValue = findMaxValue(data);
    const targetID = firstRunForm.targetCountry + " " + firstRunForm.lastDate;
    const target = data[targetID];
    var date_lst = [];
    for (const i in target) {
      date_lst.push(target[i]["date"]);
    }
    const dateRange = date_lst.map(parseTime);
    const xScale = d3
      .scaleTime()
      .range([0, width])
      .domain(d3.extent(dateRange));
    const yScale = d3
      .scaleLinear()
      .rangeRound([height, 0])
      .domain([minValue, maxValue]);

    const yaxis = d3.axisLeft(yScale);

    const xaxis = d3.axisBottom(xScale);
    xaxis.tickFormat((d, i) => dateRange[i]);
    xaxis.tickFormat(formatTime);

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xaxis)
      .selectAll("text")
      .attr("transform", "translate(0,60) rotate(-45)")
      .style("font-size", "20px");

    svg
      .append("g")
      .attr("class", "axis")
      .call(yaxis)
      .selectAll("text")
      .style("font-size", "20px");

    const line = d3
      .line()
      .x(function (d) {
        return xScale(parseTime(d.date));
      }) // set the x values for the line generator
      .y(function (d) {
        return yScale(d.measurement);
      });

    let color = d3
      .scaleOrdinal()
      .domain(data)
      .range([
        "#a6cee3",
        "#1f78b4",
        "#b2df8a",
        "#33a02c",
        "#fb9a99",
        "#e31a1c",
        "#fdbf6f",
        "#ff7f00",
        "#cab2d6",
        "#6a3d9a",
        "#ffff99",
      ]);
    let count = 0;
    let legends = Object.keys(data);
    const legendsbox = d3
      .select("#legend")
      .append("div")
      .attr("background-color", "#9ea2a5")
      .append("ul");

    for (const i in data) {
      svg
        .append("path")
        .datum(data[i])
        .attr("fill", "none")
        .attr("stroke", color(count))
        .attr("stroke-width", 5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

      legendsbox
        .append("li")
        .style("color", color(count))
        .style("font-size", "20px")
        .append("span")
        .style("color", "black")
        .style("font-size", "10px")
        .text(legends[count].split(" ")[0]);
      count += 1;
    }

    console.log(response);
  };

  console.log(firstRunForm);
  const fetchAPI = () => {
    const apiUrl = "http://127.0.0.1:4010/stat/v1/timeseries-sim-search/";
    axios.post(apiUrl, firstRunForm).then((response) => VizTrial(response));
  };

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
          gridTemplateColumns: "0.2fr 1fr",
        }}
      >
        <Item width="300px">
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
                  <Button variant="outlined" color="primary" onClick={fetchAPI}>
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
                            <Checkbox
                              value={continent.value}
                              onChange={multipleHandleChange}
                              checked={
                                firstRunForm.continentCheck[continent.value]
                              }
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
          <Card>
            <CardContent>
              <div className={classes.container} id="container">
                <div className={classes.legend} id="legend"></div>
                <div className={classes.charts} id="charts"></div>
              </div>
            </CardContent>
          </Card>
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
