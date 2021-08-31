/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import useSettings from "src/hooks/useSettings";
import { apiService } from "src/utils/apiService";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import AuthGuard from "src/components/auth/guards/AuthGuard";

const MyPortal = () => {
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const { settings } = useSettings();
  const [bookmarks, setBookmarks] = useState<any>([]);

  const fetchBookmarks = useCallback(async () => {
    try {
      const url: string = `/bookmark`;
      const res = await apiService.get<any>(url);
      console.log("PageListTemplate: fetched data = ", res);
      setBookmarks(res);
    } catch (err) {
      // prettier-ignore
      console.error(`PageListTemplate: Fetching error = ${err}`);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <>
      <Helmet>
        <title>My Portal</title>
      </Helmet>
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
