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
        p: 1,
        borderRadius: 1,
        textAlign: 'left',
        fontSize: 19,
        fontWeight: '700',
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
  }
]

const initialFirstRunState = {
  targetCountry: "",
  firstDate: "",
  lastDate: "",
  indicator: "DC",
  method: "euclidean",
  numberOfResults: 10,
  minPopulation: 600000,
  startDate: "",
  endDate: "",
  continentCheck: [
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

  ],

}



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



  const [firstRunForm, setFirstRunForm] = useState(initialFirstRunState);

  const multipleHandleChange = (event) => {

    if (event.target.type == "checkbox") {

      let temp_obj = { ...firstRunForm }
      let temp_state = temp_obj.continentCheck

      for (let i = 0; i < temp_state.length; i++) {

        if (event.target.value == temp_state[i].value) {

          let temp_element = { ...temp_state[i] }
          temp_element.isChecked = event.target.checked;
          temp_state[i] = temp_element;
          temp_obj.continentCheck = temp_state;
          setFirstRunForm(temp_obj)
        }
      }

    }
    else {
      const { name, value } = event.target;
      setFirstRunForm({
        ...firstRunForm,
        [name]: value,
      });
    }

  }

  console.log(firstRunForm)

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
                  <Button variant="outlined" color="primary" onClick={advancedFilterClickOpen}>
                    Advanced Filters
                  </Button>
                </div>
                <div className={classes.firstRunForm}>
                  <Button variant="outlined" color="primary">
                    Submit
                  </Button>
                </div>
                <Dialog open={advancedFilterPopup} onClose={advancedFilterClickClose} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Advanced Filters</DialogTitle>
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
                            InputProps={{ inputProps: { min: 500000, step: 50000 } }}
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
