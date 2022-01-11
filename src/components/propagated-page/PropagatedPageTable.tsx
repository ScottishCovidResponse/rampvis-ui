import { FC, useCallback, useEffect, useState } from "react";
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
import moment from "moment";
import { apiService } from "src/utils/ApiService";

interface Column {
  id: "title" | "function" | "numDataStreams" | "pageType" | "date";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "title", label: "Title", minWidth: 100 },
  { id: "function", label: "VIS function", minWidth: 50 },
  { id: "numDataStreams", label: "Num. data st.", minWidth: 10 },
  { id: "pageType", label: "Page flag", minWidth: 20 },
  { id: "date", label: "Date", minWidth: 100 },
];

interface Data {
  id: string;
  vis: string;
  [key: string]: any;
}

interface PropagatedPageTableProps {
  visType: string;
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
  const classes = useStyles();
  const router = useRouter();
  const PAGE_SIZE = 100;

  const [visType, setVisType] = useState(props.visType);
  const [pages, setPages] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);
  const url = `${process.env.NEXT_PUBLIC_API_JS}/template/pages/all/${visType}/?pageIndex=${pageIndex}&pageSize=${pageSize}`;

  const fetchPages = useCallback(async () => {
    try {
      // prettier-ignore
      // console.log(`PropagatedPageTable:fetchPages: pageIndex = ${pageIndex}, pageSize = ${pageSize}, url = ${url}`);
      setLoading(true);
      const res = await apiService.get(url);

      const _pages = res?.data.map((d) => {
        const { id, date } = d;
        return {
          id,
          function: d?.vis?.function,
          numDataStreams: d?.data?.length,
          title: d?.title,
          pageType: d?.pageType,
          date: moment(date).format("DD-MM-YYYY"),
        };
      });

      setPages(_pages);
      setTotalCount(res?.totalCount);
      setLoading(false);
    } catch (err) {
      // prettier-ignore
      console.error(`PropagatedPageTable:fetchPages: error fetching API ${url}, error = ${err}`);
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    // prettier-ignore
    // console.log(`PropagatedPageTable:useEffect: 1: props.visType = ${props.visType}`);
    setVisType(props.visType);
    setPageIndex(0);
    setPageSize(PAGE_SIZE);
  }, [props.visType]);

  useEffect(() => {
    // console.log(`PropagatedPageTable:useEffect: 2`);
    fetchPages && fetchPages();
  }, [fetchPages, pageIndex, pageSize, visType]);

  const handleChangePage = (event: any, newPage: number) => {
    setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPageSize(+event.target.value);
  };

  return (
    <Paper className={classes.root}>
      {loading ? (
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
        <div>
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

              <TableBody>
                {pages?.map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    onClick={() =>
                      router.push({
                        pathname: "/page",
                        query: { id: row.id },
                      })
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
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[100, 200, 300]}
            component="div"
            count={totalCount}
            rowsPerPage={pageSize}
            page={pageIndex}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      )}
    </Paper>
  );
};

export default PropagatedPageTable;
