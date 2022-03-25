import { useEffect, useState } from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Fade,
  FormControl,
  FormGroup,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { blue } from "@mui/material/colors";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import {
  processDataAndGetRegions,
  onSelectRegion,
  onClickAnimate,
  createTimeSeriesSVG,
} from "src/components/story-boards/utils-story-2";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[500],
  },
}));

const Story2 = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState<boolean>(true);
  const [regions, setRegions] = useState<string[]>([]);
  const [region1, setRegion1] = useState<string>("");
  const [region2, setRegion2] = useState<string>("");
  const [animationCounter, setAnimationCounter] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const _regions = await processDataAndGetRegions();
      setRegions(_regions);
      setLoading(false);
    };

    try {
      fetchData();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  const handleChangeSelect1 = (event: SelectChangeEvent) => {
    const selectedRegion1 = event.target.value;
    console.log("selectedRegion1 = ", selectedRegion1);
    if (selectedRegion1) {
      if (selectedRegion1 && region2) {
        onSelectRegion(selectedRegion1, region2);
      }
      createTimeSeriesSVG("#chart1");
      setRegion1(selectedRegion1);
      setAnimationCounter(0);
    }
  };

  const handleChangeSelect2 = (event: SelectChangeEvent) => {
    const selectedRegion2 = event.target.value;
    console.log("selectedRegion2 = ", selectedRegion2);
    if (selectedRegion2) {
      if (region1 && selectedRegion2) {
        onSelectRegion(region1, selectedRegion2);
      }
      createTimeSeriesSVG("#chart1");
      setRegion2(selectedRegion2);
      setAnimationCounter(0);
    }
  };

  const handleBeginningButton = () => {
    const count = 0;

    setAnimationCounter(count);
    console.log("Story2: animationCounter = ", count);
    onClickAnimate(count, "#chart1");
  };

  const handleBackButton = () => {
    const count = animationCounter - 1;
    if (count < 0) return;

    setAnimationCounter(count);
    console.log("Story2: animationCounter = ", count);
    onClickAnimate(count, "#chart1");
  };

  const handlePlayButton = () => {
    const count = animationCounter + 1;
    setAnimationCounter(count);
    console.log("Story2: animationCounter = ", count);
    onClickAnimate(count, "#chart1");
  };

  return (
    <>
      <Head>
        <title>Story-2</title>
      </Head>
      <DashboardLayout>
        <Box
          sx={{
            backgroundColor: "background.default",
            minHeight: "100%",
            py: 8,
          }}
        >
          <Container>
            <Card sx={{ minWidth: 1300 }}>
              <CardHeader
                avatar={
                  <Avatar style={{ backgroundColor: blue[500] }}>
                    <AutoStoriesIcon />
                  </Avatar>
                }
                title="Story-2"
                subheader="Choose two regions and click play to animate the story"
              />
              <CardContent sx={{ pt: "8px" }}>
                {loading ? (
                  <Box sx={{ height: 40 }}>
                    <Fade
                      in={loading}
                      style={{
                        transitionDelay: loading ? "800ms" : "0ms",
                      }}
                      unmountOnExit
                    >
                      <LinearProgress />
                    </Fade>
                  </Box>
                ) : (
                  <>
                    <FormGroup
                      sx={{
                        flexDirection: {
                          xs: "column",
                          sm: "row",
                          alignItems: "center",
                        },
                      }}
                    >
                      <FormControl sx={{ m: 1, width: 20, mt: 0 }} size="small">
                        <Chip
                          label=""
                          style={{
                            backgroundColor: "orange",
                            borderRadius: 0,
                          }}
                        />
                      </FormControl>
                      <FormControl
                        sx={{ m: 1, width: 300, mt: 0 }}
                        size="small"
                      >
                        <InputLabel id="select-region-1-label">
                          Select region 1
                        </InputLabel>
                        <Select
                          labelId="select-region-1-label"
                          id="select-region-1-label"
                          onChange={handleChangeSelect1}
                          input={<OutlinedInput label="Select region 1" />}
                          value={region1}
                        >
                          {regions.map((d) => (
                            <MenuItem key={d} value={d}>
                              {d}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <span style={{ width: 30 }}></span>
                      <FormControl sx={{ m: 1, width: 20, mt: 0 }} size="small">
                        <Chip
                          label=""
                          style={{
                            backgroundColor: "steelblue",
                            borderRadius: 0,
                          }}
                        />
                      </FormControl>
                      <FormControl
                        sx={{ m: 1, width: 300, mt: 0 }}
                        size="small"
                      >
                        <InputLabel id="select-region-2-label">
                          Select region 2
                        </InputLabel>
                        <Select
                          labelId="select-region-2-label"
                          id="select-region-2-label"
                          displayEmpty
                          onChange={handleChangeSelect2}
                          input={<OutlinedInput label="Select region 2" />}
                          value={region2}
                        >
                          {regions.map((d) => (
                            <MenuItem key={d} value={d}>
                              {d}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                        <Button
                          variant="contained"
                          disabled={!region1 || !region2}
                          onClick={handleBeginningButton}
                          component="span"
                        >
                          Beginning
                        </Button>
                      </FormControl>

                      <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                        <Button
                          variant="contained"
                          disabled={!region1 || !region2}
                          onClick={handleBackButton}
                          startIcon={<ArrowBackIosIcon />}
                          component="span"
                        >
                          Back
                        </Button>
                      </FormControl>

                      <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                        <Button
                          variant="contained"
                          disabled={!region1 || !region2}
                          onClick={handlePlayButton}
                          endIcon={<ArrowForwardIosIcon />}
                          component="span"
                        >
                          Play
                        </Button>
                      </FormControl>
                    </FormGroup>
                    <div id="chart1" />
                  </>
                )}
              </CardContent>
            </Card>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Story2;
