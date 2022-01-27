import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { makeStyles } from "@mui/styles";
import {
  Avatar,
  Box,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Card,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import useSettings from "src/hooks/useSettings";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import AuthGuard from "src/components/auth/guards/AuthGuard";
import PortalView from "src/components/portal/PortalView";
import { mockPortalData } from "src/components/mock/portalData";
import useAuth from "src/hooks/useAuth";
import { apiService } from "src/utils/ApiService";
import { IThumbnail } from "src/models/IThumbnail";

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
  const { user } = useAuth();
  const classes = useStyles();
  const { settings } = useSettings();
  const [portalData, setPortalData] = useState<any[]>(mockPortalData);

  const fetchPortalPages = useCallback(async () => {
    const portal: IThumbnail[] = await apiService.get(`/template/portal`);
    console.log("MyPortal: portal = ", portal);
    setPortalData(portal);
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
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </AuthGuard>
  );
};

export default MyPortal;
