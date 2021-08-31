/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ReactElement, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useRouter } from "next/router";
import _ from "lodash";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import useSettings from "src/hooks/useSettings";
import UnderConstruction from "src/components/errors/UnderConstruction";

const MyPortal = () => {
  const { settings } = useSettings();
  const router = useRouter();
  const { country } = router.query;

  return (
    <>
      <Helmet>
        <title>{_.startCase(country)}</title>
      </Helmet>

      <UnderConstruction />
    </>
  );
};

MyPortal.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MyPortal;
