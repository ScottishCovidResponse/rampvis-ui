/* eslint-disable prefer-const */
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
import StorageIcon from '@material-ui/icons/Storage';
import axios from "axios";
import useSettings from "../hooks/useSettings";
import { blue } from "@material-ui/core/colors";
import moment from "moment";

// Table code start

interface Column {
  id: "id" | "vis" | "visDescription" | "visType" | "bindingType" | "date" | "size" | "density";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "id", label: "Link", minWidth: 170 },
  { id: "vis", label: "VIS", minWidth: 100 },
  { id: "visDescription", label: "VIS (Description)", minWidth: 100 },
  { id: "visType", label: "VIS (Type)", minWidth: 100 },
  { id: "bindingType", label: "Type", minWidth: 100 },
  { id: "date", label: "Date", minWidth: 100 },

  //   label: "Population",
  //   minWidth: 170,
  //   align: "right",
  //   format: (value: number) => value.toLocaleString("en-US"),
  // },
  // {
  //   id: "size",
  //   label: "Size\u00a0(km\u00b2)",
  //   minWidth: 170,
  //   align: "right",
  //   format: (value: number) => value.toLocaleString("en-US"),
  // },
  // {
  //   id: "density",
  //   label: "Density",
  //   minWidth: 170,
  //   align: "right",
  //   format: (value: number) => value.toFixed(2),
  // },
];

interface Data {
  id: string;
  vis: string;
  [key: string]: any;
  // code: string;
  // population: number;
  // size: number;
  // density: number;
}

// function createData(
//   name: string,
//   code: string,
//   population: number,
//   size: number
// ): Data {
//   const density = population / size;
//   return { name, code, population, size, density };
// }

// const rows = [
//   createData("India", "IN", 1324171354, 3287263),
//   createData("China", "CN", 1403500365, 9596961),
//   createData("Italy", "IT", 60483973, 301340),
//   createData("United States", "US", 327167434, 9833520),
//   createData("Canada", "CA", 37602103, 9984670),
//   createData("Australia", "AU", 25475400, 7692024),
//   createData("Germany", "DE", 83019200, 357578),
//   createData("Ireland", "IE", 4857000, 70273),
//   createData("Mexico", "MX", 126577691, 1972550),
//   createData("Japan", "JP", 126317000, 377973),
//   createData("France", "FR", 67022000, 640679),
//   createData("United Kingdom", "GB", 67545757, 242495),
//   createData("Russia", "RU", 146793744, 17098246),
//   createData("Nigeria", "NG", 200962417, 923768),
//   createData("Brazil", "BR", 210147125, 8515767),
// ];

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
  const { bindingType } = useParams(); // example
  console.log(bindingType);

  const { settings } = useSettings();
  const [rows, setRows] = useState<any>([]);

  const fetchMyAPI = useCallback(async () => {
    const apiUrl = `http://localhost:2000/api/v1/template/pages/?filterPageType=${bindingType}`;
    const res = await axios.get(apiUrl);

    console.log(res.data);
    const pages = res.data.data.map((d) => {
      const { id, date, bindingExts } = d;

      return {
        id,
        vis: d.bindingExts[0]?.vis?.function,
        bindingType,
        date: moment(date).format("DD-MM-YYYY"),
        visDescription: d.bindingExts[0]?.vis?.description,
        visType: d.bindingExts[0]?.vis?.type,
      };
    });

    console.log("rows = ", pages);
    setRows(pages);
  }, [bindingType]);
  // if bindingType changes, useEffect will run again
  // if you want to run only once, just leave array empty []

  useEffect(() => {
    console.log("OntologyPageListTemplate: useEffect:");
    fetchMyAPI();
  }, [fetchMyAPI]);

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
        <title>[Ontology] Page List</title>
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
                  title={bindingType}
                  subheader=""
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
