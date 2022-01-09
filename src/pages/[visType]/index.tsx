import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Helmet } from "react-helmet-async";
import { makeStyles } from "@mui/styles";
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
import _ from "lodash";
import { GetStaticPaths, GetStaticProps } from "next";
import useSettings from "src/hooks/useSettings";
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
  const { settings } = useSettings();
  const classes = useStyles();
  const router = useRouter();
  const visType =
    typeof router.query.visType === "string" ? router.query.visType : undefined;

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
                  title={visType && _.startCase(visType)}
                  subheader={`List of propagated ${visType} visualizations`}
                />

                <CardContent sx={{ pt: "8px" }}>
                  <PropagatedPageTable visType={visType} />
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
    paths: ["/analytics", "/dashboard", "/model", "/plot"],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};

export default PropagatedPageList;
