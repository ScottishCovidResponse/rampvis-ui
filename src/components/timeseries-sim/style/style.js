import { makeStyles } from "@mui/styles";
import { blue } from "@mui/material/colors";

//react style function for creating css classes and assigning attributes
//https://casbin.org/CssToAndFromReact/ good website for conversions

export const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: blue[500],
  },
  icon: {
    fill: blue[500],
  },
  firstRunForm: {
    marginBottom: theme.spacing(2),
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1.8fr 0.2fr",
    gridTemplateRows: "1fr",
    gap: "0px 0px",
    gridTemplateAreas: '"charts legend"',
  },
  legend: {
    gridArea: "legend",
  },
  charts: {
    gridArea: "charts",
  },
}));
