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
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import {
  prepareData,
  createScrollingSvg,
} from "src/components/story-boards/utils-story-3";

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

const Story3 = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
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
                title="Story-3"
                subheader="Select a nation and scroll the timeline to animate"
              />
              <CardContent sx={{ pt: "8px" }}>
                {loading ? (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress />
                  </Box>
                ) : (
                  <>
                    <FormControl sx={{ m: 1, width: 300, mt: 0 }} size="small">
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
