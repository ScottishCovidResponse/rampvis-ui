import { makeStyles } from "@mui/styles";
import { blue } from "@mui/material/colors";

//react style function for creating css classes and assigning attributes
//https://casbin.org/CssToAndFromReact/ good website for conversions

export const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[500],
  },
  icon: {
    fill: blue[500],
  },
  firstRunForm: {
    marginBottom: theme.spacing(2),
    float: "left",
  },
  searchButton: {
    marginBottom: theme.spacing(2),
    float: "right",
  },

  chartTitle: {
    textAlign: "center",
  },
  chart: {
    height: "100%",
    width: "100%",
  },
}));
