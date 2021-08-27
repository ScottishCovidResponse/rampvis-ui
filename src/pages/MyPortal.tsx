/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { FC, useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Button, Container, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import useSettings from "../hooks/useSettings";
import { apiService } from "../services/apiService";
import useAuth from "src/hooks/useAuth";

const MyPortal: FC = () => {
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

export default MyPortal;
