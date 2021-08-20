/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import type { FC } from "react";
import { Helmet } from "react-helmet-async";
import {
  Avatar,
  Box,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Container,
  Card,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import useSettings from "../../hooks/useSettings";
import mockPhaseData from "src/mock/mockPhaseData";

const { REACT_APP_WS_URL } = process.env;
// TODO: To use waterfall topic /  API
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

const Waterfall: FC = () => {
  const { settings } = useSettings();
  const classes = useStyles();

  console.log("App: spectrumAPI: ", spectrumAPI);

  const [data, setData] = useState();
  const [socketStatus, setSocketStatus] = useState(Date().toLocaleString());

  return (
    <>
      <Helmet>
        <title>Waterfall</title>
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
                      <InsertChartIcon />
                    </Avatar>
                  }
                  title="Waterfall Plot"
                  subheader={socketStatus}
                />
                <CardContent sx={{ pt: "8px" }}>Under construction</CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Waterfall;
