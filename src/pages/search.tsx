import React, { ReactElement, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, CircularProgress, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useSettings from "src/hooks/useSettings";
import SearchBar from "src/components/search/SearchBar";
import SearchResultView from "src/components/search/SearchResultView";
import { apiService } from "src/utils/apiService";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";

const useStyles = makeStyles((theme) => ({}));

const PageSearch = () => {
  const { settings } = useSettings();
  const classes = useStyles();
  const [result, setPageList] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchPage = async (_input) => {
    try {
      setIsLoading(true);
      const res = await apiService.get<any>(
        `/template/pages/search/?query=${_input}`,
      );
      console.log("searchPage: res = ", res);
      setPageList(res);
      setIsLoading(false);
    } catch (err) {
      console.error("PageSearch: searhPage: error = ", err);
      setIsLoading(false);
    }
  };

  const handleClick = async (input) => {
    console.log("PageSearch:handleClick: input = ", input);
    searchPage(input);
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
            <SearchBar onClick={handleClick} />

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
              result && result.length > 0 && <SearchResultView data={result} />
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
