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
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TimelineIcon from '@material-ui/icons/Timeline';
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import PropTypes from 'prop-types';

import useSettings from "src/hooks/useSettings";
import { visFactory } from "src/lib/vis/vis-factory";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
  

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
        bgcolor: 'black',
        color: 'white',
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


const TimeseriesSim = () => {
  const { settings } = useSettings();
  const classes = useStyles();

  const [indicator, setIndicator] = useState('DC');
  const [method, setMethod] = useState("euclidean");

  const ref = useRef();

  const [advancedFilterPopup, setAdvancedFilterPopup] = useState(false);

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
                defaultValue="2017-05-24"
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
                defaultValue="2017-05-24"
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
                id="first_run"
                label="Number of results"
                type="number"
                color="primary"
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
                <DialogTitle id="form-dialog-title">Title</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={advancedFilterClickClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={advancedFilterClickClose} color="primary">
                    Subscribe
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
