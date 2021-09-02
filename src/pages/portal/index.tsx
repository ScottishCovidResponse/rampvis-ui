/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Card,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import BookmarksIcon from "@material-ui/icons/Bookmarks";

import useSettings from "src/hooks/useSettings";
import { apiService } from "src/utils/apiService";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import AuthGuard from "src/components/auth/guards/AuthGuard";
import PortalView from "src/components/portal/PortalView";

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

const MyPortal = () => {
  console.log("MyPortal:");
  const theme = useTheme();
  const classes = useStyles();
  const { settings } = useSettings();

  // const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  // const { settings } = useSettings();
  // const [bookmarks, setBookmarks] = useState<any>([]);

  // const fetchBookmarks = useCallback(async () => {
  //   try {
  //     const res = await apiService.get<any>(`/bookmark`);
  //     console.log("PageListTemplate: fetched data = ", res);
  //     setBookmarks(res);
  //   } catch (err) {
  //     // prettier-ignore
  //     console.error(`PageListTemplate: Fetching error = ${err}`);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchBookmarks();
  // }, [fetchBookmarks]);

  const list = [
    "605e64ccdfb1d977d34aa3cc.png",
    "609728d27d47ae21406735bd.png",
    "60ecc0f3beb7791f01bebe49.png",
    "61006ed44fef9b1f276003de.png",
    "61031507be36153857a3de37.png",
    "608dd7dbd651fc539ce11801.png",
    "60ad693df52d2d641f4e45b9.png",
    "61006c9842248f1ef21219b1.png",
    "610314efc50719383382a6a2.png",
  ];
  return (
    <>
      <Helmet>
        <title>My Portal</title>
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
                  avatar={<BookmarksIcon />}
                  title={"My Bookmarks"}
                  subheader=""
                />

                <CardContent sx={{ pt: "8px" }}>
                  <PortalView data={list} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

MyPortal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </AuthGuard>
  );
};

export default MyPortal;
