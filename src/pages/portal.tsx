import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTheme, makeStyles } from "@mui/styles";
import {
  Avatar,
  Box,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Card,
  IconButton,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useSettings from "src/hooks/useSettings";
import { apiService } from "src/utils/apiService";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import AuthGuard from "src/components/auth/guards/AuthGuard";
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

  const fetchPortalPages = useCallback(async () => {
    try {
      // TODO: Set correct URL once available
      // const url = `/template/pages/example/plot/`;
      // const res = (await apiService.get<any>(url))?.data;
      // console.log("MyPortal: fetched data = ", res);
      // setPortalData(res);
    } catch (err) {
      // prettier-ignore
      console.error(`PageListTemplate: Fetching API, error = ${err}`);
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
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  avatar={
                    <Avatar className={classes.avatar}>
                      <BookmarksIcon />
                    </Avatar>
                  }
                  title="Portal"
                  subheader="List of my bookmarked pages"
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
