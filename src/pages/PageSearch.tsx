/**
 * Search ontology generated pages
 */

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
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import axios from "axios";
import { useParams } from "react-router-dom";

import useSettings from "../hooks/useSettings";

import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { SearchProvider, Results, SearchBox } from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

const API = {
  API_PY: process.env.REACT_APP_API_PY,
  API_JS: process.env.REACT_APP_API_JS,
};

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

const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  endpointBase: "http://127.0.0.1:3002",
  cacheResponses: false,
});

const PageSearch: FC = () => {
  const { pageId } = useParams();
  console.log(pageId);

  const { settings } = useSettings();
  const classes = useStyles();

  const ref = useRef();

  const [X, setX] = useState<any>(null);

  const fetchOntoPage = useCallback(async () => {
    const apiUrl = `${API.API_JS}/template/page/${pageId}`;
    const res = await axios.get(apiUrl);
    const page = res.data;
    console.log("page data = ", page);

    const dataForVisFunction = await Promise.all(
      page?.data?.map(async (d: any) => {
        const endpoint = `${API[d.urlCode]}${d.endpoint}`;
        const values = (await axios.get(endpoint)).data;
        const { description } = d;
        return { endpoint, values, description };
      })
    );

    const links = page?.pageIds?.map((d: any) => {
      console.log(d);
      return `page/${d}`;
    });

    console.log(
      "OntologyPageTemplate: dataForVisFunction = ",
      dataForVisFunction
    );
  }, [pageId]);
  // if pageId changes, useEffect will run again
  // if you want to run only once, just leave array empty []

  useEffect(() => {
    console.log("OntologyPageTemplate: useEffect:");
    fetchOntoPage();
  }, [fetchOntoPage]);

  return (
    <>
      <Helmet>
        <title>Search</title>
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
                      <SearchIcon />
                    </Avatar>
                  }
                  title="Search"
                  subheader="Search for the ontology generated pages"
                />

                <CardContent sx={{ pt: "8px" }}>
                  <SearchProvider
                    config={{
                      apiConnector: connector,
                    }}
                  >
                    <div className="App">
                      <Layout
                        header={<SearchBox />}
                        bodyContent={
                          <Results titleField="title" urlField="nps_link" />
                        }
                      />
                    </div>
                  </SearchProvider>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default PageSearch;
