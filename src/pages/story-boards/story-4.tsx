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
  processDataAndGetNations,
} from "src/components/story-boards/utils-story-4";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[500],
  },
}));

const Story4 = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState<string[]>([]);
  const [nations, setNations] = useState<string[]>([]);
  const [region, setRegion] = useState<string>("");
  const [nation, setNation] = useState<string>("");
  const [animationCounter, setAnimationCounter] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const _regions = await processDataAndGetRegions();
      setRegions(_regions);

      const _nations = await processDataAndGetNations();
      setNations(_nations);
    };

    try {
      setLoading(true);
      fetchData();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  const handleNationSelect = (event: SelectChangeEvent) => {
    const selectedNation = event.target.value;
    console.log("selectedNation = ", selectedNation);
    if (selectedNation) {
      if (selectedNation && region) {
        onSelectRegion(selectedNation, region);
      }
      createTimeSeriesSVG("#chart1");
      setNation(selectedNation);
      setAnimationCounter(0);
    }
  };

  const handleRegionSelect = (event: SelectChangeEvent) => {
    const selectedRegion = event.target.value;
    console.log("selectedRegion = ", selectedRegion);
    if (selectedRegion) {
      if (nation && selectedRegion) {
        onSelectRegion(nation, selectedRegion);
      }
      createTimeSeriesSVG("#chart1");
      setRegion(selectedRegion);
      setAnimationCounter(0);
    }
  };

  const handleBeginningButton = () => {
    const count = 0;

    setAnimationCounter(count);
    console.log("Story4: animationCounter = ", count);
    onClickAnimate(count, "#chart1");
  };

  const handleBackButton = () => {
    const count = animationCounter - 1;
    if (count < 0) return;

    setAnimationCounter(count);
    console.log("Story4: animationCounter = ", count);
    onClickAnimate(count, "#chart1");
  };

  const handlePlayButton = () => {
    const count = animationCounter + 1;
    setAnimationCounter(count);
    console.log("Story4: animationCounter = ", count);
    onClickAnimate(count, "#chart1");
  };

  return (
    <>
      <Head>
        <title>Story-4</title>
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
                title="Story-4"
                subheader="Choose a nation, a region and click play to animate the story"
              />
              <CardContent sx={{ pt: "8px" }}>
                {loading ? (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress />
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
                        <InputLabel id="select-nation-label">
                          Select nation{" "}
                        </InputLabel>
                        <Select
                          labelId="select-nation-label"
                          id="select-nation-label"
                          onChange={handleNationSelect}
                          input={<OutlinedInput label="Select nation" />}
                          value={nation}
                        >
                          {nations.map((d) => (
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
                        <InputLabel id="select-region-label">
                          Select region
                        </InputLabel>
                        <Select
                          labelId="select-region-label"
                          id="select-region-label"
                          displayEmpty
                          onChange={handleRegionSelect}
                          input={<OutlinedInput label="Select region" />}
                          value={region}
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
                          disabled={!region || !nation}
                          onClick={handleBeginningButton}
                          component="span"
                        >
                          Beginning
                        </Button>
                      </FormControl>

                      <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                        <Button
                          variant="contained"
                          disabled={!region || !nation}
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
                          disabled={!region || !nation}
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

export default Story4;
