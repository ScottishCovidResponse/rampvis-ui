import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  useTheme,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import useSettings from "src/hooks/useSettings";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";

import { Runtime, Inspector } from "@observablehq/runtime";
// import notebook from "@observablehq/how-to-embed-a-notebook-in-a-react-app";
import notebook from "@scottwjones/storytelling-system";
//import { countryRegions } from "@scottwjones/lockdown-restriction-data";

const useStyles = makeStyles((theme) => ({}));

const Story = () => {
  const theme = useTheme();
  const classes = useStyles();
  const { settings } = useSettings();

  // 1
  const animationRef = useRef();
  const animationSpeed = useRef();
  const [speed, setSpeed] = useState(0.1);

  let _setSpeed = (event) => {
    setSpeed(event.target.valueAsNumber);
    console.log(speed);
  };

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook, (name) => {
      if (name === "animation") {
        return new Inspector(animationRef.current);
      }
      if (name === "mutable speed") {
        return {
          fulfilled: (value) => {
            animationSpeed.current = value;
          },
        };
      }
    });
    console.log("useEffect 11", speed);
  }, []);

  useEffect(() => {
    console.log("useEffect 12", speed);
    if (animationSpeed.current) {
      animationSpeed.current.value = speed;
    }
  }, [speed]);

  // 2
  const tsRef = useRef();
  const animCtxRef = useRef();
  const countryRegions = useRef();
  // [
  //   "Aberdeen City",
  //   "Aberdeenshire",
  //   "Angus",
  //   "Argyll and Bute",
  //   "City of Edinburgh",
  //   "Clackmannanshire",
  //   "Comhairle nan Eilean Siar",
  //   "Dumfries and Galloway",
  //   "Dundee City",
  //   "East Ayrshire",
  //   "East Dunbartonshire",
  //   "East Lothian",
  //   "East Renfrewshire",
  //   "Falkirk",
  //   "Fife",
  //   "Glasgow City",
  //   "Inverclyde",
  //   "Midlothian",
  //   "North Ayrshire",
  //   "North Lanarkshire",
  //   // many more
  // ];
  const [region, setRegion] = useState("");

  const handleChange = (event) => {
    console.log(event);
  };

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook, (name) => {
      if (name === "ts") {
        return new Inspector(tsRef.current);
      }
      if (name === "animCtx") {
        return new Inspector(animCtxRef.current);
      }
      if (name === "viewof region") {
        return {
          fulfilled: (value) => {
            countryRegions.current = value;
            console.log("countryRegions.current = ", countryRegions);
          },
        };
      }
    });
    console.log("useEffect 21", countryRegions);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Story</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Card sx={{ minWidth: 1600 }}>
            <CardContent>
              {/* <div ref={animationRef}></div>
              <small>Speed: {speed}</small>
              <br />
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={speed}
                onChange={_setSpeed}
              /> */}

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select Regions
                </InputLabel>
                <select
                  //labelId="demo-simple-select-label"
                  //id="demo-simple-select"
                  value={region}
                  // label="Age"
                  onChange={handleChange}
                >
                  {countryRegions.values}
                </select>
              </FormControl>

              <div ref={tsRef} />
              <div ref={animCtxRef} />
            </CardContent>
          </Card>
        </Container>
      </Box>
    </div>
  );
};

Story.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Story;
