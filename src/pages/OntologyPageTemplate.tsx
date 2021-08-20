/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { FC, Props, useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Avatar,
  Box,
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
import TimelineIcon from '@material-ui/icons/Timeline';
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import axios from "axios";
import { useParams } from "react-router-dom";
import useSettings from "../hooks/useSettings";
import { visFactory } from "../lib/vis/vis-factory";

const API = {
  API_PY: process.env.REACT_APP_API_PY,
  API_JS: process.env.REACT_APP_API_JS,
}

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


const OntologyPageTemplate: FC = () => {
  const { pageId } = useParams(); // 60ae9fce8839aa3ae916e217
  console.log(pageId);

  const { settings } = useSettings();
  const classes = useStyles();

  const ref = useRef();

  const [X, setX] = useState<any>(null);

  const fetchMyAPI = useCallback(async () => {
    const apiUrl = `${API.API_JS}/template/page/${pageId}`;
    const res = await axios.get(apiUrl);
    const page = res.data;
    console.log("page data = ", page);

    const dataForVisFunction = await Promise.all(
      page?.bindingExts[0]?.data?.map(async (d: any) => {
        console.log(d.description, d.urlCode, d.endpoint);
        const endpoint = `${API[d.urlCode]}${d.endpoint}`;
        const values = (await axios.get(endpoint)).data;
        const { description } = d;
        return { endpoint, values, description };
      })
    );

    const links = page?.bindings[0]?.pageIds?.map((d: any) => {
      console.log(d);
      return `page/${d}`;
    });

    console.log("dataForVisFunction = ", dataForVisFunction);

    visFactory(page?.bindingExts[0]?.vis?.function, {
      chartElement: "charts", // ref.current,
      data: dataForVisFunction,
      links,
    });

  }, [pageId]);
  // if pageId changes, useEffect will run again
  // if you want to run only once, just leave array empty []

  useEffect(() => {
    console.log("OntologyPageTemplate: useEffect:");
    fetchMyAPI();
  }, [fetchMyAPI]);

  return (
    <>
      <Helmet>
        <title>[Ontology] Page</title>
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
                  title="Page Template ..."
                  subheader=""
                />

                <CardContent sx={{ pt: "8px" }}>
                  {/* <svg ref={ref}/> */}
                  <div id="charts" />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default OntologyPageTemplate;
