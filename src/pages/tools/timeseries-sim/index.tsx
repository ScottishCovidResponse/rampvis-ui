/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState, ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { Grid, Box, Card, CardContent } from "@material-ui/core";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import FirstForm from "src/components/timeseries-sim/FirstForm";
import AdvancedFilter from "src/components/timeseries-sim/AdvancedFilter";
import SubmitButton from "src/components/timeseries-sim/SubmitButton";
import GridItem from "src/components/timeseries-sim/GridItem";
import { MultiLinePlot } from "src/components/timeseries-sim/plotfunctions/multilineplot.js";
import {
  covidIndicators,
  similarityMeasures,
  continents,
} from "src/components/timeseries-sim/variables/variables";
import { useStyles } from "src/components/timeseries-sim/style/style";
import GraphArea from "src/components/timeseries-sim/GraphArea";

const API = process.env.NEXT_PUBLIC_API_PY;

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

const TimeseriesSim = () => {
  //const { settings } = useSettings();
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

  const fetchAPI = () => {
    const apiUrl = `${API}/timeseries-sim-search/`;
    axios
      .post(apiUrl, firstRunForm)
      .then((response) => MultiLinePlot(response, firstRunForm));
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
        <GridItem>
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
              <SubmitButton
                className={classes.firstRunForm}
                onClick={fetchAPI}
              />
            </CardContent>
          </Card>
        </GridItem>

        <GridItem>
          <Card>
            <CardContent>
              <GraphArea
                containerClass={classes.container}
                legendClass={classes.legend}
                chartsClass={classes.charts}
              />
              <Grid id="slider-range"></Grid>
            </CardContent>
          </Card>
        </GridItem>
      </Box>
    </>
  );
};
TimeseriesSim.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
export default TimeseriesSim;
