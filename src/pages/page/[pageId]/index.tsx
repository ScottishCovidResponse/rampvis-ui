/**
 * CSR
 */

import {
  ReactElement,
  useCallback,
  useEffect,
  useState
} from "react";
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

import { useRouter } from "next/router";

import useSettings from "src/hooks/useSettings";
import { visFactory } from "src/lib/vis/vis-factory";
import useAuth from "src/hooks/useAuth";
import Bookmark from "src/components/Bookmark";
import { apiService } from "src/utils/apiService";
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

const PropagatedPage = () => {
  // const { pageId } = useParams(); // 60ae9fce8839aa3ae916e217
  // console.log("PropagatedPage: pageId = ", pageId);
  // const { user } = useAuth();

  const { settings } = useSettings();
  const classes = useStyles();
  const router = useRouter();
  const { pageId } = router.query;
  const [ title, setTitle ] = useState<string>("");

  const fetchOntoPage = useCallback(async () => {
    const page = await apiService.get<any>(`/template/page/${pageId}`);
    console.log("PropagatedPage: page = ", page);

    setTitle(page?.title);

    const dataForVisFunction = await Promise.all(
      page?.data?.map(async (d: any) => {
        const endpoint = `${API[d.urlCode]}${d.endpoint}`;
        const values = (await axios.get(endpoint)).data;
        const { description } = d;
        return { endpoint, values, description };
      })
    );

    const links = page?.pageIds?.map((d: any) => {
      console.log(d);
      return `page/${d}`;
    });

    console.log("PropagatedPage: dataForVisFunction = ", dataForVisFunction);

    visFactory(page?.vis?.function, {
      chartElement: "charts", // ref.current,
      data: dataForVisFunction,
      links,
    });
  }, [pageId]);
  // if pageId changes, useEffect will run again
  // if you want to run only once, just leave array empty []

  useEffect(() => {
    console.log("PropagatedPage: useEffect:");
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
                  action={
                    // <IconButton aria-label="settings">
                    //   { user?.id ? (<MoreVertIcon />) : (<TimelineIcon />)}
                    // </IconButton>
                    <Bookmark pageId={pageId} />
                  }
                  avatar={<Avatar className={classes.avatar} />}
                  title={title}
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

export default PropagatedPage;
