/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme, makeStyles } from "@material-ui/core/styles";
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
import BookmarksIcon from "@material-ui/icons/Bookmarks";

import useSettings from "src/hooks/useSettings";
import { apiService } from "src/utils/apiService";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
// import AuthGuard from "src/components/auth/guards/AuthGuard";
import PortalView from "src/components/portal/PortalView";
import { mockPortalData } from "src/components/mock/portalData";

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

  const [portalData, setPortalData] = useState<any[]>(mockPortalData);
  const url = `/template/pages/example`; // TODO: Set correct URL once available

  const fetchPortalPages = useCallback(async () => {
    try {
      const res = (await apiService.get<any>(url))?.data;
      console.log("MyPortal: data = ", res);
      setPortalData(res);
    } catch (err) {
      // prettier-ignore
      console.error(`MyPortal: Fetching ${url}, error = ${err}`);
    }
  }, []);

  useEffect(() => {
    fetchPortalPages();
  }, [fetchPortalPages]);

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
                  avatar={
                    <Avatar className={classes.avatar}>
                      <BookmarksIcon />
                    </Avatar>
                  }
                  title="My Bookmarks"
                  subheader=""
                />

                <CardContent sx={{ pt: "8px" }}>
                  <PortalView data={portalData} />
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
    // <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
    // </AuthGuard>
  );
};

export default MyPortal;
