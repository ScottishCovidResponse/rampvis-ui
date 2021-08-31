/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, {ReactElement, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, CircularProgress, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useSettings from "src/hooks/useSettings";
import SearchBar from "src/components/search/SearchBar";
import SearchResultView from "src/components/search/SearchResultView";
import { apiService } from "src/utils/apiService";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";

const useStyles = makeStyles((theme) => ({}));

const PageSearch = () => {
  const { settings } = useSettings();
  const classes = useStyles();

  const [input, setInput] = useState("");
  const [result, setPageList] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchPage = async () => {
    try {
      setIsLoading(true);
      const res = await apiService.get<any>( `/template/pages/search/?query=${input}`);
      console.log("searchPage: res = ", res);
      setPageList(res);
      setIsLoading(false);
    } catch (err) {
      console.error("PageSearch: searhPage: error = ", err);
      setIsLoading(false);
    }
  };

  const handleChange = async (_input: string) => {
    console.log("handleChange: _input = ", _input);
    setInput(_input);
  };

  const handleClick = async () => {
    console.log("handleClick: input = ", input);
    searchPage();
  };

  return (
    <>
      <Helmet>
        <title>Search</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <>
            <SearchBar
              input={input}
              onChange={handleChange}
              onClick={handleClick}
            />
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              result &&
              result.length > 0 && <SearchResultView data={result} />
            )}
          </>
        </Container>
      </Box>
    </>
  );
};

PageSearch.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};


export default PageSearch;
