/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import type { FC } from "react";
import { Helmet } from "react-helmet-async";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import TimelineIcon from "@material-ui/icons/Timeline";

import useSettings from "../../hooks/useSettings";

const { REACT_APP_WS_URL } = process.env;
const spectrumAPI = `${REACT_APP_WS_URL}/consumer/spectrum`;
const ws = new WebSocket(spectrumAPI);

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: blue[500],
  },
  icon: {
    fill: blue[500],
  },
}));

const Spectrum: FC = () => {
  const { settings } = useSettings();
  const classes = useStyles();

  console.log("App: spectrumAPI: ", spectrumAPI);

  const [data, setData] = useState([]); // mockSpectrumDataPayload.body
  const [socketStatus, setSocketStatus] = useState(Date().toLocaleString());

  const onMessage = (event) => {
    const payload = JSON.parse(event.data);
    console.log("App.js:onMessage: received payload = ", payload);

    if ("status" in payload) {
      console.log(payload.status);
      setSocketStatus(payload.status);
    }

    if ("body" in payload) {
      setData(payload.body);
      setSocketStatus(payload.timestamp);
    }
  };

  useEffect(() => {
    console.log("App: useEffect: 1");
    ws.onmessage = onMessage;

    return () => {
      // TODO
      // ws.close();
    };
  });

  useEffect(() => {
    console.log("App: useEffect: 2");
  }, [data, socketStatus]);

  return (
    <>
      <Helmet>
        <title>Spectrum</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  avatar={
                    <Avatar className={classes.avatar}>
                      <TimelineIcon />
                    </Avatar>
                  }
                  title="Spectrum Plot"
                  subheader={socketStatus}
                />

                <CardContent sx={{ pt: "8px" }}>
                  Under construction
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Spectrum;
