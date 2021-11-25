import { useState, ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { Grid, Box, Card, CardContent } from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import FirstForm from "src/components/timeseries-sim/FirstForm";
import AdvancedFilter from "src/components/timeseries-sim/AdvancedFilter";
import SearchButton from "src/components/timeseries-sim/SearchButton";
import { SegmentedMultiLinePlot } from "src/components/timeseries-sim/plotfunctions/segmentedmultilineplot";
import { FullMultiLinePlot } from "src/components/timeseries-sim/plotfunctions/fullmultilineplot.js";
import {
  covidIndicators,
  similarityMeasures,
  continents,
  plotTypes,
} from "src/components/timeseries-sim/variables/variables";
import { useStyles } from "src/components/timeseries-sim/style/style";
import GraphArea from "src/components/timeseries-sim/GraphArea";
import GraphTitle from "src/components/timeseries-sim/GraphTitle";
import { alignmentPlot } from "src/components/timeseries-sim/plotfunctions/alignmentplot";
const API = process.env.NEXT_PUBLIC_API_PY;

//first run object initalization
const initialFirstRunState = {
  targetCountry: "France",
  firstDate: "2021-07-02",
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
  plotType: "segmented",
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

  const plotSwitch = (response, firstRunForm) => {
    alignmentPlot(response, firstRunForm);
    SegmentedMultiLinePlot(response, firstRunForm);
  };

  const fetchAPI = () => {
    const apiUrl = `${API}/timeseries-sim-search/`;
    axios
      .post(apiUrl, firstRunForm)
      .then((response) => plotSwitch(response, firstRunForm));
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
                  plotTypes={plotTypes}
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
                  onClick={fetchAPI}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card>
              <GraphTitle />
              <GraphArea />
            </Card>
          </Grid>
          <Grid>
            <Card sx={{ width: 1 }}>
              <CardContent>
                <div id="alignmentchart" />
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
