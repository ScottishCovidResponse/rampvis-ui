/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import StorageIcon from "@material-ui/icons/Storage";
import LinkIcon from '@material-ui/icons/Link';
import { blue } from "@material-ui/core/colors";
import moment from "moment";
import axios from "axios";
import _ from "lodash";

import useSettings from "../hooks/useSettings";
import useQuery from "src/hooks/useQuery";
import useMounted from "src/hooks/useMounted";

const API_JS = process.env.REACT_APP_API_JS;

// Table code start

interface Column {
  id: "id" | "visFunction" | "visDescription" | "visType" | "pageType" | "date";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "id", label: "Link", minWidth: 170 },
  { id: "visFunction", label: "VIS", minWidth: 100 },
  { id: "visDescription", label: "VIS (Description)", minWidth: 100 },
  { id: "visType", label: "VIS (Type)", minWidth: 100 },
  { id: "pageType", label: "Page (Type)", minWidth: 100 },
  { id: "date", label: "Date", minWidth: 100 },

  //   label: "XX",
  //   minWidth: 170,
  //   align: "right",
  //   format: (value: number) => value.toLocaleString("en-US"),  // OR
  //   format: (value: number) => value.toFixed(2), // OR
  //   format: (value: number) => value.toLocaleString("en-US"),
];

interface Data {
  id: string;
  vis: string;
  [key: string]: any;
}

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

const OntologyPageListTemplate: FC = () => {
  // const mounted = useMounted();
  const { settings } = useSettings();

  // Dynamic url path
  const { pageType } = useParams();
  const { visType } = useParams();
  const apiUrl: URL = new URL(`${API_JS}/template/pages/${pageType}/${visType}/`);

  // Query to use for pagination of tables
  const query = useQuery();
  // if (pageType) apiUrl.searchParams.append("page", query.get("page"));
  // if (visType) apiUrl.searchParams.append("index", query.get("index"));

  console.log("OntologyPageListTemplate: apiUrl = ", apiUrl.href);

  const [rows, setRows] = useState<any>([]);

  const fetchOntoPages = useCallback(async () => {
    try {
      const res = await axios.get(apiUrl.href);
      console.log('OntologyPageListTemplate: fetched data = ', res.data);
      const pages = res.data.data.map((d) => {
        const { id, date } = d;
        return {
          id,
          visFunction: d?.vis?.function,
          visType: d?.vis?.type,
          visDescription: d?.vis?.description,
          pageType: d?.pageType,
          date: moment(date).format("DD-MM-YYYY"),
        };
      });

      console.log("rows = ", pages);
      setRows(pages);
    } catch (err) {
      // prettier-ignore
      console.error(`OntologyPageListTemplate: Fetching API ${apiUrl}, error = ${err}`);
    }
  }, [pageType, visType]);
  // if pageType, visType changes, useEffect will run again
  // if you want to run only once, just leave array empty []

  useEffect(() => {
    console.log("OntologyPageListTemplate: useEffect:");
    fetchOntoPages();
  }, [fetchOntoPages]);

  // Table code

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Helmet>
        <title>RAMPVIS- List of Pages</title>
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
                      <StorageIcon />
                    </Avatar>
                  }
                  title={_.startCase(visType)}
                  subheader={`List of ${_.camelCase(pageType)} visualizations of type ${_.camelCase(visType)} `}
                />

                <CardContent sx={{ pt: "8px" }}>
                  {/* Start of table code */}
                  <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.code}
                              >
                                {columns.map((column) => {
                                  const value = row[column.id];
                                  return (
                                    <TableCell
                                      key={column.id}
                                      align={column.align}
                                    >
                                      {/* {column.format &&
                                      typeof value === "number"
                                        ? column.format(value)
                                        : value} */}
                                      <Link
                                        to={`/page/${row.id}`}
                                        style={{
                                          textDecoration: "none",
                                          color: "black",
                                        }}
                                      >
                                        {value}
                                      </Link>
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[100, 200, 300]}
                      component="div"
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Paper>

                  {/* End of table code */}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default OntologyPageListTemplate;
