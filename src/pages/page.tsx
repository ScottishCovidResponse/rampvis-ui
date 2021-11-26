import { ReactElement, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Avatar,
  Box,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Card,
  Fade,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { blue } from "@mui/material/colors";
import axios from "axios";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import { useRouter } from "next/router";

import useSettings from "src/hooks/useSettings";
import { visFactory } from "src/lib/vis/vis-factory";
import Bookmark from "src/components/Bookmark";
import { apiService } from "src/utils/apiService";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import { IData } from "src/models/IData";
import { ILink } from "src/models/ILink";
import { getLinks } from "src/utils/LinkService";

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
  avatar: {
    backgroundColor: blue[500],
  },
  icon: {
    fill: blue[500],
  },
}));

const PropagatedPage = () => {
  const { settings } = useSettings();
  const classes = useStyles();
  const router = useRouter();
  const pageId =
    typeof router.query.id === "string" ? router.query.id : undefined;
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchOntoPage = useCallback(async () => {
    if (!pageId) {
      return;
    }

    try {
      setLoading(true);

      const page = await apiService.get(`/template/page/${pageId}`);
      // eslint-disable-next-line no-console -- VIS developers need....
      console.log("[TEMPLATE] VIS Function = ", page.vis);
      // eslint-disable-next-line no-console -- VIS developers need....
      console.log("[TEMPLATE] Data = ", page.data);

      setTitle(page?.title);

      // fetch data streams
      const data = await Promise.all(
        page?.data?.map(async (d: any) => {
          const endpoint = `${API[d.urlCode]}${d.endpoint}`;
          const values = (await axios.get(endpoint)).data;
          const { id, description } = d;
          return { id, endpoint, values, description } as IData;
        }),
      );

      // fetch links
      const links: ILink[] = await Promise.all(
        page?.data?.map(async (d: any) => {
          const links: ILink[] = await getLinks(d.id);
          return links;
        }),
      );

      // eslint-disable-next-line no-console -- VIS developers need....
      console.log("[TEMPLATE] fetched data = ", data);
      console.log("[TEMPLATE] fetched links = ", links);

      visFactory(page?.vis?.function, {
        chartElement: "charts",
        data: data,
        links: links,
      });

      setLoading(false);
    } catch (err) {
      // prettier-ignore
      console.error(`PropagatedPage: Fetching data error = ${err}`);
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchOntoPage();
  }, [fetchOntoPage]);

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
                  // TODO:
                  // action={
                  //   <IconButton aria-label="settings">
                  //     { user?.id ? (<MoreVertIcon />) : (<TimelineIcon />)}
                  //   </IconButton>
                  //   <Bookmark pageId={pageId} />
                  // }
                  avatar={
                    <Avatar className={classes.avatar}>
                      <InsertChartIcon />
                    </Avatar>
                  }
                  title={title}
                  subheader=""
                />

                <CardContent sx={{ pt: "8px" }}>
                  {loading && (
                    <Box sx={{ height: 40 }}>
                      <Fade
                        in={loading}
                        style={{
                          transitionDelay: loading ? "800ms" : "0ms",
                        }}
                        unmountOnExit
                      >
                        <CircularProgress />
                      </Fade>
                    </Box>
                  )}
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

export default PropagatedPage;
