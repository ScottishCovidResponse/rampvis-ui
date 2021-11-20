import { FC, useState } from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { blue } from "@mui/material/colors";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import Router from "next/router";
import useSettings from "src/hooks/useSettings";

interface Column {
  id: "title" | "function" | "type" | "pageType" | "date";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "title", label: "Page Title", minWidth: 100 },
  { id: "function", label: "VIS Function", minWidth: 100 },
  { id: "type", label: "Type", minWidth: 100 },
  { id: "pageType", label: "Page Type", minWidth: 100 },
  { id: "date", label: "Date", minWidth: 100 },
];

interface Data {
  id: string;
  vis: string;
  [key: string]: any;
}

interface PropagatedPageTableProps {
  loading: boolean;
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

const PropagatedPageTable: FC<PropagatedPageTableProps> = (props) => {
  const { settings } = useSettings();
  const classes = useStyles();
  const router = useRouter();
  const rows = props.data;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    Router.push(`/?page=${newPage}`);
    console.log("PropagatedPageTable: newPage = ", newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    console.log("PropagatedPageTable: setRowsPerPage = ", event.target.value);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="sticky table">
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
          {props?.loading ? (
            <Box
              sx={{
                display: "flex",
                width: "100%",
                height: 80,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress
                variant="indeterminate"
                color="primary"
              ></CircularProgress>
            </Box>
          ) : (
            <TableBody>
              {props.data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    onClick={() =>
                      router.push({ pathname: "/page", query: { id: row.id } })
                    }
                  >
                    {columns.map((column) => {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {row[column.id]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 100, 200, 300]}
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
