import { ReactElement, useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  CardContent,
  CardHeader,
  Container,
  Card,
  Fade,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { blue } from "@mui/material/colors";
import axios from "axios";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import { useRouter } from "next/router";
import Head from "next/head";

import useSettings from "src/hooks/useSettings";
import { visFactory } from "src/lib/vis/vis-factory";
import Bookmark from "src/components/propagated-page/Bookmark";
import { apiService } from "src/utils/ApiService";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import { ILink } from "src/models/ILink";
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

  const resolveLinksUrl = (links) => {
    if (links && Array.isArray(links)) {
      return links.map((d: ILink) => {
        return {
          ...d,
          url: `${window.location.origin}/page/?id=${d.pageId}`,
        };
      });
    }

    if (links) {
      return {
        ...links,
        url: `${window.location.origin}/page/?id=${links.pageId}`,
      };
    }
  };

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
      console.log("[TEMPLATE] Page template data = ", ontoPageTemplate);
      // eslint-disable-next-line no-console -- VIS developers need....
      console.log("[TEMPLATE] Datastreams = ", ontoPageTemplate.data);

      setTitle(ontoPageTemplate?.title);

      // fetch data stream values
      const ontoData = await Promise.all(
        ontoPageTemplate?.data?.map(async (d: IOntoData) => {
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

          return {
            ...d,
            endpoint,
            values,
            links: resolveLinksUrl(d.links),
          } as IOntoData;
        }),
      );

      const visFactoryArg: any = {
        chartElement: "charts",
        data: ontoData,
      };

      if (ontoPageTemplate.propagatedLinks) {
        visFactoryArg.propagatedLinks = resolveLinksUrl(
          ontoPageTemplate.propagatedLinks,
        );
      }
      if (ontoPageTemplate.parentLink) {
        visFactoryArg.parentLink = resolveLinksUrl(ontoPageTemplate.parentLink);
      }
      if (ontoPageTemplate.childrenLinks) {
        visFactoryArg.childrenLinks = resolveLinksUrl(
          ontoPageTemplate.childrenLinks,
        );
      }

      // eslint-disable-next-line no-console -- VIS developers need....
      // prettier-ignore
      console.log("[TEMPLATE] VIS function = ", ontoPageTemplate.vis.function, "input = ", visFactoryArg,);

      visFactory(ontoPageTemplate.vis.function, visFactoryArg);
      setLoading(false);
    } catch (err) {
      console.error(`PropagatedPage: Fetching data error = ${err}`);
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchOntoPage();
  }, [fetchOntoPage]);

  return (
    <>
      <Head>
        <title>Page</title>
      </Head>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Card sx={{ minWidth: 1600 }}>
            <CardHeader
              action={
                <IconButton aria-label="settings">
                  <Bookmark pageId={pageId} />
                </IconButton>
              }
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
        </Container>
      </Box>
    </>
  );
};

PropagatedPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default PropagatedPage;
