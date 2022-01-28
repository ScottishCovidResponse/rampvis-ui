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
  createData,
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

  useEffect(() => {
    const fetchData = async () => {
      await createData();
      createScrollingSvg("#chart1");
    };
    fetchData().catch(console.error);
  }, []);

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
                title="Story-3"
                subheader="This page is not tested and might have some bugs!"
              />
              <CardContent sx={{ pt: "8px" }}>
                <div id="chart1" />
              </CardContent>
            </Card>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Story3;
