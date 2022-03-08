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
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import {
  processDataAndGetRegions,
  onSelectRegion,
  onClickAnimate,
  createTimeSeriesSVG,
} from "src/components/story-boards/utils-story-2";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  avatar: {
    backgroundColor: blue[500],
  },
  icon: {
    fill: blue[500],
  },
}));

const Story2 = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [region1, setRegion1] = useState<string>("");
  const [region2, setRegion2] = useState<string>("");
  const [animationCounter, setAnimationCounter] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const _regions = await processDataAndGetRegions();
      setRegions(_regions.map((d) => d));
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

  const handleClickButton = () => {
    const count = animationCounter + 1;
    setAnimationCounter(count);
    console.log("Story2: animationCounter = ", animationCounter);
    onClickAnimate(count, "#chart1");
  };

  return (
    <>
      <Head>
        <title>Story</title>
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
                  <Avatar className={classes.avatar}>
                    <AutoStoriesIcon />
                  </Avatar>
                }
                title="Story-2"
                subheader="Select two regions and click the button to animate"
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
                          style={{ backgroundColor: "orange", borderRadius: 0 }}
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
                          id="select-region-1-label"
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
                        <Tooltip title="Click to proceed animation">
                          <Button
                            variant="contained"
                            disabled={!region1 || !region2}
                            onClick={handleClickButton}
                            endIcon={<PlayArrowIcon />}
                            component="span"
                          >
                            Play
                          </Button>
                        </Tooltip>
                      </FormControl>
                    </FormGroup>
                    <div id="chart1" style={{ marginTop: "50px" }} />
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
