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
import { apiService } from "src/utils/ApiService";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import { ILink } from "src/models/ILink";
import { getLinks } from "src/utils/LinkService";
import { IOntoPageTemplate } from "src/models/IOntoPageTemplate";
import { IOntoData } from "src/models/IOntoData";

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

      const ontoPageTemplate: IOntoPageTemplate = await apiService.get(
        `/template/page/${pageId}`,
      );
      // eslint-disable-next-line no-console -- VIS developers need....
      console.log("[TEMPLATE] Page data structure = ", ontoPageTemplate);
      // eslint-disable-next-line no-console -- VIS developers need....
      console.log("[TEMPLATE] Data = ", ontoPageTemplate.ontoData);

      setTitle(ontoPageTemplate?.title);

      // fetch data stream values
      const ontoData = await Promise.all(
        ontoPageTemplate?.ontoData?.map(async (d: IOntoData) => {
          const endpoint = API[d.urlCode]
            ? `${API[d.urlCode]}${d.endpoint}`
            : d.endpoint;
          let values;
          try {
            values = (await axios.get(endpoint)).data;
          } catch (e) {
            console.error("[TEMPLATE]: Error fetching data. Error = ", e);
            return;
          }

          const links = d.links.map((l: ILink) => {
            return {
              ...l,
              url: `${window.location.origin}/page/?id=${l.pageId}`,
            };
          });
          return { ...d, endpoint, values, links } as IOntoData;
        }),
      );

      // eslint-disable-next-line no-console -- VIS developers need....
      console.log("[TEMPLATE] Data and its values = ", ontoData);
      // eslint-disable-next-line no-console -- VIS developers need....
      console.log("[TEMPLATE] Propagated links = ", ontoPageTemplate?.links);

      const visFactoryArg: any = {
        chartElement: "charts",
        data: ontoData,
      };

      if (ontoPageTemplate.links) {
        const links = ontoPageTemplate.links.map((l: ILink) => {
          return {
            ...l,
            url: `${window.location.origin}/page/?id=${l.pageId}`,
          };
        });
        visFactoryArg.links = links;
      }

      visFactory(ontoPageTemplate?.ontoVis?.function, visFactoryArg);
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
