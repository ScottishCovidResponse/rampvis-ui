/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */

/**
 * SSR
 */

import { ReactElement, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Avatar,
  Box,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Card,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import axios from "axios";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import useSettings from "src/hooks/useSettings";
import { visFactory } from "src/lib/vis/vis-factory";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";

const API = {
  API_PY: process.env.NEXT_PUBLIC_API_PY,
  API_JS: process.env.NEXT_PUBLIC_API_JS,
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

const PropagatedPage = (props) => {
  const { settings } = useSettings();
  const classes = useStyles();

  console.log("PropagatedPage: props = ", props);

  visFactory(props.visType, props.visArg);

  return (
    <>
      <Helmet>
        <title>Page</title>
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
                  avatar={<Avatar className={classes.avatar} />}
                  title="TODO: Title..."
                  subheader=""
                />

                <CardContent sx={{ pt: "8px" }}>
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

PropagatedPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getStaticProps: GetStaticProps = () => {
  return { props: {} };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: ["/page/remove-or-refactor-me/index__"],
    fallback: false,
  };
};

// FIXME: Remove / reuse the code below
export const getStaticPathsToRefactor: GetStaticPaths = async () => {
  const endpoint = `${process.env.NEXT_PUBLIC_API_JS}/template/pages/example/`;
  const { data } = await axios.get(endpoint);
  console.log("getStaticPaths: pages data = ", data.data);

  const paths = data.data.map((d) => ({ params: { pageId: d.id } }));
  console.log("paths = ", paths);

  return {
    paths,
    fallback: false,
  };
};

// FIXME: Remove / reuse the code below
export const getStaticPropsToRefactor: GetStaticProps = async ({
  params: { pageId },
}) => {
  const endpoint = `${process.env.NEXT_PUBLIC_API_JS}/template/page/${pageId}`;
  const { data } = await axios.get(endpoint);
  const page = data;
  console.log("getStaticProps: page data = ", page);

  const dataStreams = await Promise.all(
    page?.data?.map(async (d: any) => {
      const dataStreamEndpoint = `${API[d.urlCode]}${d.endpoint}`;
      const values = (await axios.get(dataStreamEndpoint)).data;
      const { description } = d;
      return { endpoint: dataStreamEndpoint, values, description };
    }),
  );

  return {
    props: {
      visType: page?.vis?.function,
      visArg: {
        chartElement: "charts",
        data: dataStreams,
        links: [],
      },
    },
  };
};

export default PropagatedPage;
