/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState, ReactElement} from "react";
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
  CheckBox,
  FormControlLabel,
  FormGroup,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TimelineIcon from '@material-ui/icons/Timeline';
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import PropTypes from 'prop-types';
import useSettings from "src/hooks/useSettings";
import { visFactory } from "src/lib/vis/vis-factory";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import { ConfirmationNumberTwoTone, SignalWifiConnectedNoInternet4Sharp } from "@material-ui/icons";
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
  }
}));
function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        border: "red",
        p: 1,
        borderRadius: 1,
        textAlign: 'left',
        fontSize: 19,
        fontWeight: '700',
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
    label: "Daily Deaths per million",
    value: "DD",
  },
  {
    label: "Daily Cases per million",
    value: "DC"
  },
  {
    label: "Cumulative Deaths per million",
    value: "CD",
  },
  {
    label: "Cumulative Cases per million",
    value: "CC"
  },
  {
    label: "Biweekly Cases per million",
    value: "BWC",
  },
  {
    label: "Biweekly Deaths per million",
    value: "BWD"
  },
]
const similarityMeasures = [
  {
    label: "Euclidean Distance",
    value: "euclidean"
  },
  {
    label: "Manhattan Distance",
    value: "manhattan"
  },
  {
    label: "Chebyshev Distance",
    value: "chebyshev",
  },
  {
    label: "Dynamic Time Warping Distance",
    value: "dtw"
  },
  {
    label: "Longest Common Subsequence Distance",
    value: "lcs"
  },
]
const continents = [
  {
    value: "Africa",
    isChecked: false
  },
  {
    value: "Asia",
    isChecked: false
  },
  {
    value: "Australia",
    isChecked: false
  },
  {
    value: "Europe",
    isChecked: false
  },
  {
    value: "North America",
    isChecked: false
  },
  {
    value: "South America",
    isChecked: false
  }
]
const TimeseriesSim = () => {
  const { settings } = useSettings();
  const classes = useStyles();
  const [targetCountry,setTargetCountry] = useState(" ");
  const [firstDate,setFirstDate] = useState(" ");
  const [lastDate,setLastDate] = useState(" ");
  const [numberOfResults,setNumberOfResults] = useState(10);
  const [indicator, setIndicator] = useState("DC");
  const [method, setMethod] = useState("euclidean");
  const ref = useRef();
  const [advancedFilterPopup, setAdvancedFilterPopup] = useState(false);
  const [minPopulation,setMinPopulation] = useState(600000);
  const [startDate,setStartDate] = useState(" ");
  const [endDate,setEndDate] = useState(" ");
  const [continentCheck,setContinentCheck] = useState(continents);
  //const [continentFilter, setContinentFilter] = useState(new Array(continents.length).fill(false))
  const advancedFilterClickOpen = () => {
    setAdvancedFilterPopup(true);
  };
  const advancedFilterClickClose = () => {
    setAdvancedFilterPopup(false);
  };
  const indicatorChange = (event) => {
    setIndicator(event.target.value);
  };
  const methodChange = (event) => {
    setMethod(event.target.value);
  }
  const targetCountryChange = (event) => {
    setTargetCountry(event.target.value)
  }
  const firstDateChange = (event) => {
    setFirstDate(event.target.value)
  }
  const lastDateChange = (event) => {
    setLastDate(event.target.value)
  }
  const numberOfResultsChange = (event) => {
    setNumberOfResults(event.target.value)
  }
  const minPopulationChange = (event) => {
    setMinPopulation(event.target.value)
  }

  const startDateChange = (event) => {
    setStartDate(event.target.value) 
  }
  
  const endDateChange = (event) => {
    setEndDate(event.target.value)
  }

  const continentCheckChange = (event) => {
    let temp_state = [...continentCheck]
    for(let i =0;i<temp_state.length;i++){
      if (event.target.value == temp_state[i].value){
        let temp_element = {...temp_state[i]}
        temp_element.isChecked = event.target.checked 
        temp_state[i] = temp_element
        setContinentCheck(temp_state)
      }
    } 
  }


  const fetchAPI = useCallback(async () => {
    // const apiUrl = `${API.API_PY}/...}`;
    // const res = await axios.get(apiUrl);
    // console.log("TimeseriesSim: res = ", res);
    const res = ['tunas', 'fake', 'data'];
    visFactory('TimeseriesSim', {
      chartElement: "charts", // ref.current,
      data: res,
    });
  }, []);
  // if xx changes, useEffect will run again
  // if you want to run only once, just leave array empty []
  useEffect(() => {
    console.log("TimeseriesSim: useEffect:");
    fetchAPI();
  }, [fetchAPI]);

  //console.log(`${firstDate}-${lastDate}`)
  console.log(continentCheck)
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
          display: 'grid',
          gap: 1,
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Item>
          <form>
            <div className={classes.firstRunForm}>
              <TextField
                id="first_run"
                label="Target Country"
                type="text"
                color="primary"
                variant="standard"
                value = {targetCountry}
                onChange = {targetCountryChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className={classes.firstRunForm}>
              <TextField
                id="first_run"
                label="First Date"
                type="date"
                color="primary"
                variant="standard"
                value = {firstDate}
                onChange = {firstDateChange}
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
                value = {lastDate}
                onChange = {lastDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className={classes.firstRunForm}>
              <TextField
                select
                label="Covid Indicator"
                value={indicator}
                variant="standard"
                onChange={indicatorChange}
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
                value={method}
                variant="standard"
                onChange={methodChange}
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
                variant="standard"
                value = {numberOfResults}
                onChange = {numberOfResultsChange}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{ inputProps: { min: 0, max: 10 } }}
              />
            </div>
            <div className={classes.firstRunForm}>
              <Button variant="outlined" color="primary" onClick={advancedFilterClickOpen}>
                Advanced Filters
              </Button>
              <Dialog open={advancedFilterPopup} onClose={advancedFilterClickClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Advanced Filters</DialogTitle>
                <DialogTitle>Continents to include:</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <FormGroup>
                      {continents.map((continent) => (
                        <label key={continent.id}>
                          {continent.value}
                          <input
                            type="checkbox"
                            value={continent.value}
                            onChange = {continentCheckChange}
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
                          value = {minPopulation}
                          onChange = {minPopulationChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{ inputProps: { min: 500000, step:50000 } }}
                        />
                      </div>
                      <div className={classes.firstRunForm}>
                        <TextField
                          id="first_run"
                          label="Start Date"
                          type="date"
                          color="primary"
                          variant="standard"
                          value = {startDate}
                          onChange = {startDateChange}
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
                          value = {endDate}
                          onChange = {endDateChange}
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
            </div>
          </form>
        </Item>
        <Item>
          <Container maxWidth={settings.compact ? "xl" : false}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    avatar={
                      <Avatar className={classes.avatar}>
                        <TimelineIcon />
                      </Avatar>
                    }
                    title="First Output D3 Container"
                    subheader=""
                  />
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
