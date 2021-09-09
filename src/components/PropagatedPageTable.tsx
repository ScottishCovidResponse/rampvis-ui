import { FC, useState } from "react";
import { makeStyles, IconButton } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { blue } from "@material-ui/core/colors";
import { useRouter } from "next/router";
import LinkIcon from "@material-ui/icons/Link";

import useSettings from "src/hooks/useSettings";
import Link from "next/link";

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

interface PropagatedPageTableProps {
  data: Data[];
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

// eslint-disable-next-line react/prop-types
const PropagatedPageTable: FC<PropagatedPageTableProps> = ({ data = [] }) => {
  const { settings } = useSettings();
  const classes = useStyles();
  const router = useRouter();
  const rows = data;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
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
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {/* {column.format &&
                                      typeof value === "number"
                                        ? column.format(value)
                                        : value} */}

                        {column.id === "id" ? (
                          <Link
                            href={{ pathname: "/page", query: { id: row.id } }}
                            passHref={true}
                          >
                            <IconButton
                              color="primary"
                              aria-label=""
                              component="a"
                            >
                              <LinkIcon />
                            </IconButton>
                          </Link>
                        ) : (
                          value
                        )}
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
  );
};

export default PropagatedPageTable;
