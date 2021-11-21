import React, { ReactElement, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  CircularProgress,
  Container,
  Card,
  CardContent,
} from "@mui/material";
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

  const searchPage = async (keywords) => {
    try {
      setIsLoading(true);
      const result = await apiService.get(
        `/template/pages/search/?query=${keywords}`,
      );

      const resultWithThumbnail = await Promise.all(
        result.map(async (d) => {
          try {
            const image = await apiService.get(`/template/thumbnail/${d.id}`);
            return { thumbnail: image, ...d };
          } catch (e) {
            return { thumbnail: null, ...d };
          }
        }),
      );

      console.log("searchPage: resultWithThumbnail = ", resultWithThumbnail);

      setPageList(resultWithThumbnail);
      setIsLoading(false);
    } catch (err) {
      console.error("PageSearch:searchPage: error = ", err);
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
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
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
                result &&
                result.length > 0 && <SearchResultView data={result} />
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

PageSearch.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default PageSearch;
