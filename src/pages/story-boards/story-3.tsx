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
  Fade,
  FormControl,
  FormGroup,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { blue } from "@mui/material/colors";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import {
  prepareData,
  createScrollingSvg,
  updateCounter,
} from "src/components/story-boards/utils-story-3";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[500],
  },
}));

const Story3 = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [nations, setNations] = useState<string[]>([
    "England",
    "Wales",
    "Northern Ireland",
    "Scotland",
  ]);
  const [nation, setNation] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await prepareData();
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
    const nation = event.target.value;
    console.log("selected nation = ", nation);
    if (nation) {
      setNation(nation);
      createScrollingSvg("#divId", nation);
    }
  };

  const handleBeginningButton = () => {
    updateCounter(0);
  };

  const handleBackButton = () => {
    updateCounter(-1);
  };

  const handlePlayButton = () => {
    updateCounter(1);
  };

  return (
    <>
      <Head>
        <title>Story-3</title>
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
                title="Story-3"
                subheader="Choose a nation and scroll the timeline to animate the story"
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
                      <FormControl
                        sx={{ m: 1, width: 300, mt: 0 }}
                        size="small"
                      >
                        <InputLabel id="select-nation-label">
                          Select nation
                        </InputLabel>
                        <Select
                          labelId="select-nation-label"
                          id="select-nation-label"
                          onChange={handleChangeSelect1}
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

                      <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                        <Button
                          variant="contained"
                          disabled={!nation}
                          onClick={handleBeginningButton}
                          component="span"
                        >
                          Beginning
                        </Button>
                      </FormControl>

                      <FormControl sx={{ m: 1, width: 100, mt: 0 }}>
                        <Button
                          variant="contained"
                          disabled={!nation}
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
                          disabled={!nation}
                          onClick={handlePlayButton}
                          endIcon={<ArrowForwardIosIcon />}
                          component="span"
                        >
                          Play
                        </Button>
                      </FormControl>
                    </FormGroup>

                    <div id="divId" />
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

export default Story3;
