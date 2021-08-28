/**
 * Search ontology generated pages
 */

/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { FC, Props, useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, CircularProgress, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import useSettings from "../hooks/useSettings";
import PageSearchBar from "../components/PageSearch/PageSearchBar";
import PageList from "../components/PageSearch/PageList";
import { apiService } from "../services/apiService";
import wait from "../utils/wait";

const useStyles = makeStyles((theme) => ({}));

const PageSearch: FC = () => {
  const { settings } = useSettings();
  const classes = useStyles();

  const [input, setInput] = useState("");
  const [pageList, setPageList] = useState([]);
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
            <PageSearchBar
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
              pageList &&
              pageList.length > 0 && <PageList pageList={pageList} />
            )}
          </>
        </Container>
      </Box>
    </>
  );
};

export default PageSearch;
