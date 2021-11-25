/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { Helmet } from "react-helmet-async";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TableViewIcon from "@mui/icons-material/TableView";
import { blue } from "@mui/material/colors";
import moment from "moment";
import _ from "lodash";
import useSettings from "src/hooks/useSettings";
import { apiService } from "src/utils/apiService";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import PropagatedPageTable from "src/components/PropagatedPageTable";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "100%",
  },
  avatar: {
    backgroundColor: blue[500],
  },
  icon: {
    fill: blue[500],
  },
});

const PropagatedPageList = () => {
  // const mounted = useMounted();
  const { settings } = useSettings();
  const classes = useStyles();
  const router = useRouter();
  const [pages, setPages] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const pageType =
    typeof router.query.pageType === "string"
      ? router.query.pageType
      : undefined;

  const url = `/template/pages/${pageType}/`;
  console.log("PageListTemplate: pageType = ", pageType, ", API url = ", url);

  const fetchOntoPages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.get(url);
      console.log("PageListTemplate: fetched data = ", res);
      const pages = res.data.map((d) => {
        const { id, date } = d;
        return {
          id,
          function: d?.vis?.function,
          type: d?.vis?.type,
          title: d?.title,
          pageType: d?.pageType,
          date: moment(date).format("DD-MM-YYYY"),
        };
      });

      console.log("rows = ", pages);
      setPages(pages);
      setLoading(false);
    } catch (err) {
      // prettier-ignore
      console.error(`PageListTemplate: Fetching API ${url}, error = ${err}`);
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    console.log("PageListTemplate: useEffect:");
    fetchOntoPages();
  }, [fetchOntoPages]);

  return (
    <>
      <Helmet>
        <title>List of Pages</title>
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
                      <TableViewIcon />
                    </Avatar>
                  }
                  title={
                    (_.startCase(pageType) && _.startCase(pageType)) ||
                    _.startCase(pageType)
                  }
                  subheader={`List of ${_.camelCase(pageType)} pages`}
                />

                <CardContent sx={{ pt: "8px" }}>
                  <PropagatedPageTable loading={loading} data={pages} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

PropagatedPageList.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ["/propagated/example", "/propagated/release", "/propagated/review"],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};

export default PropagatedPageList;
