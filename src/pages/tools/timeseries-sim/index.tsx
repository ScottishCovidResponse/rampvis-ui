/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Card, CardContent } from "@material-ui/core";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import FirstForm from "./components/FirstForm";
import AdvancedFilter from "./components/AdvancedFilter";
import SubmitButton from "./components/SubmitButton";
import GridItem from "./components/GridItem";
import { MultiLinePlot } from "./plotfunctions/multilineplot.js";
import {
  covidIndicators,
  similarityMeasures,
  continents,
} from "./variables/variables";
import { useStyles } from "./style/style";

//react style function for creating css classes and assigning attributes
//https://casbin.org/CssToAndFromReact/ good website for conversions
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

  const fetchAPI = () => {
    const apiUrl = "http://127.0.0.1:4010/stat/v1/timeseries-sim-search/";
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
              <div className={classes.container} id="container">
                <div className={classes.legend} id="legend"></div>
                <div className={classes.charts} id="charts"></div>
              </div>
              <div>
                <p id="value-range"></p>
              </div>
              <div>
                <div id="slider-range"></div>
              </div>
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
