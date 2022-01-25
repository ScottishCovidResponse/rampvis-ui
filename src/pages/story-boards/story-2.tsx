import { useEffect, useState } from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { blue } from "@mui/material/colors";
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

  const [regions, setRegions] = useState<string[]>([]);
  const [region1, setRegion1] = useState<string>("");
  const [region2, setRegion2] = useState<string>("");
  const [animationCounter, setAnimationCounter] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const _regions = await processDataAndGetRegions();
      setRegions(_regions.map((d) => d));
    };

    fetchData().catch(console.error);
  }, []);

  const handleChangeSelect1 = (event: SelectChangeEvent) => {
    const selectedRegion1 = event.target.value;
    console.log("selectedRegion1 = ", selectedRegion1);
    if (selectedRegion1) {
      if (selectedRegion1 && region2) onSelectRegion(selectedRegion1, region2);
      createTimeSeriesSVG("#chart1");
      setRegion1(selectedRegion1);
      setAnimationCounter(0);
    }
  };

  const handleChangeSelect2 = (event: SelectChangeEvent) => {
    const selectedRegion2 = event.target.value;
    console.log("selectedRegion2 = ", selectedRegion2);
    if (selectedRegion2) {
      if (region1 && selectedRegion2) onSelectRegion(region1, selectedRegion2);
      createTimeSeriesSVG("#chart1");
      setRegion2(selectedRegion2);
      setAnimationCounter(0);
    }
  };

  const handleClickButton = () => {
    const count = animationCounter + 1;
    setAnimationCounter(count);
    console.log(count);
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
            <Card sx={{ minWidth: 1200 }}>
              <CardHeader
                avatar={
                  <Avatar className={classes.avatar}>
                    <AutoStoriesIcon />
                  </Avatar>
                }
                title="Story-2"
                subheader="This page is not tested and might have some bugs!"
              />
              <CardContent sx={{ pt: "8px" }}>
                <FormGroup>
                  <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                    <InputLabel id="select-region-label">
                      Select a region
                    </InputLabel>
                    <Select
                      labelId="select-region-label"
                      id="select-region-label"
                      displayEmpty
                      onChange={handleChangeSelect1}
                      value={region1}
                    >
                      {regions.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                    <InputLabel id="select-region-label">
                      Select a region
                    </InputLabel>
                    <Select
                      labelId="select-region-label"
                      id="select-region-label"
                      displayEmpty
                      onChange={handleChangeSelect2}
                      value={region2}
                    >
                      {regions.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                    <Button
                      variant="contained"
                      disabled={!region1 || !region2}
                      onClick={handleClickButton}
                    >
                      Click to proceed animation
                    </Button>
                  </FormControl>
                </FormGroup>

                <div id="chart1" />
              </CardContent>
            </Card>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Story2;
