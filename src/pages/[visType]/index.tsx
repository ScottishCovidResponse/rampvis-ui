/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import StorageIcon from "@material-ui/icons/Storage";
import { blue } from "@material-ui/core/colors";
import moment from "moment";
import _ from "lodash";
import useSettings from "src/hooks/useSettings";
import { apiService } from "src/utils/apiService";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import PropagatedPageTable from "src/components/PropagatedPageTable";

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
  const { visType } = router.query;
  const [pages, setPages] = useState<any>([]);

  const pageType = "release";
  const url = `/template/pages/example/${visType}/`;
  console.log("PageListTemplate: visType = ", visType, ", API url = ", url);

  const fetchOntoPages = useCallback(async () => {
    try {
      const res = await apiService.get<any>(url);
      console.log("PageListTemplate: fetched data = ", res);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const pages = res.data.map((d) => {
        const { id, date } = d;
        return {
          id,
          visFunction: d?.vis?.function,
          visType: d?.vis?.type,
          visDescription: d?.vis?.description,
          pageType: d?.pageType,
          date: moment(date).format("DD-MM-YYYY"),
        };
      });

      console.log("rows = ", pages);
      setPages(pages);
    } catch (err) {
      // prettier-ignore
      console.error(`PageListTemplate: Fetching API ${url}, error = ${err}`);
    }
  }, [visType]);
  // if pageType, visType changes, useEffect will run again
  // if you want to run only once, just leave array empty []

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
                      <StorageIcon />
                    </Avatar>
                  }
                  title={
                    (_.startCase(visType) && _.startCase(visType)) ||
                    _.startCase(pageType)
                  }
                  subheader={`List of ${_.camelCase(pageType)} visualizations`}
                />

                <CardContent sx={{ pt: "8px" }}>
                  <PropagatedPageTable data={pages} />
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

export default PropagatedPageList;
